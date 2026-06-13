import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day0Milestone: StreakMilestone = {
  id: "day0",
  isMatch: (s) => s === 0,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="0 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] grayscale"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.8 }}
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ x: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* Sad Rain Cloud */}
        <motion.g
          animate={{ x: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <path d="M40,15 A10,10 0 0,1 60,15 A15,15 0 0,1 70,25 A10,10 0 0,1 60,35 L40,35 A12,12 0 0,1 40,15 Z" fill="#64748b" opacity="0.8" />
          {/* Raindrops */}
          <motion.line x1="45" y1="35" x2="40" y2="45" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" animate={{ y: [0, 10], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1 }} />
          <motion.line x1="55" y1="38" x2="50" y2="48" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" animate={{ y: [0, 10], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.3 }} />
          <motion.line x1="65" y1="36" x2="60" y2="46" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" animate={{ y: [0, 10], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.6 }} />
        </motion.g>

        {/* Drooping Ears */}
        <polygon points="20,40 45,35 15,25" fill="#4f46e5" />
        <polygon points="55,35 80,40 85,25" fill="#4f46e5" />
        
        {/* Feet */}
        <ellipse cx="32" cy="86" rx="6" ry="4" fill="#f97316" />
        <ellipse cx="68" cy="86" rx="6" ry="4" fill="#f97316" />
        
        {/* Body */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#4f46e5" />
        
        {/* Belly */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#c7d2fe" />
        
        {/* Sad Eyes */}
        <circle cx="37" cy="45" r="10" fill="#ffffff" />
        <circle cx="63" cy="45" r="10" fill="#ffffff" />
        <circle cx="37" cy="47" r="4" fill="#1e1b4b" />
        <circle cx="63" cy="47" r="4" fill="#1e1b4b" />
        
        {/* Sad Eyelids (Slanting outward) */}
        <path d="M25,35 L49,43 L49,30 Z" fill="#4f46e5" />
        <path d="M51,43 L75,35 L75,30 Z" fill="#4f46e5" />
        
        {/* Tear Drop */}
        <motion.path
          d="M37,55 Q40,60 37,63 Q34,60 37,55"
          fill="#38bdf8"
          animate={{ y: [0, 15], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeIn" }}
        />
        
        {/* Beak */}
        <polygon points="47,53 53,53 50,56" fill="#f97316" />
        
        {/* Drooping Wings */}
        <path d="M15,55 Q5,70 15,80" fill="none" stroke="#4f46e5" strokeWidth="9" strokeLinecap="round" />
        <path d="M85,55 Q95,70 85,80" fill="none" stroke="#4f46e5" strokeWidth="9" strokeLinecap="round" />
        
        {/* Pile of Ashes */}
        <ellipse cx="50" cy="85" rx="12" ry="4" fill="#475569" />
        <ellipse cx="48" cy="82" rx="6" ry="3" fill="#64748b" />
        <motion.circle cx="50" cy="80" r="1.5" fill="#fca5a5" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
        
        {/* Oops Text */}
        <text x="50" y="5" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="middle" letterSpacing="1px">OOPS!</text>
      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    // Apply global grayscale filter for the canvas
    ctx.filter = "grayscale(100%) opacity(80%)";

    ctx.translate(11, 10);
    ctx.scale(0.8, 0.8);

    const ox = 0;
    const oy = 0;

    // Cloud
    ctx.fillStyle = "#64748b"; ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(ox+40, oy+15);
    ctx.arc(ox+50, oy+15, 10, Math.PI, 0);
    ctx.arc(ox+60, oy+25, 15, -Math.PI/2, Math.PI/2);
    ctx.arc(ox+60, oy+35, 10, 0, Math.PI/2);
    ctx.lineTo(ox+40, oy+35);
    ctx.arc(ox+40, oy+25, 12, Math.PI/2, Math.PI*1.5);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Raindrops (Static representation)
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+45, oy+35); ctx.lineTo(ox+42, oy+40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+55, oy+38); ctx.lineTo(ox+52, oy+43); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+65, oy+36); ctx.lineTo(ox+62, oy+41); ctx.stroke();

    // Ears
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath(); ctx.moveTo(ox+20, oy+40); ctx.lineTo(ox+45, oy+35); ctx.lineTo(ox+15, oy+25); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+55, oy+35); ctx.lineTo(ox+80, oy+40); ctx.lineTo(ox+85, oy+25); ctx.fill();

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

    // Sad Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 45, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 45, 10, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 47, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 47, 4, 0, Math.PI * 2); ctx.fill();

    // Sad Eyelids
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath(); ctx.moveTo(ox+25, oy+35); ctx.lineTo(ox+49, oy+43); ctx.lineTo(ox+49, oy+30); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+51, oy+43); ctx.lineTo(ox+75, oy+35); ctx.lineTo(ox+75, oy+30); ctx.closePath(); ctx.fill();

    // Tear
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath(); ctx.moveTo(ox+37, oy+57); ctx.quadraticCurveTo(ox+40, oy+62, ox+37, oy+65); ctx.quadraticCurveTo(ox+34, oy+62, ox+37, oy+57); ctx.fill();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.moveTo(ox + 47, oy + 53); ctx.lineTo(ox + 53, oy + 53); ctx.lineTo(ox + 50, oy + 56); ctx.fill();

    // Drooping Wings
    ctx.strokeStyle = "#4f46e5"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+55); ctx.quadraticCurveTo(ox+5, oy+70, ox+15, oy+80); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+55); ctx.quadraticCurveTo(ox+95, oy+70, ox+85, oy+80); ctx.stroke();

    // Ashes
    ctx.fillStyle = "#475569";
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 85, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#64748b";
    ctx.beginPath(); ctx.ellipse(ox + 48, oy + 82, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fca5a5";
    ctx.beginPath(); ctx.arc(ox+50, oy+80, 1.5, 0, Math.PI*2); ctx.fill();

    // Text
    ctx.font = "bold 10px monospace";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "center";
    ctx.fillText("OOPS!", ox + 50, oy + 5);

    ctx.restore();
  },
};