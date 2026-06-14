/**
 * @file RadarChart.tsx
 * @description Custom SVG Radar Chart visualizing the user's reading profile.
 */

"use client";

import * as React from "react";
import { ReadingSessionLog } from "@/core/entities/stats";
import { Book } from "@/core/entities/book";

interface RadarChartProps {
  logs: ReadingSessionLog[];
  books: Book[];
}

export function RadarChart({ logs, books }: RadarChartProps) {
  const [hoveredMetric, setHoveredMetric] = React.useState<{ name: string; value: string; x: number; y: number } | null>(null);

  // 1. Compute reading profile metrics
  const metrics = React.useMemo(() => {
    if (logs.length === 0) {
      return null;
    }

    // Speed: average session WPM relative to 1000 WPM target
    const avgWpm = logs.reduce((sum, l) => sum + l.speedWpm, 0) / logs.length;
    const speedScore = Math.min(1.0, avgWpm / 1000);

    // Endurance: average session duration relative to 30 mins (1800s)
    const avgDuration = logs.reduce((sum, l) => sum + l.durationSeconds, 0) / logs.length;
    const enduranceScore = Math.min(1.0, avgDuration / 1800);

    // Comprehension: average accuracy
    const logsWithAccuracy = logs.filter(l => l.accuracy != null);
    const avgAccuracy = logsWithAccuracy.length > 0 
      ? logsWithAccuracy.reduce((sum, l) => sum + l.accuracy!, 0) / logsWithAccuracy.length
      : 0;
    const compScore = avgAccuracy / 100;

    // Consistency: active days in last 30 days relative to 15 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const uniqueDaysLast30 = new Set(
      logs
        .filter((l) => new Date(l.completedAt) >= thirtyDaysAgo)
        .map((l) => new Date(l.completedAt).toDateString())
    ).size;
    const consistencyScore = Math.min(1.0, uniqueDaysLast30 / 15);

    // Diversity: number of unique genres read relative to 5
    const uniqueGenres = new Set(books.flatMap((b) => b.genres || []));
    const diversityScore = Math.min(1.0, Math.max(1, uniqueGenres.size) / 5);

    return [
      { name: "Speed", value: speedScore, label: `${Math.round(avgWpm)} WPM` },
      { name: "Endurance", value: enduranceScore, label: `${Math.round(avgDuration / 60)} min` },
      { name: "Comprehension", value: compScore, label: `${Math.round(avgAccuracy)}%` },
      { name: "Consistency", value: consistencyScore, label: `${uniqueDaysLast30} days/month` },
      { name: "Diversity", value: diversityScore, label: `${Math.max(1, uniqueGenres.size)} ${Math.max(1, uniqueGenres.size) === 1 ? 'genre' : 'genres'}` }
    ];
  }, [logs, books]);

  if (!metrics) {
    return (
      <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col justify-between h-full group hover:border-primary/40 transition-all shadow-md liquid-glass overflow-hidden">
        <div className="w-full border-b border-border/10 pb-2 mb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Reader Profile</h3>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Balanced view of your skills</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-muted-foreground opacity-50">
          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <p className="text-xs font-mono">Not enough data to calculate profile.</p>
        </div>
      </div>
    );
  }

  // SVG parameters
  const size = 300;
  const center = size / 2;
  const radius = 95;
  const totalAxes = metrics.length;

  // Compute coordinates for a value on an axis
  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const x = center + radius * val * Math.cos(angle);
    const y = center + radius * val * Math.sin(angle);
    return { x, y };
  };

  // Generate background concentric grid pentagons
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPolygons = gridLevels.map((level) => {
    const points = metrics.map((_, i) => {
      const { x, y } = getCoordinates(i, level);
      return `${x},${y}`;
    }).join(" ");
    return points;
  });

  // Generate actual value polygon points
  const valuePoints = metrics.map((m, i) => {
    const { x, y } = getCoordinates(i, m.value);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col items-center justify-between h-full relative group hover:border-primary/40 transition-all shadow-md liquid-glass">
      <div className="w-full border-b border-border/10 pb-2 mb-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Reader Profile</h3>
        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Balanced view of your skills</p>
      </div>

      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          {/* Concentric grid lines */}
          {gridPolygons.map((points, idx) => (
            <polygon
              key={idx}
              points={points}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-border/60 dark:text-border/40"
            />
          ))}

          {/* Concentric grid labels */}
          {gridLevels.map((level, idx) => {
            const { x, y } = getCoordinates(0, level);
            return (
              <text
                key={idx}
                x={x + 4}
                y={y + 10}
                className="fill-muted-foreground font-mono text-[8px]"
              >
                {Math.round(level * 100)}%
              </text>
            );
          })}

          {/* Axis lines and labels */}
          {metrics.map((m, i) => {
            const outer = getCoordinates(i, 1.0);
            const labelPos = getCoordinates(i, 1.18);
            
            // Adjust label alignment based on position
            let textAnchor: "inherit" | "middle" | "end" | "start" = "middle";
            if (labelPos.x < center - 10) textAnchor = "end";
            if (labelPos.x > center + 10) textAnchor = "start";

            return (
              <g key={i}>
                {/* Axis line */}
                <line
                  x1={center}
                  y1={center}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="currentColor"
                  className="text-border/60 dark:text-border/40"
                  strokeWidth="1"
                />
                {/* Axis label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y + 3}
                  textAnchor={textAnchor}
                  className="fill-foreground font-heading text-[10px] font-semibold tracking-tight cursor-default"
                >
                  {m.name}
                </text>
              </g>
            );
          })}

          {/* Glow filter */}
          <defs>
            <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Filled Value Polygon */}
          <polygon
            points={valuePoints}
            fill="hsl(var(--primary) / 0.25)"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            filter="url(#radar-glow)"
            className="transition-all duration-500"
          />

          {/* Hover interactive nodes */}
          {metrics.map((m, i) => {
            const { x, y } = getCoordinates(i, m.value);
            const isHovered = hoveredMetric?.name === m.name;
            
            return (
              <g key={i} className="cursor-pointer">
                {/* Invisible hit area for better UX and stability */}
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="transparent"
                  onMouseEnter={() => setHoveredMetric({ name: m.name, value: m.label, x, y })}
                  onMouseLeave={() => setHoveredMetric(null)}
                />
                {/* Visual point */}
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  className={`transition-all duration-300 pointer-events-none fill-primary stroke-background ${
                    isHovered ? "scale-150 brightness-110" : ""
                  }`}
                  strokeWidth="1.5"
                  style={{ 
                    transformOrigin: "center",
                    transformBox: "fill-box"
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating HTML Tooltip */}
        {hoveredMetric && (
          <div
            className="absolute bg-popover text-popover-foreground border border-border/40 text-[10px] font-mono px-2 py-1 rounded shadow-xl pointer-events-none liquid-glass z-50"

            style={{
              left: `${hoveredMetric.x}px`,
              top: `${hoveredMetric.y - 35}px`,
              transform: "translateX(-50%)"
            }}
          >
            <div className="font-bold">{hoveredMetric.name}</div>
            <div className="text-primary mt-0.5">{hoveredMetric.value}</div>
          </div>
        )}
      </div>
    </div>
  );
}
