/**
 * @file achievement-dispatcher.ts
 * @description Local achievements evaluation, persistence in IndexedDB, and custom toast alerts.
 */

import { dbService } from "@/core/services/db-service";
import { ReadingSessionLog } from "@/core/entities/stats";
import { toast } from "sonner";
import * as React from "react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  criteria: {
    type: "first_read" | "speed" | "streak" | "words" | "time";
    target?: number;
  };
}

export const MASTER_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-read",
    title: "First Steps",
    description: "Complete your first reading session.",
    tier: "bronze",
    criteria: { type: "first_read" }
  },
  {
    id: "speed-500-wpm",
    title: "Reading Falcon",
    description: "Reach a reading speed of 500 WPM.",
    tier: "silver",
    criteria: { type: "speed", target: 500 }
  },
  {
    id: "speed-700-wpm",
    title: "Escape Velocity",
    description: "Reach a reading speed of 700 WPM.",
    tier: "gold",
    criteria: { type: "speed", target: 700 }
  },
  {
    id: "streak-3-days",
    title: "Constant Reader",
    description: "Read for 3 consecutive days.",
    tier: "bronze",
    criteria: { type: "streak", target: 3 }
  },
  {
    id: "streak-10-days",
    title: "Steel Habit",
    description: "Read for 10 consecutive days.",
    tier: "gold",
    criteria: { type: "streak", target: 10 }
  },
  {
    id: "total-words-10k",
    title: "Page Devourer",
    description: "Read a total of 10,000 words.",
    tier: "silver",
    criteria: { type: "words", target: 10000 }
  },
  {
    id: "total-words-50k",
    title: "Bibliophile",
    description: "Read a total of 50,000 words.",
    tier: "platinum",
    criteria: { type: "words", target: 50000 }
  },
  {
    id: "time-1-hour",
    title: "Deep Focus",
    description: "Accumulate 1 hour (60 minutes) of active reading time.",
    tier: "silver",
    criteria: { type: "time", target: 60 }
  }
];

