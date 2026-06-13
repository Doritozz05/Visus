/**
 * @file AchievementsShowcase.tsx
 * @description Renders the user's unlocked and locked achievements in a premium grid showcase.
 */

"use client";

import * as React from "react";
import { dbService } from "@/core/services/db-service";
import { MASTER_ACHIEVEMENTS, Achievement } from "../services/achievement-dispatcher";
import { Award, Lock, Trophy, Medal, Crown } from "lucide-react";
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

    // Listen for background achievement evaluations (e.g. finishing a reading session)
    const handleUpdate = () => {
      loadAchievements();
    };
    window.addEventListener("achievements-updated", handleUpdate);

    return () => {
      window.removeEventListener("achievements-updated", handleUpdate);
    };
  }, [userId]);

  if (isLoading) {
    return <LoadingSpinner message="Loading achievements..." className="min-h-[150px] p-0" />;
  }

  const tierStyles = {
    bronze: {
      glow: "shadow-[0_0_15px_rgba(217,119,6,0.2)] border-amber-500/30 bg-amber-500/5",
      icon: <Award className="w-6 h-6 text-amber-600" />,
      textColor: "text-amber-700 dark:text-amber-500"
    },
    silver: {
      glow: "shadow-[0_0_15px_rgba(148,163,184,0.2)] border-slate-400/30 bg-slate-400/5",
      icon: <Medal className="w-6 h-6 text-slate-400" />,
      textColor: "text-slate-600 dark:text-slate-300"
    },
    gold: {
      glow: "shadow-[0_0_20px_rgba(234,179,8,0.25)] border-yellow-500/40 bg-yellow-500/5",
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      textColor: "text-yellow-700 dark:text-yellow-400"
    },
    platinum: {
      glow: "shadow-[0_0_25px_rgba(99,102,241,0.3)] border-indigo-400/50 bg-indigo-500/5",
      icon: <Crown className="w-6 h-6 text-indigo-400" />,
      textColor: "text-indigo-600 dark:text-indigo-300"
    }
  };

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl h-full flex flex-col justify-between group hover:border-primary/40 transition-all shadow-md liquid-glass">
      <div className="w-full border-b border-border/10 pb-2 mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">Achievements & Milestones</h3>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Unlocked goals and reading consistency progress</p>
        </div>
        <Award className="w-4 h-4 text-primary shrink-0" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar max-h-[380px] px-4 py-4 -mx-2">
        {achievements.map((ach) => {
          const isUnlocked = !!ach.unlockedAt;
          const style = tierStyles[ach.tier];
          
          return (
            <div
              key={ach.id}
              className={`border rounded-lg p-2.5 flex flex-col items-center justify-between text-center transition-all relative group/item ${
                isUnlocked
                  ? `${style.glow} border-primary/30 hover:border-primary/60 hover:scale-[1.05] cursor-default`
                  : "bg-background/25 border-border/10 opacity-60 filter grayscale"
              }`}
            >
              {/* Shine Overlay wrapper to avoid clipping external shadows */}
              {isUnlocked && (
                <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none shine-overlay opacity-30" />
              )}

              {/* Badge Icon - Slightly smaller */}
              <div className={`relative w-10 h-10 rounded-full bg-background/50 border border-border/20 flex items-center justify-center shadow-inner mb-2 ${isUnlocked ? 'animate-achievement-shine' : ''}`}>
                {isUnlocked ? (
                  React.cloneElement(style.icon as React.ReactElement, { className: "w-5 h-5" })
                ) : (
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </div>

              {/* Title & Desc - Tighter layout */}
              <div className="min-w-0 relative z-10">
                <h4 className={`text-[10px] font-bold truncate ${isUnlocked ? style.textColor : 'text-foreground'}`}>{ach.title}</h4>
                <p className="text-[8px] text-muted-foreground mt-0.5 leading-tight line-clamp-2 font-medium">{ach.description}</p>
              </div>

              {/* Progress - Smaller */}
              <div className="w-full mt-2 relative z-10">
                <div className="flex justify-between items-center text-[7px] font-mono text-muted-foreground mb-1">
                  <span className="opacity-70">Progress</span>
                  <span className="font-bold">
                    {isUnlocked ? "Done" : `${Math.min(ach.progress.current, ach.progress.target)}/${ach.progress.target}`}
                  </span>
                </div>
                <div className="w-full bg-accent h-0.5 rounded-full overflow-hidden border border-border/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isUnlocked ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]" : "bg-muted-foreground/40"
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
