import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day250Milestone: StreakMilestone = {
  id: "day250",
  isMatch: (s) => s >= 250 && s < 300,
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
        animate={{ y: [-2, -4, -2] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      >
        {/* Ambient Green Glow behind */}
        <circle cx="50" cy="50" r="35" fill="#22c55e" opacity="0.1" filter="blur(8px)" />

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

        {/* Mad Scientist Goggles (Strap) */}
        <rect x="15" y="38" width="70" height="8" fill="#1e293b" />

        {/* Eyes outer white */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" />
        <circle cx="63" cy="42" r="12" fill="#ffffff" />

        {/* Goggle Frames & Glowing Lenses */}
        <circle cx="37" cy="42" r="14" fill="none" stroke="#64748b" strokeWidth="3" />
        <circle cx="63" cy="42" r="14" fill="none" stroke="#64748b" strokeWidth="3" />
        <circle cx="37" cy="42" r="12" fill="#22c55e" opacity="0.2" />
        <circle cx="63" cy="42" r="12" fill="#22c55e" opacity="0.2" />
        
        {/* Goggle Bridge */}
        <line x1="51" y1="42" x2="49" y2="42" stroke="#64748b" strokeWidth="4" />

        {/* Focused Pupils (small, intense) */}
        <motion.circle cx="39" cy="42" r="3" fill="#1e1b4b" animate={{ cx: [39, 36, 39] }} transition={{ repeat: Infinity, duration: 4 }} />
        <motion.circle cx="61" cy="42" r="3" fill="#1e1b4b" animate={{ cx: [61, 64, 61] }} transition={{ repeat: Infinity, duration: 4 }} />

        {/* Beak */}
        <polygon points="47,49 53,49 50,55" fill="#f97316" />

        {/* Wings holding the flask carefully */}
        <path d="M15,55 Q25,65 35,62" fill="none" stroke="#4f46e5" strokeWidth="9" strokeLinecap="round" />
        <path d="M85,55 Q75,65 65,62" fill="none" stroke="#4f46e5" strokeWidth="9" strokeLinecap="round" />

        {/* Erlenmeyer Flask */}
        <g transform="translate(50, 68)">
          <motion.path 
            d="M-4,-15 L4,-15 L6,-5 L15,10 A4,4 0 0,1 11,15 L-11,15 A4,4 0 0,1 -15,10 L-6,-5 Z" 
            fill="rgba(255,255,255,0.2)" 
            stroke="#cbd5e1" 
            strokeWidth="1.5" 
            strokeLinejoin="round" 
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          {/* Bubbling Green Liquid */}
          <motion.path 
            d="M-5,-2 L5,-2 L13,10 A2,2 0 0,1 11,13 L-11,13 A2,2 0 0,1 -13,10 Z" 
            fill="#22c55e" 
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          {/* Flask Rim */}
          <rect x="-6" y="-17" width="12" height="3" rx="1" fill="#cbd5e1" />
          
          {/* Bubbles in liquid */}
          <motion.circle cx="-4" cy="8" r="1.5" fill="#bef264" animate={{ y: [0, -8], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} />
          <motion.circle cx="4" cy="10" r="2" fill="#bef264" animate={{ y: [0, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} />
          <motion.circle cx="0" cy="5" r="1" fill="#bef264" animate={{ y: [0, -5], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.7 }} />
        </g>

        {/* Toxic / Magical Smoke rising from flask */}
        <motion.path
          d="M48,45 Q40,35 45,25"
          fill="none"
          stroke="#4ade80"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
          filter="blur(1px)"
          animate={{ d: ["M48,45 Q40,35 45,25", "M48,45 Q55,35 45,25", "M48,45 Q40,35 45,25"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
        <motion.path
          d="M52,48 Q60,35 55,20"
          fill="none"
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
          filter="blur(2px)"
          animate={{ d: ["M52,48 Q60,35 55,20", "M52,48 Q45,35 55,20", "M52,48 Q60,35 55,20"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
        />
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

    // Ambient Glow
    ctx.fillStyle = "#22c55e";
    ctx.globalAlpha = 0.1;
    ctx.shadowColor = "#22c55e";
    ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.arc(ox + 50, oy + 50, 35, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;

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

    // Goggles Strap
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(ox + 15, oy + 38, 70, 8);

    // Eyes outer white
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2); ctx.fill();

    // Goggle Frames & Tint
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 14, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 14, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "#22c55e"; ctx.globalAlpha = 0.2;
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Goggle Bridge
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(ox + 49, oy + 42); ctx.lineTo(ox + 51, oy + 42); ctx.stroke();

    // Pupils (Focused, looking inward at flask)
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.arc(ox + 39, oy + 42, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 61, oy + 42, 3, 0, Math.PI * 2); ctx.fill();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.moveTo(ox + 47, oy + 49); ctx.lineTo(ox + 53, oy + 49); ctx.lineTo(ox + 50, oy + 55); ctx.fill();

    // Wings
    ctx.strokeStyle = "#4f46e5"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox + 15, oy + 55); ctx.quadraticCurveTo(ox + 25, oy + 65, ox + 35, oy + 62); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox + 85, oy + 55); ctx.quadraticCurveTo(ox + 75, oy + 65, ox + 65, oy + 62); ctx.stroke();

    // Flask
    ctx.save();
    ctx.translate(ox + 50, oy + 68);
    
    // Liquid
    ctx.fillStyle = "#22c55e";
    ctx.beginPath(); ctx.moveTo(-5, -2); ctx.lineTo(5, -2); ctx.lineTo(13, 10); ctx.arc(0, 13, 11, Math.PI*0.1, Math.PI*0.9); ctx.lineTo(-13, 10); ctx.closePath(); ctx.fill();
    
    // Glass
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 1.5; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(-4, -15); ctx.lineTo(4, -15); ctx.lineTo(6, -5); ctx.lineTo(15, 10); ctx.arc(0, 15, 11, 0, Math.PI, false); ctx.lineTo(-15, 10); ctx.lineTo(-6, -5); ctx.closePath(); ctx.fill(); ctx.stroke();
    
    // Rim
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(-6, -17, 12, 3, 1);
    else ctx.rect(-6, -17, 12, 3);
    ctx.fill();

    // Bubbles
    ctx.fillStyle = "#bef264";
    ctx.beginPath(); ctx.arc(-4, 4, 1.5, 0, Math.PI * 2); ctx.arc(4, 6, 2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // Smoke
    ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(ox + 48, oy + 45); ctx.quadraticCurveTo(ox + 40, oy + 35, ox + 45, oy + 25); ctx.stroke();
    
    ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 3; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(ox + 52, oy + 48); ctx.quadraticCurveTo(ox + 60, oy + 35, ox + 55, oy + 20); ctx.stroke();
    
    ctx.globalAlpha = 1.0;
    ctx.restore();
  },
};
