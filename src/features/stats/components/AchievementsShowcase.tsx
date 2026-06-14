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
import { FancyTabs } from "@/components/ui/FancyTabs";

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
  const [selectedAchievement, setSelectedAchievement] = React.useState<AchievementWithStatus | null>(null);

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
      glow: "shadow-[0_0_15px_rgba(217,119,6,0.2)] border-amber-500/30 bg-card liquid-glass",
      icon: <Award className="w-6 h-6 text-amber-600" />,
      textColor: "text-amber-700 dark:text-amber-500"
    },
    silver: {
      glow: "shadow-[0_0_15px_rgba(148,163,184,0.2)] border-slate-400/30 bg-card liquid-glass",
      icon: <Medal className="w-6 h-6 text-slate-400" />,
      textColor: "text-slate-600 dark:text-slate-300"
    },
    gold: {
      glow: "shadow-[0_0_20px_rgba(234,179,8,0.25)] border-yellow-500/40 bg-card liquid-glass",
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      textColor: "text-yellow-700 dark:text-yellow-400"
    },
    platinum: {
      glow: "shadow-[0_0_25px_rgba(99,102,241,0.3)] border-indigo-400/50 bg-card liquid-glass",
      icon: <Crown className="w-6 h-6 text-indigo-400" />,
      textColor: "text-indigo-600 dark:text-indigo-300"
    }
  };

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl h-full flex flex-col justify-between group hover:border-primary/40 transition-all shadow-md liquid-glass overflow-hidden isolate">
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
        <FancyTabs
          tabs={[
            { id: "achievements", label: "Achievements" },
            { id: "mascots", label: "Streak milestones" }
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as any)}
          layoutId="active-achievement-tab"
          variant="pill"
          className="shrink-0 self-end sm:self-auto bg-accent/40"
        />
      </div>

      {activeTab === "achievements" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar max-h-[480px] px-4 py-4 -mx-2">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            const style = tierStyles[ach.tier];
            
            return (
              <div
                key={ach.id}
                onClick={() => setSelectedAchievement(ach)}
                className={`border rounded-xl p-4 flex flex-col items-center justify-between text-center transition-all relative group/item overflow-hidden min-h-[170px] cursor-pointer hover:scale-[1.05] ${
                  isUnlocked
                    ? `${style.glow} border-primary/30 hover:border-primary/60`
                    : "bg-card border-border/10 opacity-60 filter grayscale hover:opacity-80 hover:border-border/30 liquid-glass"
                }`}
              >
                {/* Shine Overlay wrapper to avoid clipping external shadows */}
                {isUnlocked && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none shine-overlay opacity-30" />
                )}

                {/* Badge Icon - Premium sized */}
                <div className={`relative w-14 h-14 rounded-xl bg-background border border-border/20 flex items-center justify-center shadow-inner mb-3 ${isUnlocked ? 'animate-achievement-shine' : ''}`}>
                  {isUnlocked ? (
                    React.cloneElement(style.icon as React.ReactElement<any>, { className: "w-7 h-7" })
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                {/* Title & Desc - Improved typography */}
                <div className="min-w-0 relative z-10 w-full mb-1">
                  <h4 className={`text-xs font-bold truncate px-1 leading-tight ${isUnlocked ? style.textColor : 'text-foreground'}`}>
                    {ach.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-tight line-clamp-2 font-medium px-1">
                    {ach.description}
                  </p>
                </div>

                {/* Progress - Enhanced readability */}
                <div className="w-full mt-auto pt-2 relative z-10">
                  <div className="flex justify-between items-center text-[8px] font-mono text-muted-foreground mb-1.5 px-0.5">
                    <span className="opacity-70 font-bold uppercase tracking-widest">Progress</span>
                    <span className="font-bold">
                      {isUnlocked ? "Done" : `${Math.min(ach.progress.current, ach.progress.target)}/${ach.progress.target}`}
                    </span>
                  </div>
                  <div className="w-full bg-accent/60 h-1.5 rounded-full overflow-hidden border border-border/5">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar max-h-[480px] px-4 py-4 -mx-2">
          {STREAK_MILESTONES.map((milestone) => {
            const days = getMilestoneDays(milestone.id);
            const isUnlocked = currentStreak >= days;
            
            return (
              <div
                key={milestone.id}
                onClick={() => isUnlocked && setSelectedMascot(milestone)}
                className={`border rounded-xl p-4 flex flex-col items-center justify-between text-center transition-all relative group/item overflow-hidden min-h-[170px] ${
                  isUnlocked
                    ? "shadow-[0_0_15px_rgba(79,70,229,0.15)] border-primary/30 hover:border-primary/60 hover:scale-[1.05] bg-card liquid-glass cursor-pointer"
                    : "bg-card border-border/10 opacity-60 filter grayscale cursor-default liquid-glass"
                }`}
              >
                {/* Shine Overlay wrapper to avoid clipping external shadows */}
                {isUnlocked && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none shine-overlay opacity-30" />
                )}

                {/* Mascot Preview - Optimized for visibility */}
                <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                  <div className="w-20 h-20 flex items-center justify-center">
                    {milestone.renderPreview(days)}
                  </div>
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden border border-border/5">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Title & Desc */}
                <div className="min-w-0 relative z-10 w-full">
                  <h4 className={`text-xs font-bold truncate leading-tight ${isUnlocked ? "text-primary" : "text-foreground"}`}>
                    Day {days} mascot
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-tight line-clamp-2 font-medium">
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

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div 
            onClick={() => setSelectedAchievement(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
          />
          <div className="w-full max-w-sm bg-card border border-border/30 rounded-[calc(var(--radius)*1.3)] p-6 shadow-2xl relative z-10 liquid-glass overflow-hidden animate-in zoom-in-95 duration-300 text-center flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent opacity-50"></div>
            
            {/* Medal Preview inside modal */}
            <div className={`relative w-28 h-28 rounded-2xl bg-background border border-border/20 flex items-center justify-center shadow-inner mb-4 z-10 ${selectedAchievement.unlockedAt ? 'animate-achievement-shine' : 'opacity-60 filter grayscale'}`}>
              {React.cloneElement(tierStyles[selectedAchievement.tier].icon as React.ReactElement<any>, { className: "w-14 h-14" })}
              {!selectedAchievement.unlockedAt && (
                <div className="absolute top-2 right-2 bg-background/80 border border-border/20 rounded-md p-1 backdrop-blur-sm shadow-sm">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="relative z-10 mb-6 w-full text-center">
              <span className={`text-[9px] font-mono uppercase tracking-widest font-bold mb-1 block ${tierStyles[selectedAchievement.tier].textColor}`}>
                {selectedAchievement.tier.charAt(0).toUpperCase() + selectedAchievement.tier.slice(1)} tier
              </span>
              <h3 className="text-xl font-extrabold font-heading text-foreground tracking-tight">
                {selectedAchievement.title}
              </h3>
              <p className="text-xs text-muted-foreground font-sans mt-2 leading-relaxed px-2">
                {selectedAchievement.description}
              </p>

              {/* Progress bar in modal */}
              <div className="w-full mt-4 pt-4 border-t border-border/10">
                <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground mb-1.5 px-1">
                  <span className="opacity-70 font-bold uppercase tracking-widest">Progress</span>
                  <span className="font-bold text-foreground">
                    {selectedAchievement.unlockedAt ? "Unlocked" : `${Math.min(selectedAchievement.progress.current, selectedAchievement.progress.target)}/${selectedAchievement.progress.target}`}
                  </span>
                </div>
                <div className="w-full bg-accent/60 h-2 rounded-full overflow-hidden border border-border/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      selectedAchievement.unlockedAt ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]" : "bg-muted-foreground/40"
                    }`}
                    style={{
                      width: `${Math.min(100, (selectedAchievement.progress.current / selectedAchievement.progress.target) * 100)}%`
                    }}
                  />
                </div>
                
                {/* Unlocked date or locked helper text */}
                {selectedAchievement.unlockedAt ? (
                  <p className="text-[10px] text-muted-foreground mt-3 font-mono">
                    Unlocked on {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-[10px] text-muted-foreground mt-3 font-mono">
                    Unlock by meeting the criteria
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedAchievement(null)}
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
