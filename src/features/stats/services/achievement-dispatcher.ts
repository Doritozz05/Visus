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
    type: "sessions" | "first_read" | "speed" | "streak" | "words" | "time";
    target?: number;
  };
}

export const MASTER_ACHIEVEMENTS: Achievement[] = [
  { id: 'sessions-1', title: 'First Steps', description: 'Complete your first reading session.', tier: 'bronze', criteria: { type: 'sessions', target: 1 } },
  { id: 'sessions-10', title: 'Casual Reader', description: 'Complete 10 reading sessions.', tier: 'bronze', criteria: { type: 'sessions', target: 10 } },
  { id: 'sessions-50', title: 'Regular Reader', description: 'Complete 50 reading sessions.', tier: 'silver', criteria: { type: 'sessions', target: 50 } },
  { id: 'sessions-100', title: 'Dedicated Reader', description: 'Complete 100 reading sessions.', tier: 'gold', criteria: { type: 'sessions', target: 100 } },
  { id: 'sessions-500', title: 'Bookworm', description: 'Complete 500 reading sessions.', tier: 'platinum', criteria: { type: 'sessions', target: 500 } },
  
  { id: 'streak-3', title: 'Consistency is Key', description: 'Read for 3 consecutive days.', tier: 'bronze', criteria: { type: 'streak', target: 3 } },
  { id: 'streak-7', title: 'Weekly Habit', description: 'Read for 7 consecutive days.', tier: 'silver', criteria: { type: 'streak', target: 7 } },
  { id: 'streak-14', title: 'Fortnight Focus', description: 'Read for 14 consecutive days.', tier: 'gold', criteria: { type: 'streak', target: 14 } },
  { id: 'streak-30', title: 'Monthly Milestone', description: 'Read for 30 consecutive days.', tier: 'platinum', criteria: { type: 'streak', target: 30 } },
  { id: 'streak-50', title: 'Unbreakable', description: 'Read for 50 consecutive days.', tier: 'platinum', criteria: { type: 'streak', target: 50 } },
  { id: 'streak-100', title: 'Century Streak', description: 'Read for 100 consecutive days.', tier: 'platinum', criteria: { type: 'streak', target: 100 } },

  { id: 'speed-300', title: 'Finding the Pace', description: 'Reach a reading speed of 300 WPM.', tier: 'bronze', criteria: { type: 'speed', target: 300 } },
  { id: 'speed-400', title: 'Accelerating', description: 'Reach a reading speed of 400 WPM.', tier: 'silver', criteria: { type: 'speed', target: 400 } },
  { id: 'speed-500', title: 'Speed Reader', description: 'Reach a reading speed of 500 WPM.', tier: 'gold', criteria: { type: 'speed', target: 500 } },
  { id: 'speed-600', title: 'Blur of Words', description: 'Reach a reading speed of 600 WPM.', tier: 'platinum', criteria: { type: 'speed', target: 600 } },
  { id: 'speed-700', title: 'Escape Velocity', description: 'Reach a reading speed of 700 WPM.', tier: 'platinum', criteria: { type: 'speed', target: 700 } },
  { id: 'speed-800', title: 'Supersonic', description: 'Reach a reading speed of 800 WPM.', tier: 'platinum', criteria: { type: 'speed', target: 800 } },
  { id: 'speed-1000', title: 'Speed of Light', description: 'Reach a reading speed of 1000 WPM.', tier: 'platinum', criteria: { type: 'speed', target: 1000 } },

  { id: 'words-5k', title: 'Word Gatherer', description: 'Read a total of 5,000 words.', tier: 'bronze', criteria: { type: 'words', target: 5000 } },
  { id: 'words-10k', title: 'Page Turner', description: 'Read a total of 10,000 words.', tier: 'silver', criteria: { type: 'words', target: 10000 } },
  { id: 'words-50k', title: 'Chapter Eater', description: 'Read a total of 50,000 words.', tier: 'gold', criteria: { type: 'words', target: 50000 } },
  { id: 'words-100k', title: 'Novel Finisher', description: 'Read a total of 100,000 words.', tier: 'platinum', criteria: { type: 'words', target: 100000 } },
  { id: 'words-250k', title: 'Epic Journey', description: 'Read a total of 250,000 words.', tier: 'platinum', criteria: { type: 'words', target: 250000 } },
  { id: 'words-500k', title: 'Library Consumer', description: 'Read a total of 500,000 words.', tier: 'platinum', criteria: { type: 'words', target: 500000 } },
  { id: 'words-1m', title: 'Millionaire of Words', description: 'Read a total of 1,000,000 words.', tier: 'platinum', criteria: { type: 'words', target: 1000000 } },

  { id: 'time-1h', title: 'Getting Lost', description: 'Accumulate 1 hour of active reading time.', tier: 'bronze', criteria: { type: 'time', target: 60 } },
  { id: 'time-5h', title: 'Deep Immersion', description: 'Accumulate 5 hours of active reading time.', tier: 'silver', criteria: { type: 'time', target: 300 } },
  { id: 'time-10h', title: 'Time Traveler', description: 'Accumulate 10 hours of active reading time.', tier: 'gold', criteria: { type: 'time', target: 600 } },
  { id: 'time-24h', title: 'A Day in Books', description: 'Accumulate 24 hours of active reading time.', tier: 'platinum', criteria: { type: 'time', target: 1440 } },
  { id: 'time-50h', title: 'Reading Veteran', description: 'Accumulate 50 hours of active reading time.', tier: 'platinum', criteria: { type: 'time', target: 3000 } },
  { id: 'time-100h', title: 'Time Master', description: 'Accumulate 100 hours of active reading time.', tier: 'platinum', criteria: { type: 'time', target: 6000 } }
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
      const totalSessions = logs.length;
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
      if (storedAchievements.length !== MASTER_ACHIEVEMENTS.length) {
        // Sync full new list if it has changed length
        for (const ach of MASTER_ACHIEVEMENTS) {
          await dbService.saveAchievement(ach);
        }
      }

      // Check each achievement
      for (const ach of MASTER_ACHIEVEMENTS) {
        let currentProgress = 0;
        let targetProgress = ach.criteria.target || 1;
        let isUnlockedNow = false;

        switch (ach.criteria.type) {
          case "sessions":
          case "first_read": // For backwards compatibility
            currentProgress = totalSessions;
            isUnlockedNow = totalSessions >= targetProgress;
            break;
          case "speed":
            currentProgress = maxSpeed;
            isUnlockedNow = maxSpeed >= targetProgress;
            break;
          case "words":
            currentProgress = totalWords;
            isUnlockedNow = totalWords >= targetProgress;
            break;
          case "time":
            currentProgress = totalTimeMinutes;
            isUnlockedNow = totalTimeMinutes >= targetProgress;
            break;
          case "streak":
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
   */
  static calculateStreakWithGrace(logs: ReadingSessionLog[]): number {
    if (logs.length === 0) return 0;

    const uniqueDates = Array.from(
      new Set(
        logs.map((log) => {
          const date = new Date(log.completedAt);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        })
      )
    ).sort();

    const totalActiveReadingDays = uniqueDates.length;
    let graceDaysRemaining = Math.min(3, Math.floor(totalActiveReadingDays / 30));

    let maxStreak = 0;
    let currentStreak = 0;

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    let prevDate: Date | null = null;

    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);

      if (prevDate === null) {
        currentStreak = 1;
      } else {
        const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentStreak++;
        } else if (diffDays === 2 && graceDaysRemaining > 0) {
          graceDaysRemaining--;
          currentStreak += 2; 
        } else {
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

    const lastReadDateStr = uniqueDates[uniqueDates.length - 1];
    const isStreakActive = lastReadDateStr === todayStr || lastReadDateStr === yesterdayStr;

    return isStreakActive ? currentStreak : 0;
  }

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
        React.createElement("div", {
          className: "absolute inset-0 bg-white/5 pointer-events-none mix-blend-overlay"
        }),
        React.createElement(
          "div",
          {
            className: "w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-2xl shadow-inner shrink-0"
          },
          tierBadges[achievement.tier]
        ),
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
