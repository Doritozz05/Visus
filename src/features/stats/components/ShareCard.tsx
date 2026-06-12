/**
 * @file ShareCard.tsx
 * @description Generates a premium canvas-based share card to download and share reading metrics on social media.
 */

"use client";

import * as React from "react";
import { LibraryStatsSummary } from "@/core/entities/stats";
import { Share2, Download } from "lucide-react";

interface ShareCardProps {
  summary: LibraryStatsSummary;
}

export function ShareCard({ summary }: ShareCardProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const drawAndDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions
    const w = canvas.width;
    const h = canvas.height;

    // 1. Draw premium background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, "#0f0c20");   // Deep dark navy
    bgGrad.addColorStop(0.5, "#15102a"); // Dark indigo
    bgGrad.addColorStop(1, "#25123e");   // Dark violet/purple
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Draw aesthetic grid mesh (subtle)
    ctx.strokeStyle = "rgba(139, 92, 246, 0.08)";
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

    // 3. Draw ambient neon glowing circles
    const radGrad = ctx.createRadialGradient(w * 0.8, h * 0.2, 50, w * 0.8, h * 0.2, 300);
    radGrad.addColorStop(0, "rgba(139, 92, 246, 0.15)"); // Primary/Purple
    radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(w * 0.8, h * 0.2, 300, 0, Math.PI * 2);
    ctx.fill();

    const radGrad2 = ctx.createRadialGradient(w * 0.2, h * 0.8, 50, w * 0.2, h * 0.8, 300);
    radGrad2.addColorStop(0, "rgba(16, 185, 129, 0.12)"); // Emerald/Green
    radGrad2.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radGrad2;
    ctx.beginPath();
    ctx.arc(w * 0.2, h * 0.8, 300, 0, Math.PI * 2);
    ctx.fill();

    // 4. Draw outer border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 20;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Inner glowing thin line
    ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    // 5. Title / Logo
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "bold 12px monospace";
    ctx.letterSpacing = "4px";
    ctx.fillText("VISUS // READING TELEMETRY", 55, 65);

    // 6. Large metric card: Speed (Left side)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 72px sans-serif";
    ctx.fillText(String(summary.averageWpm || 550), 55, 200);
    
    ctx.fillStyle = "rgba(139, 92, 246, 1)"; // Neon purple label
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("AVERAGE WPM", 55, 230);

    // 7. Right column stats
    const rightX = 350;
    
    // Stat 1: Racha
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText(`${summary.currentStreakDays || 0} ${summary.currentStreakDays === 1 ? 'Day' : 'Days'}`, rightX, 130);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "bold 11px monospace";
    ctx.fillText("READING STREAK", rightX, 155);

    // Stat 2: Tiempo Total
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText(`${summary.totalReadingTimeMinutes || 0} ${summary.totalReadingTimeMinutes === 1 ? 'Minute' : 'Minutes'}`, rightX, 230);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "bold 11px monospace";
    ctx.fillText("TOTAL ACTIVE TIME", rightX, 255);

    // Stat 3: Libros leídos
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px sans-serif";
    ctx.fillText(`${summary.totalBooksRead || 0} ${summary.totalBooksRead === 1 ? 'Book' : 'Books'}`, rightX, 330);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "bold 11px monospace";
    ctx.fillText("COMPLETED IN LIBRARY", rightX, 355);

    // 8. Footer tagline
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "italic 13px sans-serif";
    ctx.fillText("Speed and retention in perfect harmony.", 55, 380);

    // 9. Download anchor
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataUrl);
      downloadAnchor.setAttribute("download", `visus_reading_milestone_${summary.averageWpm}_wpm.png`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("[ShareCard] Failed to convert canvas to image:", err);
    }
  };

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col justify-between h-full group hover:border-primary/40 transition-all shadow-md glass-panel">
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

        <button
          onClick={drawAndDownload}
          className="w-full py-2 bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_15px_rgba(var(--primary),0.15)] rounded font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Card</span>
        </button>
      </div>
    </div>
  );
}
