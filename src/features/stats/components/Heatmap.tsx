/**
 * @file Heatmap.tsx
 * @description GitHub-style contribution grid representing reading minutes per day over the past year.
 */

"use client";

import * as React from "react";
import { ReadingSessionLog } from "@/core/entities/stats";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface HeatmapProps {
  logs: ReadingSessionLog[];
}

export function Heatmap({ logs }: HeatmapProps) {
  const [hoveredDay, setHoveredDay] = React.useState<{ date: string; minutes: number; x: number; y: number } | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to the rightmost edge on mount
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [logs]);

  // 1. Map logs into date map (YYYY-MM-DD -> minutes)
  const dateMap = React.useMemo(() => {
    const map = new Map<string, number>();
    logs.forEach((log) => {
      const date = new Date(log.completedAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const existing = map.get(key) || 0;
      map.set(key, existing + log.durationSeconds / 60);
    });
    return map;
  }, [logs]);

  // 2. Generate past 365 days grid (53 weeks x 7 days)
  const gridData = React.useMemo(() => {
    const weeks: { date: Date; key: string; minutes: number }[][] = [];
    const today = new Date();
    
    // Go back to the Sunday of 52 weeks ago
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek); // Start on Sunday

    let current = new Date(startDate);

    for (let w = 0; w < 53; w++) {
      const week: { date: Date; key: string; minutes: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
        const minutes = dateMap.get(key) || 0;
        
        week.push({
          date: new Date(current),
          key,
          minutes
        });
        
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  }, [dateMap]);

  // Color mapper based on minutes read
  const getColor = (minutes: number) => {
    if (minutes === 0) return "fill-neutral-200 dark:fill-neutral-800/60";
    if (minutes < 5) return "fill-emerald-200 dark:fill-emerald-900/50";
    if (minutes < 15) return "fill-emerald-400 dark:fill-emerald-700";
    if (minutes < 30) return "fill-emerald-500 dark:fill-emerald-500";
    return "fill-emerald-600 dark:fill-emerald-300"; // Highest intensity
  };

  // Month labels derivation
  const monthLabels = React.useMemo(() => {
    const labels: { text: string; colIndex: number }[] = [];
    let lastMonth = -1;

    gridData.forEach((week, colIndex) => {
      // Look at the Wednesday of the week to align labels nicely
      const wednesday = week[3].date;
      const m = wednesday.getMonth();
      if (m !== lastMonth) {
        labels.push({ text: MONTHS[m], colIndex });
        lastMonth = m;
      }
    });

    return labels;
  }, [gridData]);

  // SVG grid sizing parameters
  const boxSize = 10;
  const gap = 2;
  const labelHeight = 15;
  const dayOfWeekWidth = 20;

  const width = 53 * (boxSize + gap) + dayOfWeekWidth;
  const height = 7 * (boxSize + gap) + labelHeight;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col justify-between h-full group hover:border-primary/40 transition-all shadow-md glass-panel overflow-hidden">
      <div className="w-full border-b border-border/10 pb-2 mb-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Daily Consistency</h3>
        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Minutes read each day over the past year</p>
      </div>

      <div ref={scrollContainerRef} className="relative w-full overflow-x-auto custom-scrollbar flex justify-start py-2 min-h-[120px]">
        <svg width={width} height={height} className="overflow-visible select-none shrink-0 pr-4">
          {/* Month labels */}
          {monthLabels.map((lbl, idx) => (
            <text
              key={idx}
              x={dayOfWeekWidth + lbl.colIndex * (boxSize + gap)}
              y={labelHeight - 5}
              className="fill-muted-foreground font-mono text-[8px] font-semibold"
            >
              {lbl.text}
            </text>
          ))}

          {/* Day of week labels */}
          {["M", "W", "F"].map((day, idx) => {
            const rowIndex = [1, 3, 5][idx]; // Mon, Wed, Fri
            return (
              <text
                key={idx}
                x="0"
                y={labelHeight + rowIndex * (boxSize + gap) + 8}
                className="fill-muted-foreground/60 font-mono text-[7px]"
              >
                {day}
              </text>
            );
          })}

          {/* Heatmap Grid boxes */}
          {gridData.map((week, colIdx) => (
            <g key={colIdx} transform={`translate(${dayOfWeekWidth + colIdx * (boxSize + gap)}, ${labelHeight})`}>
              {week.map((day, rowIdx) => (
                <rect
                  key={rowIdx}
                  y={rowIdx * (boxSize + gap)}
                  width={boxSize}
                  height={boxSize}
                  rx="1.5"
                  ry="1.5"
                  className={`${getColor(day.minutes)} stroke-[0.25] stroke-background hover:stroke-foreground cursor-pointer transition-all`}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const container = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    if (container) {
                      const rawX = rect.left - container.left + boxSize / 2;
                      const clampedX = Math.min(Math.max(rawX, 60), width - 60);
                      setHoveredDay({
                        date: formatDate(day.date),
                        minutes: Math.round(day.minutes * 10) / 10,
                        x: clampedX,
                        y: rect.top - container.top - 40
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredDay(null)}
                />
              ))}
            </g>
          ))}
        </svg>

          {/* Floating Tooltip */}
        {hoveredDay && (
          <div
            className="absolute bg-popover/90 text-popover-foreground border border-border/40 text-[9px] font-mono px-2 py-1.5 rounded shadow-xl pointer-events-none backdrop-blur-sm z-30 flex flex-col items-center"
            style={{
              left: `${hoveredDay.x}px`,
              top: `${hoveredDay.y}px`,
              transform: "translateX(-50%)"
            }}
          >
            <div className="font-semibold text-center leading-normal max-w-[120px]">{hoveredDay.date}</div>
            <div className="text-primary mt-1 font-bold">{hoveredDay.minutes} mins read</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-end items-center gap-1.5 text-[9px] font-mono text-muted-foreground/85 mt-2">
        <span>Less</span>
        <div className="w-2.5 h-2.5 rounded-[1.5px] bg-neutral-200 dark:bg-neutral-800/60 border border-background"></div>
        <div className="w-2.5 h-2.5 rounded-[1.5px] bg-emerald-200 dark:bg-emerald-900/50 border border-background"></div>
        <div className="w-2.5 h-2.5 rounded-[1.5px] bg-emerald-400 dark:bg-emerald-700 border border-background"></div>
        <div className="w-2.5 h-2.5 rounded-[1.5px] bg-emerald-500 dark:bg-emerald-500 border border-background"></div>
        <div className="w-2.5 h-2.5 rounded-[1.5px] bg-emerald-600 dark:bg-emerald-300 border border-background"></div>
        <span>More</span>
      </div>
    </div>
  );
}
