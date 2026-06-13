import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day100Milestone: StreakMilestone = {
  id: "day100",
  isMatch: (s) => s >= 100 && s < 150,
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
        animate={{ y: [-2, -5, -2] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        {/* Majestic Aura */}
        <motion.circle
          cx="50" cy="50" r="40"
          fill="#fef08a" opacity="0.1" filter="blur(6px)"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />

        {/* Royal Cape (Back) */}
        <path d="M20,40 L10,85 Q50,95 90,85 L80,40 Z" fill="#991b1b" />
        
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

        {/* Royal Cape (Front Collar/Fur) */}
        <path d="M15,45 Q50,60 85,45 Q80,35 50,45 Q20,35 15,45" fill="#f8fafc" />
        <circle cx="50" cy="52" r="4" fill="#fbbf24" /> {/* Gold Brooch */}

        {/* Eyes outer white */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" />
        <circle cx="63" cy="42" r="12" fill="#ffffff" />

        {/* Confident Pupils */}
        <circle cx="37" cy="42" r="5" fill="#1e1b4b" />
        <circle cx="63" cy="42" r="5" fill="#1e1b4b" />
        
        {/* Confident Eyelids (extended upwards to prevent white pixel bleed) */}
        <path d="M22,25 Q37,42 52,25 Z" fill="#4f46e5" />
        <path d="M48,25 Q63,42 78,25 Z" fill="#4f46e5" />

        {/* Highlights */}
        <circle cx="39" cy="40" r="1.5" fill="#ffffff" />
        <circle cx="65" cy="40" r="1.5" fill="#ffffff" />

        {/* Beak */}
        <polygon points="47,49 53,49 50,55" fill="#f97316" />

        {/* Golden Crown */}
        <g transform="translate(25, 0)">
          <path d="M5,20 L0,5 L15,15 L25,0 L35,15 L50,5 L45,20 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" strokeLinejoin="round" />
          {/* Jewels */}
          <circle cx="0" cy="5" r="2" fill="#ef4444" />
          <circle cx="25" cy="0" r="2.5" fill="#3b82f6" />
          <circle cx="50" cy="5" r="2" fill="#ef4444" />
          <circle cx="25" cy="15" r="1.5" fill="#10b981" />
        </g>

        {/* Left Wing (Resting) */}
        <path d="M15,55 Q5,65 10,75" fill="none" stroke="#4f46e5" strokeWidth="9" strokeLinecap="round" />
        
        {/* Right Wing (Holding Scepter) */}
        <path d="M85,55 Q95,50 100,40" fill="none" stroke="#4f46e5" strokeWidth="9" strokeLinecap="round" />

        {/* Royal Scepter */}
        <g transform="translate(96, 15) rotate(15)">
          <rect x="-2" y="10" width="4" height="40" rx="2" fill="#fbbf24" />
          <circle cx="0" cy="10" r="6" fill="#ef4444" stroke="#fbbf24" strokeWidth="2" />
          <polygon points="-6,10 6,10 0,0 Z" fill="#fbbf24" />
          
          {/* Scepter Glow */}
          <motion.circle
            cx="0" cy="5" r="10" fill="#ef4444" opacity="0.3" filter="blur(3px)"
            animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
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

    // Majestic Aura
    ctx.fillStyle = "#fef08a"; ctx.globalAlpha = 0.1; ctx.shadowColor = "#fef08a"; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.arc(ox+50, oy+50, 40, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1.0;

    // Royal Cape (Back)
    ctx.fillStyle = "#991b1b";
    ctx.beginPath(); ctx.moveTo(ox+20, oy+40); ctx.lineTo(ox+10, oy+85); ctx.quadraticCurveTo(ox+50, oy+95, ox+90, oy+85); ctx.lineTo(ox+80, oy+40); ctx.closePath(); ctx.fill();

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

    // Cape Collar
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+45); ctx.quadraticCurveTo(ox+50, oy+60, ox+85, oy+45); ctx.quadraticCurveTo(ox+80, oy+35, ox+50, oy+45); ctx.quadraticCurveTo(ox+20, oy+35, ox+15, oy+45); ctx.fill();
    ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.arc(ox+50, oy+52, 4, 0, Math.PI*2); ctx.fill();

    // Eyes outer
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2); ctx.fill();

    // Confident Eyelids
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath(); ctx.moveTo(ox+22, oy+25); ctx.quadraticCurveTo(ox+37, oy+42, ox+52, oy+25); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+48, oy+25); ctx.quadraticCurveTo(ox+63, oy+42, ox+78, oy+25); ctx.fill();

    // Pupils
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 5, 0, Math.PI * 2); ctx.fill();

    // Highlights
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 39, oy + 40, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 65, oy + 40, 1.5, 0, Math.PI * 2); ctx.fill();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.moveTo(ox + 47, oy + 49); ctx.lineTo(ox + 53, oy + 49); ctx.lineTo(ox + 50, oy + 55); ctx.fill();

    // Crown
    ctx.save(); ctx.translate(ox+25, oy+0);
    ctx.fillStyle = "#fbbf24"; ctx.strokeStyle = "#d97706"; ctx.lineWidth = 1; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(5,20); ctx.lineTo(0,5); ctx.lineTo(15,15); ctx.lineTo(25,0); ctx.lineTo(35,15); ctx.lineTo(50,5); ctx.lineTo(45,20); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(0,5, 2, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(50,5, 2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#3b82f6"; ctx.beginPath(); ctx.arc(25,0, 2.5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#10b981"; ctx.beginPath(); ctx.arc(25,15, 1.5, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    // Wings
    ctx.strokeStyle = "#4f46e5"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+55); ctx.quadraticCurveTo(ox+5, oy+65, ox+10, oy+75); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+55); ctx.quadraticCurveTo(ox+95, oy+50, ox+100, oy+40); ctx.stroke();

    // Scepter
    ctx.save(); ctx.translate(ox+96, oy+15); ctx.rotate(15 * Math.PI / 180);
    ctx.fillStyle = "#fbbf24"; 
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(-2,10, 4, 40, 2); else ctx.rect(-2,10, 4, 40); ctx.fill();
    ctx.fillStyle = "#ef4444"; ctx.strokeStyle = "#fbbf24"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,10, 6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.moveTo(-6,10); ctx.lineTo(6,10); ctx.lineTo(0,0); ctx.closePath(); ctx.fill();
    ctx.restore();

    ctx.restore();
  },
};
