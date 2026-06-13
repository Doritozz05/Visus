import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day1Milestone: StreakMilestone = {
  id: "day1",
  isMatch: (s) => s >= 1 && s < 5,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="0 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(79,70,229,0.15)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      >
        {/* Ears */}
        <polygon points="20,35 50,35 25,18" fill="#4f46e5" />
        <polygon points="50,35 80,35 75,18" fill="#4f46e5" />

        {/* Feet */}
        <ellipse cx="32" cy="86" rx="6" ry="4" fill="#f97316" />
        <ellipse cx="68" cy="86" rx="6" ry="4" fill="#f97316" />

        {/* Body */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#4f46e5" />

        {/* Belly */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#c7d2fe" />

        {/* Curious Eyes (Slightly larger pupils, looking at the match) */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" />
        <circle cx="63" cy="42" r="12" fill="#ffffff" />

        <circle cx="39" cy="42" r="6" fill="#1e1b4b" />
        <circle cx="61" cy="42" r="6" fill="#1e1b4b" />
        
        <circle cx="41" cy="40" r="2" fill="#ffffff" />
        <circle cx="63" cy="40" r="2" fill="#ffffff" />

        {/* Beak */}
        <polygon points="47,49 53,49 50,54" fill="#f97316" />

        {/* Left Wing (Resting) */}
        <path d="M15,55 Q5,65 10,75" fill="none" stroke="#4f46e5" strokeWidth="9" strokeLinecap="round" />
        
        {/* Right Wing (Holding Match) */}
        <path d="M85,55 Q95,50 80,65" fill="none" stroke="#4f46e5" strokeWidth="9" strokeLinecap="round" />

        {/* The Spark (Matchstick) */}
        <g transform="translate(75, 55) rotate(15)">
          {/* Matchstick body */}
          <rect x="0" y="0" width="2" height="15" fill="#d97706" />
          {/* Matchstick head */}
          <ellipse cx="1" cy="0" rx="2.5" ry="3" fill="#b91c1c" />
          {/* Tiny Flame */}
          <motion.path
            d="M1,-4 Q3,-8 5,-4 Q3,-2 1,-4 Z"
            fill="#f97316"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            style={{ transformOrigin: "1px -4px" }}
          />
          {/* Tiny Glow */}
          <motion.circle
            cx="1" cy="-4" r="5" fill="#f97316" opacity="0.3" filter="blur(2px)"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        </g>
      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    ctx.translate(11, 10);
    ctx.scale(0.8, 0.8);

    const ox = 0;
    const oy = 0;

    // Ears
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath(); ctx.moveTo(ox + 20, oy + 35); ctx.lineTo(ox + 50, oy + 35); ctx.lineTo(ox + 25, oy + 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox + 50, oy + 35); ctx.lineTo(ox + 80, oy + 35); ctx.lineTo(ox + 75, oy + 18); ctx.fill();

    // Feet
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.ellipse(ox + 32, oy + 86, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ox + 68, oy + 86, 6, 4, 0, 0, Math.PI * 2); ctx.fill();

    // Body
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    else ctx.rect(ox + 15, oy + 22, 70, 65);
    ctx.fill();

    // Belly
    ctx.fillStyle = "#c7d2fe";
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 62, 22, 18, 0, 0, Math.PI * 2); ctx.fill();

    // Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.arc(ox + 39, oy + 42, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 61, oy + 42, 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 41, oy + 40, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 40, 2, 0, Math.PI * 2); ctx.fill();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.moveTo(ox + 47, oy + 49); ctx.lineTo(ox + 53, oy + 49); ctx.lineTo(ox + 50, oy + 54); ctx.fill();

    // Wings
    ctx.strokeStyle = "#4f46e5"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+55); ctx.quadraticCurveTo(ox+5, oy+65, ox+10, oy+75); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+55); ctx.quadraticCurveTo(ox+95, oy+50, ox+80, oy+65); ctx.stroke();

    // Matchstick
    ctx.save();
    ctx.translate(ox+75, oy+55); ctx.rotate(15 * Math.PI / 180);
    
    // Body
    ctx.fillStyle = "#d97706";
    ctx.fillRect(0, 0, 2, 15);
    
    // Head
    ctx.fillStyle = "#b91c1c";
    ctx.beginPath(); ctx.ellipse(1, 0, 2.5, 3, 0, 0, Math.PI * 2); ctx.fill();
    
    // Tiny Flame Glow
    ctx.fillStyle = "#f97316"; ctx.globalAlpha = 0.3; ctx.shadowColor = "#f97316"; ctx.shadowBlur = 4;
    ctx.beginPath(); ctx.arc(1, -4, 5, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1.0; ctx.shadowBlur = 0;
    
    // Tiny Flame
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.moveTo(1, -4); ctx.quadraticCurveTo(3, -8, 5, -4); ctx.quadraticCurveTo(3, -2, 1, -4); ctx.fill();
    
    ctx.restore();

    ctx.restore();
  },
};