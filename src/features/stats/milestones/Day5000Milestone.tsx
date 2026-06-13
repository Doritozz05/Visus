import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day5000Milestone: StreakMilestone = {
  id: "day5000",
  isMatch: (s) => s >= 5000 && s < 7000,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="-5 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_25px_rgba(236,72,153,0.6)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        {/* Background glitch aura */}
        <motion.rect x="5" y="10" width="90" height="80" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="10 20" animate={{ strokeDashoffset: [0, 60] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} opacity="0.4" />
        <motion.rect x="10" y="15" width="80" height="70" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="15 30" animate={{ strokeDashoffset: [0, -90] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} opacity="0.4" />

        {/* Retro 80s Grid Floor */}
        <path d="M10,80 L90,80 L110,100 L-10,100 Z" fill="url(#synthwave-grid)" opacity="0.6" />
        <defs>
          <linearGradient id="synthwave-grid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Holographic Wireframe Wings */}
        <motion.path d="M40,30 L10,10 L25,45 Z" fill="none" stroke="#06b6d4" strokeWidth="2" animate={{ x: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 0.1 }} />
        <motion.path d="M60,30 L90,10 L75,45 Z" fill="none" stroke="#06b6d4" strokeWidth="2" animate={{ x: [2, -2, 2] }} transition={{ repeat: Infinity, duration: 0.1 }} />
        <motion.path d="M25,45 L0,55 L20,70 Z" fill="none" stroke="#ec4899" strokeWidth="2" animate={{ x: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 0.15 }} />
        <motion.path d="M75,45 L100,55 L80,70 Z" fill="none" stroke="#ec4899" strokeWidth="2" animate={{ x: [3, -3, 3] }} transition={{ repeat: Infinity, duration: 0.15 }} />

        {/* Ears */}
        <polygon points="20,35 50,35 25,10" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
        <polygon points="50,35 80,35 75,10" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />

        {/* Body Frame */}
        <rect x="15" y="22" width="70" height="65" rx="5" fill="#0f172a" stroke="#ec4899" strokeWidth="3" />
        <rect x="20" y="27" width="60" height="55" rx="3" fill="#1e293b" />

        {/* Belly (Retro Sun) */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#f59e0b" />
        {/* Sun scanlines */}
        <rect x="28" y="58" width="44" height="2" fill="#1e293b" />
        <rect x="28" y="64" width="44" height="3" fill="#1e293b" />
        <rect x="28" y="70" width="44" height="4" fill="#1e293b" />
        <rect x="28" y="76" width="44" height="5" fill="#1e293b" />

        {/* Cyberpunk Visor */}
        <rect x="25" y="38" width="50" height="12" rx="6" fill="#020617" stroke="#06b6d4" strokeWidth="2" />
        <motion.rect x="30" y="40" width="10" height="8" rx="4" fill="#22d3ee" animate={{ x: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
        
        {/* Digital Beak */}
        <polygon points="45,52 55,52 50,60" fill="#ec4899" />
        
        {/* CRT Scanline overlay effect */}
        <motion.rect x="15" y="22" width="70" height="65" rx="5" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }} />
      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);
    ctx.translate(18.75, 10);
    ctx.scale(0.8, 0.8);

    const ox = 0; const oy = 0;

    // Glowing effect
    ctx.shadowColor = "rgba(236,72,153,0.6)";
    ctx.shadowBlur = 10;

    // Glitch aura (static rep)
    ctx.strokeStyle = "#ec4899"; ctx.lineWidth = 2; ctx.globalAlpha = 0.4; ctx.setLineDash([10, 20]);
    ctx.strokeRect(ox+5, oy+10, 90, 80);
    ctx.strokeStyle = "#06b6d4"; ctx.setLineDash([15, 30]);
    ctx.strokeRect(ox+10, oy+15, 80, 70);
    ctx.globalAlpha = 1.0; ctx.setLineDash([]);

    // Retro Grid
    const gradient = ctx.createLinearGradient(ox, oy+80, ox, oy+100);
    gradient.addColorStop(0, "rgba(236,72,153,0)");
    gradient.addColorStop(1, "rgba(236,72,153,0.5)");
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.moveTo(ox+10, oy+80); ctx.lineTo(ox+90, oy+80); ctx.lineTo(ox+110, oy+100); ctx.lineTo(ox-10, oy+100); ctx.closePath(); ctx.fill();

    // Wireframe Wings
    ctx.strokeStyle = "#06b6d4"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox+40, oy+30); ctx.lineTo(ox+10, oy+10); ctx.lineTo(ox+25, oy+45); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+60, oy+30); ctx.lineTo(ox+90, oy+10); ctx.lineTo(ox+75, oy+45); ctx.closePath(); ctx.stroke();
    
    ctx.strokeStyle = "#ec4899";
    ctx.beginPath(); ctx.moveTo(ox+25, oy+45); ctx.lineTo(ox+0, oy+55); ctx.lineTo(ox+20, oy+70); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+75, oy+45); ctx.lineTo(ox+100, oy+55); ctx.lineTo(ox+80, oy+70); ctx.closePath(); ctx.stroke();

    // Ears
    ctx.fillStyle = "#0f172a"; ctx.strokeStyle = "#ec4899"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox+20, oy+35); ctx.lineTo(ox+50, oy+35); ctx.lineTo(ox+25, oy+10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+50, oy+35); ctx.lineTo(ox+80, oy+35); ctx.lineTo(ox+75, oy+10); ctx.closePath(); ctx.fill(); ctx.stroke();

    // Body
    ctx.fillStyle = "#0f172a"; ctx.strokeStyle = "#ec4899"; ctx.lineWidth = 3;
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(ox+15, oy+22, 70, 65, 5); else ctx.rect(ox+15, oy+22, 70, 65); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#1e293b";
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(ox+20, oy+27, 60, 55, 3); else ctx.rect(ox+20, oy+27, 60, 55); ctx.fill();

    // Retro Sun Belly
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath(); ctx.ellipse(ox+50, oy+62, 22, 18, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(ox+28, oy+58, 44, 2);
    ctx.fillRect(ox+28, oy+64, 44, 3);
    ctx.fillRect(ox+28, oy+70, 44, 4);
    ctx.fillRect(ox+28, oy+76, 44, 5);

    // Cyberpunk Visor
    ctx.fillStyle = "#020617"; ctx.strokeStyle = "#06b6d4"; ctx.lineWidth = 2;
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(ox+25, oy+38, 50, 12, 6); else ctx.rect(ox+25, oy+38, 50, 12); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#22d3ee";
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(ox+45, oy+40, 10, 8, 4); else ctx.rect(ox+45, oy+40, 10, 8); ctx.fill();

    // Beak
    ctx.fillStyle = "#ec4899";
    ctx.beginPath(); ctx.moveTo(ox+45, oy+52); ctx.lineTo(ox+55, oy+52); ctx.lineTo(ox+50, oy+60); ctx.closePath(); ctx.fill();

    ctx.restore();
  },
};
