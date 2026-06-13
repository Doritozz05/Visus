/**
 * @file WpmChart.tsx
 * @description Custom SVG Line Chart showcasing WPM fluctuations during a reading session.
 */

"use client";

import * as React from "react";
import { ReadingSessionLog } from "@/core/entities/stats";
import { AlertCircle, Activity } from "lucide-react";

interface WpmChartProps {
  logs: ReadingSessionLog[];
}

export function WpmChart({ logs }: WpmChartProps) {
  // 1. Get the most recent log with speed history, or fallback to a dummy session if empty
  const activeLog = React.useMemo(() => {
    const logWithHistory = logs.find((l) => l.telemetryData?.speed_history && l.telemetryData.speed_history.length > 1);
    if (logWithHistory) return logWithHistory;
    return null;
  }, [logs]);

  const speedData = React.useMemo(() => {
    return activeLog?.telemetryData?.speed_history || [];
  }, [activeLog]);

  const [hoveredPoint, setHoveredPoint] = React.useState<{ index: number; x: number; y: number; wpm: number; offset: number } | null>(null);

  // SVG parameters
  const width = 500;
  const height = 180;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Compute scale boundaries safely
  const maxWpm = speedData.length > 0 ? Math.max(...speedData.map((d) => d.wpm), 600) : 600;
  const minWpm = speedData.length > 0 ? Math.min(...speedData.map((d) => d.wpm), 200) : 200;
  const maxOffset = speedData.length > 0 ? Math.max(...speedData.map((d) => d.offsetSeconds), 180) : 180;

  const getX = React.useCallback((offset: number) => {
    return paddingLeft + (offset / maxOffset) * chartWidth;
  }, [maxOffset, chartWidth]);

  const getY = React.useCallback((wpm: number) => {
    const range = maxWpm - minWpm || 1;
    return paddingTop + chartHeight - ((wpm - minWpm) / range) * chartHeight;
  }, [maxWpm, minWpm, chartHeight]);

  // Build SVG path
  const linePath = React.useMemo(() => {
    if (speedData.length < 2) return "";
    return speedData
      .map((d, idx) => {
        const x = getX(d.offsetSeconds);
        const y = getY(d.wpm);
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [speedData, getX, getY]);

  // Build gradient area path (closes the polygon to the bottom)
  const areaPath = React.useMemo(() => {
    if (speedData.length < 2) return "";
    const startX = getX(speedData[0].offsetSeconds);
    const endX = getX(speedData[speedData.length - 1].offsetSeconds);
    const bottomY = paddingTop + chartHeight;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  }, [speedData, linePath, getX, chartHeight]);

  // Fatigue zone detection (if WPM drops > 15% in the last 2 minutes compared to peak)
  const fatigueZone = React.useMemo(() => {
    if (speedData.length < 4) return null;
    const wpms = speedData.map((d) => d.wpm);
    const peak = Math.max(...wpms);
    const lastIdx = speedData.length - 1;
    const recent = speedData[lastIdx].wpm;

    if (peak > 0 && (peak - recent) / peak > 0.15) {
      // Find where it started dropping
      const dropIndex = speedData.findIndex((d) => d.wpm === peak);
      if (dropIndex !== -1 && dropIndex < lastIdx) {
        return {
          startX: getX(speedData[dropIndex].offsetSeconds),
          endX: getX(speedData[lastIdx].offsetSeconds),
          dropPercentage: Math.round(((peak - recent) / peak) * 100)
        };
      }
    }
    return null;
  }, [speedData, getX]);

  // Hover tracker
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (speedData.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;

    // Map clientX to offsetSeconds
    const relativeX = clientX - paddingLeft;
    const offset = Math.max(0, Math.min(maxOffset, (relativeX / chartWidth) * maxOffset));

    // Find closest speed data point
    let closestIdx = 0;
    let minDiff = Infinity;
    speedData.forEach((d, idx) => {
      const diff = Math.abs(d.offsetSeconds - offset);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    const point = speedData[closestIdx];
    setHoveredPoint({
      index: closestIdx,
      x: getX(point.offsetSeconds),
      y: getY(point.wpm),
      wpm: point.wpm,
      offset: point.offsetSeconds
    });
  };

  const formatOffset = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  if (!activeLog) {
    return (
      <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col justify-between h-full group hover:border-primary/40 transition-all shadow-md liquid-glass overflow-hidden">
        <div className="w-full border-b border-border/10 pb-2 mb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Speed Fluctuation</h3>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">WPM dynamics in session</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-muted-foreground opacity-50">
          <Activity className="w-8 h-8 mb-2" />
          <p className="text-xs font-mono">No telemetry data recorded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col justify-between h-full group hover:border-primary/40 transition-all shadow-md liquid-glass overflow-hidden">
      <div className="w-full border-b border-border/10 pb-2 mb-3 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Speed Fluctuation</h3>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">WPM dynamics in: <span className="font-semibold text-primary">&quot;{activeLog.bookTitle.split(" - ")[0]}&quot;</span></p>
        </div>
        {fatigueZone && (
          <div className="flex items-center gap-1 text-[9px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Fatigue: -{fatigueZone.dropPercentage}% WPM</span>
          </div>
        )}
      </div>

      <div className="relative w-full overflow-x-auto overflow-y-hidden custom-scrollbar flex justify-center py-2 min-h-[160px]">
        <svg
          width={width}
          height={height}
          className="overflow-visible select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Gradients definitions */}
          <defs>
            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
            </linearGradient>
            <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1.0].map((val, idx) => {
            const y = paddingTop + chartHeight * val;
            const wpmLabel = Math.round(maxWpm - val * (maxWpm - minWpm));
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-border/20"
                  strokeWidth="0.5"
                  strokeDasharray="2 2"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-muted-foreground font-mono text-[8px]"
                >
                  {wpmLabel}
                </text>
              </g>
            );
          })}

          {/* X Axis time labels */}
          {[0, 0.5, 1.0].map((val, idx) => {
            const offset = val * maxOffset;
            const x = getX(offset);
            return (
              <text
                key={idx}
                x={x}
                y={height - 5}
                textAnchor="middle"
                className="fill-muted-foreground font-mono text-[8px]"
              >
                {formatOffset(Math.round(offset))}
              </text>
            );
          })}

          {/* Highlight fatigue deceleration zone */}
          {fatigueZone && (
            <rect
              x={fatigueZone.startX}
              y={paddingTop}
              width={fatigueZone.endX - fatigueZone.startX}
              height={chartHeight}
              fill="rgba(245, 158, 11, 0.08)"
              stroke="rgba(245, 158, 11, 0.2)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}

          {/* Area under the line */}
          {areaPath && <path d={areaPath} fill="url(#area-grad)" />}

          {/* Line Path */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
              filter="url(#line-glow)"
              className="transition-all duration-300"
            />
          )}

          {/* Hover tracker crosshair */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={paddingTop}
                x2={hoveredPoint.x}
                y2={paddingTop + chartHeight}
                stroke="hsl(var(--primary))"
                strokeWidth="0.75"
                strokeDasharray="2 2"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="5"
                className="fill-primary stroke-background"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute bg-popover/90 text-popover-foreground border border-border/40 text-[9px] font-mono px-2 py-1.5 rounded shadow-xl pointer-events-none backdrop-blur-sm z-30"
            style={{
              left: `${hoveredPoint.x}px`,
              top: `${hoveredPoint.y - 35}px`,
              transform: "translateX(-50%)"
            }}
          >
            <div className="font-bold">{formatOffset(hoveredPoint.offset)}</div>
            <div className="text-primary mt-0.5">{hoveredPoint.wpm} WPM</div>
          </div>
        )}
      </div>
    </div>
  );
}
