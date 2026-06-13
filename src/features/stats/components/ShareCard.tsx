/**
 * @file ShareCard.tsx
 * @description Generates a premium canvas-based share card to download and share reading metrics on social media.
 */

"use client";

import * as React from "react";
import { LibraryStatsSummary } from "@/core/entities/stats";
import { Share2, Download, MessageSquarePlus, MessageCircle, Smartphone } from "lucide-react";
import { getMilestone } from "../milestones";

// Helper for safe canvas rounded rect drawing
const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
};

interface ShareCardProps {
  summary: LibraryStatsSummary;
}

export function ShareCard({ summary }: ShareCardProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [overrideStreak, setOverrideStreak] = React.useState<number | null>(null);

  const displayedStreak = overrideStreak !== null ? overrideStreak : (summary.currentStreakDays || 0);

  const getThemeColor = (cssVarName: string, fallback: string): string => {
    if (typeof window === "undefined") return fallback;
    const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim();
    if (!raw) return fallback;
    if (raw.startsWith("#") || raw.startsWith("rgb") || raw.startsWith("hsl")) return raw;
    return `hsl(${raw.split(/\s+/).join(", ")})`;
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Draw theme-based background gradient
    const cardColor = getThemeColor("--card", "#171f33");
    const bgColor = getThemeColor("--background", "#0b1326");
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, cardColor);
    bgGrad.addColorStop(1, bgColor);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Draw border
    ctx.strokeStyle = getThemeColor("--border", "rgba(255, 255, 255, 0.1)");
    ctx.lineWidth = 2;
    ctx.beginPath();
    drawRoundRect(ctx, 16, 16, w - 32, h - 32, 12);
    ctx.stroke();

    // 3. Top left: VISUS // READING TELEMETRY
    ctx.fillStyle = getThemeColor("--muted-foreground", "rgba(255, 255, 255, 0.5)");
    ctx.font = "20px monospace";
    ctx.textAlign = "left";
    if ("letterSpacing" in ctx) {
      (ctx as any).letterSpacing = "4px";
    }
    ctx.fillText("VISUS // READING TELEMETRY", 40, 60);

    // 4. Centerpiece: Streak Number and Flame / Mascot side-by-side
    ctx.font = "bold 96px sans-serif";
    if ("letterSpacing" in ctx) {
      (ctx as any).letterSpacing = "0px";
    }

    const streakStr = String(displayedStreak);
    const numWidth = ctx.measureText(streakStr).width;
    const centerY = 220; // vertical center of elements

    const milestone = getMilestone(displayedStreak);
    
    // Draw Streak Number
    const totalW = numWidth + (milestone.canvasWidth > 0 ? milestone.gap + milestone.canvasWidth : 0);
    const startX = 400 - totalW / 2;
    ctx.fillStyle = getThemeColor("--foreground", "#ffffff");
    ctx.textAlign = "left";
    ctx.fillText(streakStr, startX, centerY + 35);

    // Draw Milestone canvas graphics if applicable
    if (milestone.canvasWidth > 0) {
      const mx = startX + numWidth + milestone.gap;
      const my = centerY - 45;
      milestone.drawCanvas(ctx, mx, my, displayedStreak);
    }

    // Centerpiece: Streak Label
    ctx.fillStyle = getThemeColor("--muted-foreground", "rgba(255, 255, 255, 0.5)");
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    if ("letterSpacing" in ctx) {
      (ctx as any).letterSpacing = "6px";
    }
    const lblStr = displayedStreak === 1 ? "DAY STREAK" : "DAYS STREAK";
    ctx.fillText(lblStr, 400, centerY + 85);

    // 6. Bottom Left: WPM Metric
    ctx.textAlign = "left";
    if ("letterSpacing" in ctx) {
      (ctx as any).letterSpacing = "0px";
    }
    ctx.fillStyle = getThemeColor("--foreground", "#ffffff");
    ctx.font = "bold 44px sans-serif";
    const wpmStr = String(summary.averageWpm || 0);
    ctx.fillText(wpmStr, 45, 390);

    const wpmWidth = ctx.measureText(wpmStr).width;
    ctx.fillStyle = getThemeColor("--primary", "#6366f1");
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("WPM", 45 + wpmWidth + 8, 390);

    ctx.fillStyle = getThemeColor("--muted-foreground", "rgba(255, 255, 255, 0.5)");
    ctx.font = "14px monospace";
    if ("letterSpacing" in ctx) {
      (ctx as any).letterSpacing = "2px";
    }
    ctx.fillText("AVERAGE SPEED", 45, 415);

    // 7. Bottom Right: Tagline
    ctx.textAlign = "right";
    if ("letterSpacing" in ctx) {
      (ctx as any).letterSpacing = "0px";
    }
    ctx.fillStyle = getThemeColor("--muted-foreground", "rgba(255, 255, 255, 0.4)");
    ctx.font = "italic 16px sans-serif";
    ctx.fillText("Perfect speed & comprehension.", 755, 415);

    return canvas;
  };

  const shareToNative = async () => {
    const canvas = drawCanvas();
    if (!canvas) return;

    const text = `I'm reading at ${summary.averageWpm || 0} WPM with a ${displayedStreak}-day streak on Visus! 🚀📚`;

    // Try Web Share API with image if supported
    if (navigator.share && navigator.canShare) {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "visus-stats.png", { type: "image/png" });
        try {
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: "Visus reading stats",
              text,
              files: [file]
            });
            return;
          } else {
            // Fallback to text only share
            await navigator.share({ title: "Visus", text });
          }
        } catch (err) {
          console.warn("[ShareCard] Native share failed/cancelled:", err);
        }
      });
    } else {
      // Fallback: just download
      downloadImage();
    }
  };

  const downloadImage = () => {
    const canvas = drawCanvas();
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataUrl);
      downloadAnchor.setAttribute("download", `visus_stats_${summary.averageWpm}_wpm.png`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("[ShareCard] Failed to download image:", err);
    }
  };

  const shareToX = () => {
    const text = `I'm reading at ${summary.averageWpm || 0} WPM with a ${displayedStreak}-day streak on Visus! 🚀📚`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToWhatsApp = () => {
    const text = `I'm reading at ${summary.averageWpm || 0} WPM with a ${displayedStreak}-day streak on Visus! 🚀📚`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const milestone = getMilestone(displayedStreak);

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col justify-between h-full group hover:border-primary/40 transition-all shadow-md liquid-glass">
      <div className="w-full border-b border-border/10 pb-2 mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Social card</h3>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Share your milestones with your social network</p>
        </div>
        <Share2 className="w-4 h-4 text-primary shrink-0" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-5 my-2">
        {/* Sleek Preview card */}
        <div className="w-full bg-gradient-to-br from-card to-background border border-border/40 rounded-lg p-4 relative overflow-hidden aspect-[16/9] flex flex-col justify-between shadow-xl">
          {/* Subtle overlay reflection */}
          <div className="absolute inset-0 bg-foreground/[0.02] pointer-events-none mix-blend-overlay"></div>
          
          {/* Header */}
          <div className="flex justify-between items-center w-full">
            <span className="text-[8px] font-mono text-muted-foreground tracking-wider uppercase">VISUS // READING TELEMETRY</span>
          </div>

          {/* Centerpiece: Streak with professional orange fire / Mascot */}
          <div className="flex flex-col items-center justify-center my-auto">
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-extrabold text-foreground leading-none">{displayedStreak}</span>
              {milestone.renderPreview(displayedStreak)}
            </div>
            <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-widest mt-1.5">
              {displayedStreak === 1 ? "Day streak" : "Days streak"}
            </span>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end w-full">
            {/* Speed WPM */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-extrabold text-foreground leading-none">{summary.averageWpm}</span>
                <span className="text-[8px] font-bold text-primary">WPM</span>
              </div>
              <span className="text-[6px] font-mono text-muted-foreground uppercase tracking-wider">Average speed</span>
            </div>

            {/* Tagline */}
            <div className="text-[8px] font-sans text-muted-foreground/60 italic">
              Perfect speed &amp; comprehension.
            </div>
          </div>
        </div>

        {/* Temporary testing milestone toolbar */}
        <div className="w-full bg-accent/40 border border-border/20 rounded-lg p-2.5 flex flex-col gap-2 mt-1">
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest block font-bold">
            Test streak milestones
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 1, 5, 15].map((val) => (
              <button
                key={val}
                onClick={() => setOverrideStreak(val)}
                className={`py-1 rounded font-mono text-[9px] font-bold border transition-all ${
                  overrideStreak === val
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]"
                    : "bg-background border-border/30 hover:bg-accent text-muted-foreground"
                }`}
              >
                Day {val}
              </button>
            ))}
          </div>
          {overrideStreak !== null && (
            <button
              onClick={() => setOverrideStreak(null)}
              className="w-full py-1 bg-background border border-destructive/20 hover:border-destructive/40 text-destructive text-[8px] font-mono uppercase font-bold rounded transition-all"
            >
              Reset to actual streak ({summary.currentStreakDays || 0})
            </button>
          )}
        </div>

        {/* Hidden Canvas for High-Res Generation */}
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="hidden"
        />

        <div className="w-full flex gap-2 mt-2">
          <button
            onClick={shareToNative}
            className="flex-1 py-2 bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_15px_rgba(var(--primary),0.15)] rounded font-mono text-[10px] uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all"
            title="Share via device"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          
          <button
            onClick={shareToX}
            className="px-3 bg-card border border-border/40 hover:bg-accent rounded text-foreground transition-all flex items-center justify-center"
            title="Share on X"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={shareToWhatsApp}
            className="px-3 bg-card border border-border/40 hover:bg-accent rounded text-foreground transition-all flex items-center justify-center"
            title="Share on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={downloadImage}
            className="px-3 bg-card border border-border/40 hover:bg-accent rounded text-foreground transition-all flex items-center justify-center"
            title="Download image"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
