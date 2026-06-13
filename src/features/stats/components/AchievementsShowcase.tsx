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
import { STREAK_MILESTONES, StreakMilestone } from "../milestones";

interface AchievementsShowcaseProps {
  userId: string;
  currentStreak?: number;
}

interface AchievementWithStatus extends Achievement {
  unlockedAt: string | null;
  progress: {
    current: number;
    target: number;
  };
}

export function AchievementsShowcase({ userId, currentStreak = 0 }: AchievementsShowcaseProps) {
  const [achievements, setAchievements] = React.useState<AchievementWithStatus[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<"achievements" | "mascots">("achievements");
  const [selectedMascot, setSelectedMascot] = React.useState<StreakMilestone | null>(null);

  const getMilestoneDays = (id: string): number => {
    const match = id.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const getMilestoneDescription = (id: string): string => {
    switch (id) {
      case "day0":
        return "Visi sits under a sad rain cloud. Read at least one day to cheer Visi up and start your streak!";
      case "day1":
        return "Visi holds a tiny matchstick, celebrating the first step of your reading habit. Keep the fire burning!";
      case "day5":
        return "Visi wears golden reading glasses to stay focused, holding a steady warm flame on the chest.";
      case "day15":
        return "Visi celebrates a fortnight of consistency! Juggling a glowing flame with neon pink sunglasses and a party hat.";
      case "day30":
        return "Visi puts on a detective outfit with a magnifying glass to inspect and explore deep text clusters.";
      case "day50":
        return "Visi is wearing full headphone gear to block out distractions and read in perfect flow.";
      case "day75":
        return "Visi wears a royal gold crown, ruling over your streak as you conquer your reading goals.";
      case "day100":
        return "Visi wears a graduation cap and holds a parchment scroll. A century of days reading makes Visi a scholar!";
      case "day150":
        return "Visi sports explorer goggles and a backpack. Ready to journey through massive libraries!";
      case "day200":
        return "Visi wears a retro astronaut helmet. Your reading speed and consistency are taking you to the stars!";
      case "day250":
        return "Visi holds a glowing crystal ball. Your comprehension is so deep it feels like foresight!";
      case "day300":
        return "Visi wears a pilot hat and aviator glasses. You are flying through pages at supersonic speed!";
      case "day365":
        return "A full year of reading! Visi wears a wizard hat and carries a magical staff. You've mastered the art of reading!";
      case "day500":
        return "Visi is wearing full cybernetic glasses. Speed reading has upgraded you to cyborg levels of text scanning.";
      case "day600":
        return "Visi wears a chef's hat, cooking up gourmet reading insights. Devouring books with ease!";
      case "day730":
        return "Two whole years! Visi wears a golden laurel wreath, standing as an absolute champion of reading habits.";
      case "day1000":
        return "One thousand days! Visi wears a phoenix crown and glows with eternal light. Your dedication is legendary!";
      case "day1500":
        return "Visi wears an ancient philosopher's robe. You've spent so much time reading, you've attained true enlightenment.";
      case "day2000":
        return "Visi wears a cyber-punk visor. Telemetry checks show reading speeds beyond human comprehension!";
      case "day3000":
        return "Visi wears a superhero cape and mask. You are a super reader, saving books from being unread!";
      case "day5000":
        return "Visi is holding a glowing trident, ruling over the deep ocean of knowledge you've accumulated.";
      case "day9999":
        return "The ultimate level! Visi wears a divine halo and glows with starlight. You have achieved speed reading godhood!";
      default:
        return "Visi has evolved with your reading habit! Keep reading every day to keep this costume unlocked.";
    }
  };

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
    <div className="bg-card border border-border/20 p-5 rounded-lg h-full flex flex-col justify-between group hover:border-primary/40 transition-all shadow-md liquid-glass">
      <div className="w-full border-b border-border/10 pb-2 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">
            Achievements & milestones
          </h3>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
            {activeTab === "achievements"
              ? "Unlocked goals and reading consistency progress"
              : "Visi mascot costumes unlocked by your reading streak"}
          </p>
        </div>
        <div className="flex bg-accent/40 p-0.5 rounded-lg border border-border/10 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-bold transition-all ${
              activeTab === "achievements"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab("mascots")}
            className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-bold transition-all ${
              activeTab === "mascots"
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Streak milestones
          </button>
        </div>
      </div>

      {activeTab === "achievements" ? (
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
                    React.cloneElement(style.icon as React.ReactElement<any>, { className: "w-5 h-5" })
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
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar max-h-[380px] px-4 py-4 -mx-2">
          {STREAK_MILESTONES.map((milestone) => {
            const days = getMilestoneDays(milestone.id);
            const isUnlocked = currentStreak >= days;
            
            return (
              <div
                key={milestone.id}
                onClick={() => isUnlocked && setSelectedMascot(milestone)}
                className={`border rounded-lg p-2.5 flex flex-col items-center justify-between text-center transition-all relative group/item ${
                  isUnlocked
                    ? "shadow-[0_0_15px_rgba(79,70,229,0.15)] border-primary/30 hover:border-primary/60 hover:scale-[1.05] bg-primary/5 cursor-pointer"
                    : "bg-background/25 border-border/10 opacity-60 filter grayscale cursor-default"
                }`}
              >
                {/* Shine Overlay wrapper to avoid clipping external shadows */}
                {isUnlocked && (
                  <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none shine-overlay opacity-30" />
                )}

                {/* Mascot Preview */}
                <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                  <div className="w-12 h-12 flex items-center justify-center">
                    {milestone.renderPreview(days)}
                  </div>
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-full flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Title & Desc */}
                <div className="min-w-0 relative z-10 w-full">
                  <h4 className={`text-[10px] font-bold truncate ${isUnlocked ? "text-primary" : "text-foreground"}`}>
                    Day {days} mascot
                  </h4>
                  <p className="text-[8px] text-muted-foreground mt-0.5 leading-tight line-clamp-2 font-medium">
                    {isUnlocked ? "Click to view" : `Unlocks at ${days} days`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mascot Detail Modal */}
      {selectedMascot && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedMascot(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
          />
          <div className="w-full max-w-sm bg-card border border-border/30 rounded-[calc(var(--radius)*1.3)] p-6 shadow-2xl relative z-10 liquid-glass overflow-hidden animate-in zoom-in-95 duration-300 text-center flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent opacity-50"></div>
            
            {/* Mascot Preview inside modal */}
            <div className="w-32 h-32 flex items-center justify-center mb-4 relative z-10">
              {selectedMascot.renderPreview(getMilestoneDays(selectedMascot.id))}
            </div>

            <div className="relative z-10 mb-6 w-full text-center">
              <span className="text-[9px] font-mono uppercase tracking-widest text-primary font-bold mb-1 block">
                Streak milestone unlocked
              </span>
              <h3 className="text-xl font-extrabold font-heading text-foreground tracking-tight">
                Day {getMilestoneDays(selectedMascot.id)} mascot
              </h3>
              <p className="text-xs text-muted-foreground font-sans mt-2 leading-relaxed px-2">
                {getMilestoneDescription(selectedMascot.id)}
              </p>
            </div>

            <button
              onClick={() => setSelectedMascot(null)}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-xs font-mono uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all z-10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
