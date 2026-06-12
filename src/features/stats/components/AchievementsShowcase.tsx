/**
 * @file AchievementsShowcase.tsx
 * @description Renders the user's unlocked and locked achievements in a premium grid showcase.
 */

"use client";

import * as React from "react";
import { dbService } from "@/core/services/db-service";
import { MASTER_ACHIEVEMENTS, Achievement } from "../services/achievement-dispatcher";
import { Award, Lock, ShieldAlert } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AchievementsShowcaseProps {
  userId: string;
}

interface AchievementWithStatus extends Achievement {
  unlockedAt: string | null;
  progress: {
    current: number;
    target: number;
  };
}

export function AchievementsShowcase({ userId }: AchievementsShowcaseProps) {
  const [achievements, setAchievements] = React.useState<AchievementWithStatus[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadAchievements = async () => {
      try {
        const userAchs = await dbService.getUserAchievements(userId);
        const userAchMap = new Map<string, any>();
        userAchs.forEach((ua) => {
          userAchMap.set(ua.achievementId, ua);
        });

        const list: AchievementWithStatus[] = MASTER_ACHIEVEMENTS.map((ach) => {
          const status = userAchMap.get(ach.id);
          return {
            ...ach,
            unlockedAt: status?.unlockedAt || null,
            progress: status?.progressJson || { current: 0, target: 1 }
          };
        });

        setAchievements(list);
      } catch (err) {
        console.warn("[AchievementsShowcase] Failed to load achievements:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievements();
  }, [userId]);

  if (isLoading) {
    return <LoadingSpinner message="Loading achievements..." className="min-h-[150px] p-0" />;
  }

  const tierGlow = {
    bronze: "shadow-[0_0_10px_rgba(217,119,6,0.15)] border-amber-500/20 bg-amber-500/5",
    silver: "shadow-[0_0_10px_rgba(148,163,184,0.15)] border-slate-400/20 bg-slate-400/5",
    gold: "shadow-[0_0_10px_rgba(234,179,8,0.2)] border-yellow-500/30 bg-yellow-500/5",
    platinum: "shadow-[0_0_15px_rgba(6,182,212,0.25)] border-cyan-400/40 bg-cyan-500/5"
  };

  const badgeIcon = {
    bronze: "🥉",
    silver: "🥈",
    gold: "🥇",
    platinum: "👑"
  };

  const badgeText = {
    bronze: "Bronze",
    silver: "Silver",
    gold: "Gold",
    platinum: "Platinum"
  };

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl h-full flex flex-col justify-between group hover:border-primary/40 transition-all shadow-md glass-panel">
      <div className="w-full border-b border-border/10 pb-2 mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Achievements & Milestones</h3>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Unlocked goals and reading consistency progress</p>
        </div>
        <Award className="w-4 h-4 text-primary shrink-0" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 overflow-y-auto custom-scrollbar max-h-[320px] pr-1 py-1">
        {achievements.map((ach) => {
          const isUnlocked = !!ach.unlockedAt;
          
          return (
            <div
              key={ach.id}
              className={`border rounded-lg p-3 flex flex-col items-center justify-between text-center transition-all ${
                isUnlocked
                  ? `${tierGlow[ach.tier]} border-primary/30 hover:border-primary/60 hover:scale-[1.02] cursor-default`
                  : "bg-background/25 border-border/10 opacity-60 filter grayscale"
              }`}
            >
              {/* Badge Icon */}
              <div className="relative w-11 h-11 rounded-full bg-background/50 border border-border/20 flex items-center justify-center text-xl shadow-inner mb-2">
                {isUnlocked ? (
                  badgeIcon[ach.tier]
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>

              {/* Title & Desc */}
              <div className="min-w-0">
                <h4 className="text-[11px] font-bold text-foreground truncate">{ach.title}</h4>
                <p className="text-[9px] text-muted-foreground mt-1 leading-tight line-clamp-2">{ach.description}</p>
              </div>

              {/* Progress */}
              <div className="w-full mt-3">
                <div className="flex justify-between items-center text-[8px] font-mono text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>
                    {isUnlocked ? "Completed" : `${Math.min(ach.progress.current, ach.progress.target)}/${ach.progress.target}`}
                  </span>
                </div>
                <div className="w-full bg-accent h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked ? "bg-primary" : "bg-muted-foreground/40"
                    }`}
                    style={{
                      width: `${Math.min(100, (ach.progress.current / ach.progress.target) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
