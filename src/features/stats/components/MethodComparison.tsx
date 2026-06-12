/**
 * @file MethodComparison.tsx
 * @description Custom SVG comparative bar chart crossing speed and accuracy for Normal, RSVP and Cluster modes.
 */

"use client";

import * as React from "react";
import { ReadingSessionLog } from "@/core/entities/stats";
import { Zap, Activity } from "lucide-react";

interface MethodComparisonProps {
  logs: ReadingSessionLog[];
}

export function MethodComparison({ logs }: MethodComparisonProps) {
  // 1. Calculate averages per method
  const stats = React.useMemo(() => {
    if (logs.length === 0) return null;

    const sums = {
      normal: { wpm: 0, accuracySum: 0, accuracyCount: 0, count: 0 },
      rsvp: { wpm: 0, accuracySum: 0, accuracyCount: 0, count: 0 },
      cluster: { wpm: 0, accuracySum: 0, accuracyCount: 0, count: 0 }
    };

    logs.forEach((log) => {
      const mode = log.mode as "normal" | "rsvp" | "cluster";
      if (sums[mode]) {
        sums[mode].wpm += log.speedWpm;
        sums[mode].count += 1;
        if (log.accuracy != null) {
          sums[mode].accuracySum += log.accuracy;
          sums[mode].accuracyCount += 1;
        }
      }
    });

    const result = {
      normal: { wpm: 0, accuracy: null as number | null, count: 0 },
      rsvp: { wpm: 0, accuracy: null as number | null, count: 0 },
      cluster: { wpm: 0, accuracy: null as number | null, count: 0 }
    };

    (Object.keys(sums) as Array<keyof typeof sums>).forEach((mode) => {
      const s = sums[mode];
      if (s.count > 0) {
        result[mode].wpm = Math.round(s.wpm / s.count);
        result[mode].count = s.count;
        if (s.accuracyCount > 0) {
          result[mode].accuracy = Math.round(s.accuracySum / s.accuracyCount);
        }
      }
    });

    return result;
  }, [logs]);

  // Determine the most efficient method (highest value of wpm * accuracy)
  const bestMethodInfo = React.useMemo(() => {
    if (!stats) return null;

    const scores = {
      normal: stats.normal.wpm * ((stats.normal.accuracy || 100) / 100),
      rsvp: stats.rsvp.wpm * ((stats.rsvp.accuracy || 100) / 100),
      cluster: stats.cluster.wpm * ((stats.cluster.accuracy || 100) / 100)
    };

    let bestMode: "normal" | "rsvp" | "cluster" = "normal";
    if (scores.rsvp > scores.normal && scores.rsvp > scores.cluster) {
      bestMode = "rsvp";
    } else if (scores.cluster > scores.normal && scores.cluster > scores.rsvp) {
      bestMode = "cluster";
    }

    if (stats[bestMode].count === 0) return null;

    const modeLabels = {
      normal: "Normal Reading",
      rsvp: "RSVP",
      cluster: "Cluster Chunks"
    };

    return {
      label: modeLabels[bestMode],
      wpm: stats[bestMode].wpm,
      accuracy: stats[bestMode].accuracy
    };
  }, [stats]);

  // SVG parameters
  const height = 150;
  const width = 450;
  const barHeight = 12;
  const barGap = 6;
  const rowGap = 32;

  const maxWpmValue = React.useMemo(() => {
    if (!stats) return 1000;
    return Math.max(1000, stats.normal.wpm, stats.rsvp.wpm, stats.cluster.wpm) + 200;
  }, [stats]);

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col justify-between h-full group hover:border-primary/40 transition-all shadow-md glass-panel overflow-hidden">
      <div className="w-full border-b border-border/10 pb-2 mb-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Reading Modes Performance</h3>
        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Compare your speed and retention across different tools</p>
      </div>

      {!stats || (stats.normal.count === 0 && stats.rsvp.count === 0 && stats.cluster.count === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-muted-foreground opacity-50">
          <Activity className="w-8 h-8 mb-2" />
          <p className="text-xs font-mono">Not enough data to compare modes.</p>
        </div>
      ) : (
        <>
          <div className="relative w-full overflow-x-auto overflow-y-hidden custom-scrollbar flex justify-center py-2 min-h-[140px]">
            <svg width={width} height={height} className="overflow-visible select-none">
              {/* Method Rows */}
              {(["normal", "rsvp", "cluster"] as const).map((mode, idx) => {
                const y = idx * rowGap + 20;
                const modeStats = stats[mode];
                const hasData = modeStats.count > 0;
                const hasAccuracy = modeStats.accuracy != null;
                
                // Width computations
                const wpmWidth = hasData ? Math.min(1.0, modeStats.wpm / maxWpmValue) * 250 : 5;
                const accWidth = hasAccuracy ? (modeStats.accuracy! / 100) * 250 : 5;

                const modeLabels = {
                  normal: "Normal",
                  rsvp: "RSVP",
                  cluster: "Cluster"
                };

                return (
                  <g key={mode} className={hasData ? "" : "opacity-30 grayscale"}>
                    {/* Method Name */}
                    <text
                      x="0"
                      y={y + 10}
                      className="fill-foreground font-heading text-[10px] font-bold"
                    >
                      {modeLabels[mode]}
                    </text>

                    {/* Speed Bar (WPM) */}
                    <rect
                      x="80"
                      y={y - 2}
                      width={wpmWidth}
                      height={barHeight}
                      rx="3"
                      className="fill-primary/80 hover:fill-primary transition-all duration-500"
                    />
                    <text
                      x={80 + wpmWidth + 6}
                      y={y + 8}
                      className="fill-primary font-mono text-[9px] font-bold"
                    >
                      {hasData ? `${modeStats.wpm} WPM` : "No data"}
                    </text>

                    {/* Comprehension Bar (Accuracy) */}
                    <rect
                      x="80"
                      y={y + barHeight + barGap - 2}
                      width={accWidth}
                      height={barHeight - 2}
                      rx="2.5"
                      className="fill-emerald-500/60 dark:fill-emerald-400/40 hover:brightness-110 transition-all duration-500"
                    />
                    <text
                      x={80 + accWidth + 6}
                      y={y + barHeight + barGap + 6}
                      className="fill-emerald-500 dark:text-emerald-400 font-mono text-[8px] font-semibold"
                    >
                      {hasAccuracy ? `${modeStats.accuracy}% Retention` : "No retention data"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Dynamic Recommendation Alert */}
          {bestMethodInfo && (
            <div className="bg-background/40 border border-border/10 p-2.5 rounded-lg flex items-start gap-2 text-[10px] text-muted-foreground leading-normal mt-2">
              <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="font-sans">
                Based on your reading history, <span className="text-foreground font-bold">{bestMethodInfo.label}</span> is currently your strongest mode, averaging <span className="text-foreground font-semibold">{bestMethodInfo.wpm} WPM</span> with <span className="text-foreground font-semibold">{bestMethodInfo.accuracy}% retention</span>.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
