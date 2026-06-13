/**
 * @file ShareCard.tsx
 * @description Generates a premium canvas-based share card to download and share reading metrics on social media.
 */

"use client";

import * as React from "react";
import { LibraryStatsSummary } from "@/core/entities/stats";
import { Share2, Download, MessageSquarePlus, MessageCircle, Smartphone } from "lucide-react";

interface ShareCardProps {
  summary: LibraryStatsSummary;
}

export function ShareCard({ summary }: ShareCardProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Draw premium background gradient (matches web preview)
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, "#0f0c20");
    bgGrad.addColorStop(1, "#25123e");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Draw aesthetic grid mesh (subtle)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    const gridGap = 40;
    for (let x = 0; x < w; x += gridGap) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridGap) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 3. Top left: VISUS // READING TELEMETRY
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "20px monospace";
    if ('letterSpacing' in ctx) {
      (ctx as any).letterSpacing = "4px";
    }
    ctx.fillText("VISUS // READING TELEMETRY", 40, 60);

    // 4. Large metric card: Speed
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 130px sans-serif";
    const wpmStr = String(summary.averageWpm || 0);
    ctx.fillText(wpmStr, 35, 230);
    
    const wpmWidth = ctx.measureText(wpmStr).width;
    ctx.fillStyle = "hsl(243, 75%, 65%)"; // Primary color approximate
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("WPM", 35 + wpmWidth + 15, 230);

    // Average Speed Label
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    if ('letterSpacing' in ctx) {
      (ctx as any).letterSpacing = "2px";
    }
    ctx.font = "20px monospace";
    ctx.fillText("AVERAGE SPEED", 45, 280);

    // Reset letter spacing
    if ('letterSpacing' in ctx) {
      (ctx as any).letterSpacing = "0px";
    }

    // 5. Bottom left: Tagline
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "italic 24px sans-serif";
    ctx.fillText("Perfect speed & comprehension.", 40, 410);

    // 6. Bottom right: Streak
    const streakDays = summary.currentStreakDays || 0;
    const streakStr = `${streakDays} ${streakDays === 1 ? 'Day' : 'Days'}`;
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px sans-serif";
    const streakWidth = ctx.measureText(streakStr).width;
    ctx.fillText(streakStr, w - streakWidth - 40, 375);

    const lblStr = "CURRENT STREAK";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "20px monospace";
    const lblWidth = ctx.measureText(lblStr).width;
    ctx.fillText(lblStr, w - lblWidth - 40, 410);

    return canvas;
  };

  const shareToNative = async () => {
    const canvas = drawCanvas();
    if (!canvas) return;

    const text = `I'm reading at ${summary.averageWpm || 0} WPM with a ${summary.currentStreakDays || 0}-day streak on Visus! 🚀📚`;

    // Try Web Share API with image if supported
    if (navigator.share && navigator.canShare) {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "visus-stats.png", { type: "image/png" });
        try {
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Visus Reading Stats',
              text,
              files: [file]
            });
            return;
          } else {
            // Fallback to text only share
            await navigator.share({ title: 'Visus', text });
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
    const text = `I'm reading at ${summary.averageWpm || 0} WPM with a ${summary.currentStreakDays || 0}-day streak on Visus! 🚀📚`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareToWhatsApp = () => {
    const text = `I'm reading at ${summary.averageWpm || 0} WPM with a ${summary.currentStreakDays || 0}-day streak on Visus! 🚀📚`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col justify-between h-full group hover:border-primary/40 transition-all shadow-md liquid-glass">
      <div className="w-full border-b border-border/10 pb-2 mb-4 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Social Card</h3>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Share your milestones with your social network</p>
        </div>
        <Share2 className="w-4 h-4 text-primary shrink-0" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-5 my-2">
        {/* Sleek Preview card */}
        <div className="w-full bg-gradient-to-br from-[#0f0c20] to-[#25123e] border border-white/10 rounded-lg p-4 relative overflow-hidden aspect-[16/9] flex flex-col justify-between shadow-xl">
          <div className="absolute inset-0 bg-white/5 pointer-events-none mix-blend-overlay"></div>
          <div>
            <span className="text-[8px] font-mono text-white/50 tracking-wider">VISUS // READING TELEMETRY</span>
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-4xl font-extrabold text-white leading-none">{summary.averageWpm}</span>
              <span className="text-[10px] font-bold text-primary">WPM</span>
            </div>
            <span className="text-[8px] font-mono text-white/70 uppercase">Average Speed</span>
          </div>

          <div className="flex justify-between items-end">
            <div className="text-[8px] font-sans text-white/40 italic">
              Perfect speed &amp; comprehension.
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-white block">{summary.currentStreakDays} {summary.currentStreakDays === 1 ? 'Day' : 'Days'}</span>
              <span className="text-[7px] font-mono text-white/50 block">CURRENT STREAK</span>
            </div>
          </div>
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
            title="Download Image"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