export class AchievementDispatcher {
  /**
   * Helper to fetch current authenticated user ID, or fallback to 'local-user'
   */
  static async getCurrentUserId(): Promise<string> {
    if (typeof window === "undefined") return "local-user";
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.id || "local-user";
    } catch (_) {
      return "local-user";
    }
  }

  /**
   * Main evaluation call. Computes current stats, updates progress in IndexedDB,
   * triggers sync to Supabase if connected, and shows a custom toast for newly unlocked achievements.
   */
  static async evaluate(): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      const userId = await this.getCurrentUserId();
      const logs = await dbService.getAllLogs();

      if (logs.length === 0) return;

      // Calculate totals
      const totalWords = logs.reduce((sum, log) => sum + Math.round((log.durationSeconds / 60) * log.speedWpm), 0);
      const maxSpeed = logs.reduce((max, log) => Math.max(max, log.speedWpm), 0);
      const totalTimeSeconds = logs.reduce((sum, log) => sum + log.durationSeconds, 0);
      const totalTimeMinutes = Math.round(totalTimeSeconds / 60);

      // Streak calculation with grace day period
      const streakCount = this.calculateStreakWithGrace(logs);

      // Load already unlocked achievements to prevent duplicates
      const userAchievements = await dbService.getUserAchievements(userId);
      const unlockedMap = new Map<string, string>(); // achievementId -> unlockedAt
      userAchievements.forEach((ua) => {
        if (ua.unlockedAt) {
          unlockedMap.set(ua.achievementId, ua.unlockedAt);
        }
      });

      // Seeding achievements list in IndexedDB if needed
      const storedAchievements = await dbService.getAllAchievements();
      if (storedAchievements.length === 0) {
        for (const ach of MASTER_ACHIEVEMENTS) {
          await dbService.saveAchievement(ach);
        }
      }

      // Check each achievement
      for (const ach of MASTER_ACHIEVEMENTS) {
        let currentProgress = 0;
        let targetProgress = 0;
        let isUnlockedNow = false;

        switch (ach.criteria.type) {
          case "first_read":
            currentProgress = logs.length > 0 ? 1 : 0;
            targetProgress = 1;
            isUnlockedNow = logs.length > 0;
            break;
          case "speed":
            targetProgress = ach.criteria.target || 500;
            currentProgress = maxSpeed;
            isUnlockedNow = maxSpeed >= targetProgress;
            break;
          case "words":
            targetProgress = ach.criteria.target || 10000;
            currentProgress = totalWords;
            isUnlockedNow = totalWords >= targetProgress;
            break;
          case "time":
            targetProgress = ach.criteria.target || 60; // targets are in minutes
            currentProgress = totalTimeMinutes;
            isUnlockedNow = totalTimeMinutes >= targetProgress;
            break;
          case "streak":
            targetProgress = ach.criteria.target || 3;
            currentProgress = streakCount;
            isUnlockedNow = streakCount >= targetProgress;
            break;
        }

        const wasAlreadyUnlocked = unlockedMap.has(ach.id);
        const unlockedAt = wasAlreadyUnlocked 
          ? unlockedMap.get(ach.id) 
          : isUnlockedNow 
            ? new Date().toISOString() 
            : null;

        // Save progress to IndexedDB
        await dbService.saveUserAchievement({
          userId,
          achievementId: ach.id,
          progressJson: {
            current: currentProgress,
            target: targetProgress
          },
          unlockedAt,
          updatedAt: new Date().toISOString()
        });

        // Trigger dynamic Toast if unlocked just now
        if (isUnlockedNow && !wasAlreadyUnlocked) {
          this.triggerToast(ach);
          
          // Push to Supabase if logged in
          if (userId !== "local-user") {
            this.pushUserAchievementToCloud(userId, ach.id, currentProgress, targetProgress);
          }
        }
      }
    } catch (err) {
      console.warn("[AchievementDispatcher] Evaluation error:", err);
    }
  }

  /**
   * Streak calculation algorithm supporting a Grace Day Period.
   * A grace day is earned every 30 reading days (capped at 3).
   * If a user misses exactly 1 calendar day, a grace day is consumed to bridge the gap.
   */
  static calculateStreakWithGrace(logs: ReadingSessionLog[]): number {
    if (logs.length === 0) return 0;

    // Map logs to unique date strings in local time zone, e.g., "YYYY-MM-DD"
    const uniqueDates = Array.from(
      new Set(
        logs.map((log) => {
          const date = new Date(log.completedAt);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        })
      )
    ).sort(); // Sort in ascending order

    const totalActiveReadingDays = uniqueDates.length;
    let graceDaysRemaining = Math.min(3, Math.floor(totalActiveReadingDays / 30));

    let maxStreak = 0;
    let currentStreak = 0;

    // Today and yesterday dates for check
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    if (uniqueDates.length === 0) return 0;

    // Walk dates chronologically
    let prevDate: Date | null = null;

    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);

      if (prevDate === null) {
        currentStreak = 1;
      } else {
        const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          currentStreak++;
        } else if (diffDays === 2 && graceDaysRemaining > 0) {
          // Exactly 1 day skipped, consume 1 grace day to bridge
          graceDaysRemaining--;
          currentStreak += 2; // Count the skipped day as bridged
        } else {
          // Streak broken
          if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
          }
          currentStreak = 1;
        }
      }

      prevDate = currentDate;
    }

    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }

    // Verify if streak is still active today or yesterday
    const lastReadDateStr = uniqueDates[uniqueDates.length - 1];
    const isStreakActive = lastReadDateStr === todayStr || lastReadDateStr === yesterdayStr;

    return isStreakActive ? currentStreak : 0;
  }

  /**
   * Push achievement unlock to Supabase remotely
   */
  private static async pushUserAchievementToCloud(
    userId: string,
    achievementId: string,
    current: number,
    target: number
  ) {
    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase.from("user_achievements").upsert({
        user_id: userId,
        achievement_id: achievementId,
        progress_json: { current, target },
        unlocked_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn("[AchievementDispatcher] Cloud sync failed for achievement:", achievementId, err);
    }
  }

  /**
   * Premium styled unlock Toast UI using Sonner
   */
  private static triggerToast(achievement: Achievement) {
    const tierColors = {
      bronze: "from-amber-600 to-amber-800 border-amber-500 text-amber-100",
      silver: "from-slate-400 to-slate-600 border-slate-300 text-slate-100",
      gold: "from-yellow-500 to-amber-500 border-yellow-400 text-yellow-100",
      platinum: "from-indigo-400 to-cyan-500 border-cyan-300 text-cyan-100"
    };

    const tierBadges = {
      bronze: "🥉",
      silver: "🥈",
      gold: "🥇",
      platinum: "👑"
    };

    toast.custom((t) => {
      return React.createElement(
        "div",
        {
          className: `w-full max-w-sm bg-gradient-to-r ${tierColors[achievement.tier]} border p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-300 relative overflow-hidden backdrop-blur-md`
        },
        // Neon ambient glow overlay
        React.createElement("div", {
          className: "absolute inset-0 bg-white/5 pointer-events-none mix-blend-overlay"
        }),
        // Trophy/Icon container
        React.createElement(
          "div",
          {
            className: "w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-2xl shadow-inner shrink-0"
          },
          tierBadges[achievement.tier]
        ),
        // Texts
        React.createElement(
          "div",
          { className: "flex-1" },
          React.createElement(
            "p",
            { className: "text-[10px] font-mono uppercase tracking-widest text-white/75 font-bold" },
            `Achievement Unlocked! (${achievement.tier})`
          ),
          React.createElement(
            "h4",
            { className: "text-sm font-extrabold font-heading text-white mt-0.5 leading-tight" },
            achievement.title
          ),
          React.createElement(
            "p",
            { className: "text-xs text-white/90 font-sans mt-1 leading-normal" },
            achievement.description
          )
        ),
        // Close button
        React.createElement(
          "button",
          {
            onClick: () => toast.dismiss(t),
            className: "text-white/60 hover:text-white text-lg shrink-0 self-start p-1 transition-colors"
          },
          "×"
        )
      );
    }, {
      duration: 5000,
    });
  }
}
