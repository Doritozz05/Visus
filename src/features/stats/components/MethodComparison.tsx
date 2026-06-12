/**
 * @file MethodComparison.tsx
 * @description Custom SVG comparative bar chart crossing speed and accuracy for Normal, RSVP and Cluster modes.
 */

"use client";

import * as React from "react";
import { ReadingSessionLog } from "@/core/entities/stats";
import { Zap } from "lucide-react";

interface MethodComparisonProps {
  logs: ReadingSessionLog[];
}

export function MethodComparison({ logs }: MethodComparisonProps) {
  // 1. Calculate averages per method
  const stats = React.useMemo(() => {
    const defaultStats = {
      normal: { wpm: 280, accuracy: 94, count: 0 },
      rsvp: { wpm: 550, accuracy: 88, count: 0 },
      cluster: { wpm: 480, accuracy: 90, count: 0 }
    };

    if (logs.length === 0) return defaultStats;

    const sums = {
      normal: { wpm: 0, accuracy: 0, count: 0 },
      rsvp: { wpm: 0, accuracy: 0, count: 0 },
      cluster: { wpm: 0, accuracy: 0, count: 0 }
    };

    logs.forEach((log) => {
      const mode = log.mode as "normal" | "rsvp" | "cluster";
      if (sums[mode]) {
        sums[mode].wpm += log.speedWpm;
        sums[mode].accuracy += log.accuracy || 90;
        sums[mode].count += 1;
      }
    });

    const result = { ...defaultStats };
    (Object.keys(sums) as Array<keyof typeof sums>).forEach((mode) => {
      const s = sums[mode];
      if (s.count > 0) {
        result[mode] = {
          wpm: Math.round(s.wpm / s.count),
          accuracy: Math.round(s.accuracy / s.count),
          count: s.count
        };
      }
    });

    return result;
  }, [logs]);

  // Determine the most efficient method (highest value of wpm * accuracy)
  const bestMethodInfo = React.useMemo(() => {
    const scores = {
      normal: stats.normal.wpm * (stats.normal.accuracy / 100),
      rsvp: stats.rsvp.wpm * (stats.rsvp.accuracy / 100),
      cluster: stats.cluster.wpm * (stats.cluster.accuracy / 100)
    };

    let bestMode: "normal" | "rsvp" | "cluster" = "normal";
    if (scores.rsvp > scores.normal && scores.rsvp > scores.cluster) {
      bestMode = "rsvp";
    } else if (scores.cluster > scores.normal && scores.cluster > scores.rsvp) {
      bestMode = "cluster";
    }

    const modeLabels = {
      normal: "Normal Reading",
      rsvp: "RSVP",
      cluster: "Cluster Chunks"
    };

    const multiplier = Math.round((scores[bestMode] / (scores.normal || 1) - 1) * 100);

    return {
      label: modeLabels[bestMode],
      multiplier: multiplier > 0 ? `+${multiplier}%` : "optimal",
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

  const maxWpmValue = 1000; // ceiling for normalization

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col justify-between h-full group hover:border-primary/40 transition-all shadow-md glass-panel overflow-hidden">
      <div className="w-full border-b border-border/10 pb-2 mb-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Efficiency Comparison</h3>
        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Speed vs comprehension contrast by method</p>
      </div>

      <div className="relative w-full overflow-x-auto flex justify-center py-2 min-h-[140px]">
        <svg width={width} height={height} className="overflow-visible select-none">
          {/* Method Rows */}
          {["normal", "rsvp", "cluster"].map((mode, idx) => {
            const y = idx * rowGap + 20;
            const modeStats = stats[mode as keyof typeof stats];
            
            // Width computations
            const wpmWidth = Math.min(1.0, modeStats.wpm / maxWpmValue) * 250;
            const accWidth = (modeStats.accuracy / 100) * 250;

            const modeLabels = {
              normal: "Normal",
              rsvp: "RSVP",
              cluster: "Cluster"
            };

            return (
              <g key={mode}>
                {/* Method Name */}
                <text
                  x="0"
                  y={y + 10}
                  className="fill-foreground font-heading text-[10px] font-bold"
                >
                  {modeLabels[mode as keyof typeof modeLabels]}
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
                  {modeStats.wpm} WPM
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
                  {modeStats.accuracy}% Retention
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynamic Recommendation Alert */}
      <div className="bg-background/40 border border-border/10 p-2.5 rounded-lg flex items-start gap-2 text-[10px] text-muted-foreground leading-normal mt-2">
        <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="font-sans">
          Efficiency analysis: The <span className="text-foreground font-bold">{bestMethodInfo.label}</span> method offers your most efficient reading ratio (<span className="text-primary font-bold font-mono">{bestMethodInfo.multiplier}</span> estimated performance) with a speed of <span className="text-foreground font-semibold">{bestMethodInfo.wpm} WPM</span> and <span className="text-foreground font-semibold">{bestMethodInfo.accuracy}% retention</span>.
        </p>
      </div>
    </div>
  );
}
