import * as React from "react";
import { generateRSVPSequence } from "@/core/algorithms/rsvp";
import { ChapterHtmlData } from "@/features/reader/utils/chapterHtml";
import { useReadingStore } from "@/features/reader/stores/reading-store";
import { SettingsState } from "@/core/entities/settings";

interface UseRsvpEngineProps {
  currentChapter: ChapterHtmlData & { words: string[] };
  mode: "rsvp" | "cluster" | "normal";
  wpm: number;
  settings: SettingsState;
}

export function useRsvpEngine({
  currentChapter,
  mode,
  wpm,
  settings,
}: UseRsvpEngineProps) {
  const isPlaying = useReadingStore((state) => state.isPlaying);
  const playbackStartTime = React.useRef<number | null>(null);

  const rsvpSequence = React.useMemo(() => {
    return generateRSVPSequence(currentChapter.words, {
      algorithm: settings.rsvp.algorithm,
      customDelays: settings.rsvp.customDelays,
    });
  }, [currentChapter.words, settings.rsvp.algorithm, settings.rsvp.customDelays]);

  React.useEffect(() => {
    if (isPlaying) {
      playbackStartTime.current = Date.now();
    } else {
      playbackStartTime.current = null;
    }
  }, [isPlaying]);

  // Master speed reading playback timer loop for RSVP mode
  React.useEffect(() => {
    if (!isPlaying || mode !== "rsvp" || rsvpSequence.length === 0) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const tick = () => {
      const currentIdx = useReadingStore.getState().wordIndex;
      const baseDelayMs = (60 * 1000) / wpm;

      const currentWordObj = rsvpSequence[currentIdx];
      const delayMultiplier = currentWordObj ? currentWordObj.delayMultiplier : 1.0;
      let finalDelay = baseDelayMs * delayMultiplier;

      // Apply Warm-up Ramp (First 2 seconds = 2000ms)
      if (settings.rsvp.warmupRamp && playbackStartTime.current) {
        const elapsed = Date.now() - playbackStartTime.current;
        if (elapsed < 2000) {
          // speedFactor goes from 0.3 to 1.0 over 2000ms
          const speedFactor = 0.3 + (0.7 * (elapsed / 2000));
          // Multiply delay by the inverse to slow it down
          finalDelay = finalDelay * (1 / speedFactor);
        }
      }

      const wordsToAdvance = 1;

      timeoutId = setTimeout(() => {
        const latestIdx = useReadingStore.getState().wordIndex;
        const nextIndex = latestIdx + wordsToAdvance;

        if (nextIndex >= rsvpSequence.length) {
          useReadingStore.getState().setIsPlaying(false);
          useReadingStore.getState().setCompletedChapter(currentChapter.title);
          useReadingStore.getState().setWordIndex(Math.min(nextIndex, rsvpSequence.length - 1));
        } else {
          useReadingStore.getState().setWordIndex(nextIndex);
          tick();
        }
      }, finalDelay);
    };

    tick();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying, wpm, rsvpSequence, mode, currentChapter, settings.rsvp.warmupRamp]);

  return {
    rsvpSequence,
  };
}
