import * as React from "react";
import { StatsService } from "@/core/services/stats-service";
import { findPageForWordIndex } from "../utils/binarySearch";
import { SettingsState } from "@/core/entities/settings";
import { toast } from "sonner";

function getStdDev(arr: number[]): { mean: number; stdDev: number } {
  if (arr.length === 0) return { mean: 0, stdDev: 0 };
  const mean = arr.reduce((s, x) => s + x, 0) / arr.length;
  const variance = arr.reduce((s, x) => s + Math.pow(x - mean, 2), 0) / arr.length;
  return { mean, stdDev: Math.sqrt(variance) };
}

export interface TelemetryTrackerProps {
  activeBookId: string | null;
  bookTitle: string;
  mode: "normal" | "rsvp" | "cluster";
  isPlaying: boolean;
  wordIndex: number;
  activeChapterIndex: number;
  allBookPages: any[];
  theme: string;
  settings: SettingsState;
  wpm: number;
}

export function useTelemetryTracker({
  activeBookId,
  bookTitle,
  mode,
  isPlaying,
  wordIndex,
  activeChapterIndex,
  allBookPages,
  theme,
  settings,
  wpm,
}: TelemetryTrackerProps) {
  // Store session metadata in refs to prevent micro-render stutters
  const sessionRef = React.useRef({
    id: "",
    bookId: "",
    bookTitle: "",
    mode: "" as "normal" | "rsvp" | "cluster",
    activeSeconds: 0,
    wordsRead: 0,
    speedHistory: [] as { offsetSeconds: number; wpm: number }[],
    regressionEvents: [] as number[],
    interruptionCount: 0,
    lastWordIndex: 0,
    lastPageIndex: -1,
    pageStartTime: 0,
    lastInteractionTime: 0,
    lastPageChangeTime: 0,
    isActiveSession: false,
    startTime: 0,
    pageTurnIntervals: [] as number[],
    isFlowState: false,
    hasTriggeredFatigueWarning: false,
  });

  const themeRef = React.useRef(theme);
  React.useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Keep state tracked in reference to prevent interval dependency re-runs
  const stateRef = React.useRef({
    activeBookId,
    bookTitle,
    mode,
    isPlaying,
    wordIndex,
    activeChapterIndex,
    allBookPages,
    settings,
    wpm,
  });

  React.useEffect(() => {
    stateRef.current = {
      activeBookId,
      bookTitle,
      mode,
      isPlaying,
      wordIndex,
      activeChapterIndex,
      allBookPages,
      settings,
      wpm,
    };
  }, [activeBookId, bookTitle, mode, isPlaying, wordIndex, activeChapterIndex, allBookPages, settings, wpm]);

  // Core flush logic (declared at the top to prevent temporal hoisting warnings in useEffects)
  const flushSession = React.useCallback(async (forced = false, snapshotOverride?: any) => {
    // Use either the provided snapshot (for atomic splits) or the current ref
    const session = snapshotOverride || { ...sessionRef.current };
    
    if (!session.isActiveSession || !session.bookId) return;

    // If we're using the live ref, mark it inactive immediately
    if (!snapshotOverride) {
      sessionRef.current.isActiveSession = false;
    }

    const state = stateRef.current;
    const duration = session.activeSeconds;

    let wordsRead = session.wordsRead;
    if (state.mode === "normal") {
      // Estimate words read in Normal Mode based on average WPM
      const avgWpm = session.speedHistory.length > 0
        ? Math.round(session.speedHistory.reduce((s: number, h: { wpm: number }) => s + h.wpm, 0) / session.speedHistory.length)
        : 280;
      wordsRead = Math.round((duration / 60) * avgWpm);
    }

    // Noise filtering (discard sessions < 15s and < 15 words, unless forced by quiz completion)
    if (!forced && duration < 15 && wordsRead < 15) {
      console.log(`[Telemetry] Session discarded (noise filter: ${duration}s, ${wordsRead} words).`);
      return;
    }

    // Compute final session averages
    let finalWpm = state.mode === "normal" ? 280 : state.wpm;
    if (session.speedHistory.length > 0) {
      finalWpm = Math.round(session.speedHistory.reduce((s: number, h: { wpm: number }) => s + h.wpm, 0) / session.speedHistory.length);
    }

    const themeFactor = themeRef.current === "light" ? 1.0 : 0.6;
    const modeFactor = state.mode === "rsvp" ? 1.5 : 1.0;
    const eyeStrainIndex = parseFloat(((duration / 1200) * themeFactor * modeFactor).toFixed(2));

    const telemetryData = {
      speed_history: session.speedHistory,
      regression_events: session.regressionEvents,
      interruption_count: session.interruptionCount,
      eye_strain_index: eyeStrainIndex,
      focus_level: session.interruptionCount === 0 
        ? "Excellent focus" 
        : session.interruptionCount <= 2 
          ? "Good focus" 
          : "Frequent interruptions",
      device_context: {
        device_type: typeof window !== "undefined" && window.innerWidth <= 768 ? "mobile" : "desktop",
        screen_width: typeof window !== "undefined" ? window.innerWidth : 1200,
        theme: themeRef.current,
        font_size: state.mode === "rsvp" 
          ? state.settings.rsvp.fontSize 
          : state.mode === "cluster" 
            ? state.settings.cluster.fontSize 
            : state.settings.general.readerFontSize,
      },
    };

    console.log(`[Telemetry] Saving telemetry log: "${session.bookTitle}" (${duration}s, ${finalWpm} WPM, ${wordsRead} words)`);

    try {
      await StatsService.recordSession({
        bookId: session.bookId,
        bookTitle: session.bookTitle,
        mode: state.mode,
        speedWpm: finalWpm,
        durationSeconds: duration,
        accuracy: null, // No quiz taken during this background session tracking
        telemetryData: telemetryData,
      });
    } catch (err) {
      console.warn("[Telemetry] Failed to persist session log:", err);
    }
  }, []);

  // Flush and reset session whenever activeBookId changes
  React.useEffect(() => {
    if (!activeBookId) {
      if (sessionRef.current.isActiveSession) {
        flushSession();
      }
      return;
    }

    // Initialize session structure
    sessionRef.current = {
      id: `log-${crypto.randomUUID()}`,
      bookId: activeBookId,
      bookTitle: bookTitle,
      mode: mode,
      activeSeconds: 0,
      wordsRead: 0,
      speedHistory: [],
      regressionEvents: [],
      interruptionCount: 0,
      lastWordIndex: wordIndex,
      lastPageIndex: -1,
      pageStartTime: Date.now(),
      lastInteractionTime: Date.now(),
      lastPageChangeTime: Date.now(),
      isActiveSession: true,
      startTime: Date.now(),
      pageTurnIntervals: [],
      isFlowState: false,
      hasTriggeredFatigueWarning: false,
    };

    if (mode === "normal" && allBookPages.length > 0) {
      const page = findPageForWordIndex(allBookPages, activeChapterIndex, wordIndex);
      if (page) {
        sessionRef.current.lastPageIndex = page.absolutePageIndex;
      }
    }

    console.log(`[Telemetry] Started reading tracker session for "${bookTitle}" (Session ID: ${sessionRef.current.id})`);

    return () => {
      // Flush session on unmount or book transition
      flushSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBookId, flushSession]);

  // Monitor page changes and regressions reactively
  React.useEffect(() => {
    if (!activeBookId || !sessionRef.current.isActiveSession) return;

    const session = sessionRef.current;
    const prevWordIndex = session.lastWordIndex;
    session.lastWordIndex = wordIndex;

    const wordDiff = wordIndex - prevWordIndex;

    // Detect reading regressions (user rewinds or clicks back)
    if (wordDiff < 0) {
      session.regressionEvents.push(session.activeSeconds);
      console.debug(`[Telemetry] Regression event logged at offset ${session.activeSeconds}s`);
    }

    if (mode === "normal" && allBookPages.length > 0) {
      const page = findPageForWordIndex(allBookPages, activeChapterIndex, wordIndex);
      if (page) {
        const prevPageIndex = session.lastPageIndex;
        const currentAbsoluteIndex = page.absolutePageIndex;
        session.lastPageIndex = currentAbsoluteIndex;

        // Trigger page-level telemetry calculation upon page transitions
        if (prevPageIndex !== -1 && prevPageIndex !== currentAbsoluteIndex) {
          const now = Date.now();
          const pageTimeSeconds = (now - session.pageStartTime) / 1000;
          session.pageStartTime = now;

          const sinceLastPageChange = now - session.lastPageChangeTime;
          session.lastPageChangeTime = now;

          // Stability Filter (Scrubbing / Click Jumps): Ignore transitions < 1.5s
          if (sinceLastPageChange >= 1500) {
            const prevPage = allBookPages.find(p => p.absolutePageIndex === prevPageIndex);
            if (prevPage) {
              const wordsOnPage = Math.max(1, Math.abs(prevPage.endWordIndex - prevPage.startWordIndex));
              const pageWpm = Math.round((wordsOnPage / pageTimeSeconds) * 60);

              // Ignore invalid/extreme reading velocities (idle screen or rapid clicks)
              if (pageWpm >= 80 && pageWpm <= 2000) {
                session.speedHistory.push({
                  offsetSeconds: session.activeSeconds,
                  wpm: pageWpm,
                });
                session.pageTurnIntervals.push(pageTimeSeconds);
                if (session.pageTurnIntervals.length > 10) {
                  session.pageTurnIntervals.shift();
                }
                console.debug(`[Telemetry] Recorded page WPM: ${pageWpm} (duration: ${pageTimeSeconds.toFixed(1)}s)`);
              }
            }
          } else {
            console.debug(`[Telemetry] Fast transition (${sinceLastPageChange}ms). WPM computation skipped.`);
          }
        }
      }
    } else {
      // Accumulate words read in RSVP and Cluster modes
      if (wordDiff > 0 && wordDiff < 100) {
        session.wordsRead += wordDiff;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIndex, activeChapterIndex, mode, allBookPages, activeBookId]);

  // Main tracking loop (1 second heartbeat)
  React.useEffect(() => {
    if (!activeBookId) return;

    let wasActiveLastTick = false;

    const interval = setInterval(() => {
      const session = sessionRef.current;
      const state = stateRef.current;
      if (!session.isActiveSession) return;

      const now = Date.now();
      let isTrackingActive = false;

      if (state.mode === "normal") {
        const inactiveTime = now - session.lastInteractionTime;
        // Active if last interaction was within 60s and browser tab is visible
        if (inactiveTime <= 60000 && document.visibilityState === "visible") {
          isTrackingActive = true;
          wasActiveLastTick = true;
        } else if (inactiveTime > 60000 && wasActiveLastTick) {
          // Transitioned from active to AFK
          session.interruptionCount++;
          wasActiveLastTick = false;
          console.debug("[Telemetry] AFK limit reached. Pausing tracking.");
        }
      } else {
        // Active if RSVP/Cluster is playing and tab is visible
        if (state.isPlaying && document.visibilityState === "visible") {
          isTrackingActive = true;
          wasActiveLastTick = true;
        } else if (state.isPlaying && document.visibilityState !== "visible" && wasActiveLastTick) {
          session.interruptionCount++;
          wasActiveLastTick = false;
          console.debug("[Telemetry] Tab hidden while playing. Interruption logged.");
        }
      }

      if (isTrackingActive) {
        session.activeSeconds++;

        // Periodic RSVP/Cluster sampling (every 30 seconds of active reading)
        if ((state.mode === "rsvp" || state.mode === "cluster") && session.activeSeconds % 30 === 0) {
          session.speedHistory.push({
            offsetSeconds: session.activeSeconds,
            wpm: state.wpm,
          });
        }

        // Flow State detection
        if (state.mode === "rsvp" || state.mode === "cluster") {
          if (session.speedHistory.length >= 8) {
            const last8 = session.speedHistory.slice(-8).map(h => h.wpm);
            const { mean, stdDev } = getStdDev(last8);
            if (mean > 0 && (stdDev / mean) < 0.05) {
              if (!session.isFlowState) {
                session.isFlowState = true;
                window.dispatchEvent(new CustomEvent("flow-state-change", { detail: { active: true } }));
                toast.success("✨ You have entered Flow State! Optimal focus.", { id: "flow-state" });
              }
            } else if (session.isFlowState) {
              session.isFlowState = false;
              window.dispatchEvent(new CustomEvent("flow-state-change", { detail: { active: false } }));
            }
          }
        } else if (state.mode === "normal") {
          if (session.pageTurnIntervals.length >= 6) {
            const { mean, stdDev } = getStdDev(session.pageTurnIntervals.slice(-6));
            if (mean > 0 && (stdDev / mean) < 0.10) {
              if (!session.isFlowState) {
                session.isFlowState = true;
                window.dispatchEvent(new CustomEvent("flow-state-change", { detail: { active: true } }));
                toast.success("✨ You have entered Flow State! Optimal focus.", { id: "flow-state" });
              }
            } else if (session.isFlowState) {
              session.isFlowState = false;
              window.dispatchEvent(new CustomEvent("flow-state-change", { detail: { active: false } }));
            }
          }
        }

        // Cognitive Fatigue detection (every 60 seconds)
        if (session.activeSeconds > 0 && session.activeSeconds % 60 === 0) {
          const last60sRegressions = session.regressionEvents.filter(t => t > session.activeSeconds - 60).length;
          
          let isWpmDecaying = false;
          if (session.speedHistory.length >= 10) {
            const recentAvg = session.speedHistory.slice(-3).reduce((s, h) => s + h.wpm, 0) / 3;
            const historicalAvg = session.speedHistory.slice(-10, -3).reduce((s, h) => s + h.wpm, 0) / 7;
            isWpmDecaying = historicalAvg > 0 && (historicalAvg - recentAvg) / historicalAvg > 0.15;
          }

          if (isWpmDecaying || last60sRegressions > 3) {
            if (!session.hasTriggeredFatigueWarning) {
              session.hasTriggeredFatigueWarning = true;
              // Notification removed as it was distracting to users
            }
          }
        }

        // Automatic 30-minute session flush to prevent massive log payloads
        if (session.activeSeconds >= 1800) {
          console.log("[Telemetry] Session time reached 30m limit. Splitting logs.");
          
          // CRITICAL: Take a deep copy snapshot before resetting the live reference
          const snapshot = { ...session };
          flushSession(false, snapshot);
          
          // Re-initialize tracking metadata for the continuation session
          session.id = `log-${crypto.randomUUID()}`;
          session.activeSeconds = 0;
          session.wordsRead = 0;
          session.speedHistory = [];
          session.regressionEvents = [];
          session.interruptionCount = 0;
          session.pageStartTime = Date.now();
          session.lastPageChangeTime = Date.now();
          session.lastInteractionTime = Date.now();
          session.startTime = Date.now();
          session.isActiveSession = true;
          session.pageTurnIntervals = [];
          session.isFlowState = false;
          session.hasTriggeredFatigueWarning = false;
        }
      }
    }, 1000);

    // Event listeners to refresh user interaction timestamp
    const resetInteractionTime = () => {
      sessionRef.current.lastInteractionTime = Date.now();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        sessionRef.current.interruptionCount++;
        console.debug("[Telemetry] Tab hidden. Interruption logged.");
      } else {
        sessionRef.current.lastInteractionTime = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("scroll", resetInteractionTime, { passive: true });
    window.addEventListener("mousemove", resetInteractionTime, { passive: true });
    window.addEventListener("click", resetInteractionTime, { passive: true });
    window.addEventListener("keydown", resetInteractionTime, { passive: true });
    window.addEventListener("touchstart", resetInteractionTime, { passive: true });

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("scroll", resetInteractionTime);
      window.removeEventListener("mousemove", resetInteractionTime);
      window.removeEventListener("click", resetInteractionTime);
      window.removeEventListener("keydown", resetInteractionTime);
      window.removeEventListener("touchstart", resetInteractionTime);
    };
  }, [activeBookId, flushSession]);

  // Window beforeunload listener
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      flushSession();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [flushSession]);

  return {
    flushSession,
  };
}
