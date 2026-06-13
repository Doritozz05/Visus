import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day9999Milestone: StreakMilestone = {
  id: "day9999",
  isMatch: (s) => s >= 9999,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="-5 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_24px_rgba(255,255,255,0.8)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        {/* The Omega Halos */}
        <motion.circle cx="50" cy="50" r="48" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.6, 0.2] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} />
        <motion.circle cx="50" cy="50" r="42" fill="none" stroke="#f8fafc" strokeWidth="1" strokeDasharray="1 4" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />
        <motion.circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="10 20" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />

        {/* Pure Energy Wings (6 massive beams of light) */}
        {/* Top pair */}
        <motion.path d="M50,40 L-10,0 L0,20 Z" fill="#ffffff" opacity="0.6" animate={{ rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ transformOrigin: "50px 40px" }} />
        <motion.path d="M50,40 L110,0 L100,20 Z" fill="#ffffff" opacity="0.6" animate={{ rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0.2 }} style={{ transformOrigin: "50px 40px" }} />
        {/* Mid pair */}
        <motion.path d="M50,50 L-20,40 L-10,55 Z" fill="#ffffff" opacity="0.8" animate={{ rotate: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} style={{ transformOrigin: "50px 50px" }} />
        <motion.path d="M50,50 L120,40 L110,55 Z" fill="#ffffff" opacity="0.8" animate={{ rotate: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.1 }} style={{ transformOrigin: "50px 50px" }} />
        {/* Bottom pair */}
        <motion.path d="M50,60 L-10,90 L5,100 Z" fill="#ffffff" opacity="0.5" animate={{ rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} style={{ transformOrigin: "50px 60px" }} />
        <motion.path d="M50,60 L110,90 L95,100 Z" fill="#ffffff" opacity="0.5" animate={{ rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 0.3 }} style={{ transformOrigin: "50px 60px" }} />

        {/* Ears (Glowing diamonds) */}
        <polygon points="25,35 50,35 37.5,15" fill="#f8fafc" />
        <polygon points="50,35 75,35 62.5,15" fill="#f8fafc" />

        {/* Feet (Orbits) */}
        <motion.ellipse cx="32" cy="86" rx="8" ry="2" fill="none" stroke="#ffffff" strokeWidth="1" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ transformOrigin: "32px 86px" }} />
        <motion.ellipse cx="68" cy="86" rx="8" ry="2" fill="none" stroke="#ffffff" strokeWidth="1" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ transformOrigin: "68px 86px" }} />
        <circle cx="32" cy="86" r="2" fill="#ffffff" />
        <circle cx="68" cy="86" r="2" fill="#ffffff" />

        {/* Body (Pure white, core radiating out) */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#ffffff" />
        
        {/* Inner Core (The Soul) */}
        <motion.ellipse cx="50" cy="54" rx="22" ry="28" fill="#e2e8f0" opacity="0.8" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
        <motion.ellipse cx="50" cy="54" rx="12" ry="18" fill="#94a3b8" opacity="0.5" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />

        {/* Eyes (Just pure light beams escaping) */}
        <path d="M25,42 L49,42 L37,45 Z" fill="#0f172a" />
        <path d="M51,42 L75,42 L63,45 Z" fill="#0f172a" />
        
        {/* Beak (Floating triangle) */}
        <polygon points="50,47 54,52 50,57 46,52" fill="#0f172a" />

        {/* Ascended Crown */}
        <motion.polygon points="50,5 55,-5 50,-15 45,-5" fill="#ffffff" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
        <motion.polygon points="40,10 42,2 40,-5 38,2" fill="#ffffff" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.2 }} />
        <motion.polygon points="60,10 62,2 60,-5 58,2" fill="#ffffff" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.4 }} />

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

    // Omega Halos
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(ox+50, oy+50, 48, 0, Math.PI*2); ctx.stroke();
    
    ctx.strokeStyle = "#f8fafc"; ctx.lineWidth = 1; ctx.setLineDash([1, 4]); ctx.globalAlpha = 1.0;
    ctx.beginPath(); ctx.arc(ox+50, oy+50, 42, 0, Math.PI*2); ctx.stroke();
    
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.setLineDash([10, 20]);
    ctx.beginPath(); ctx.arc(ox+50, oy+50, 38, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);

    // Pure Energy Wings
    ctx.fillStyle = "#ffffff"; 
    // Top
    ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(ox+50, oy+40); ctx.lineTo(ox-10, oy+0); ctx.lineTo(ox+0, oy+20); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+50, oy+40); ctx.lineTo(ox+110, oy+0); ctx.lineTo(ox+100, oy+20); ctx.closePath(); ctx.fill();
    // Mid
    ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(ox+50, oy+50); ctx.lineTo(ox-20, oy+40); ctx.lineTo(ox-10, oy+55); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+50, oy+50); ctx.lineTo(ox+120, oy+40); ctx.lineTo(ox+110, oy+55); ctx.closePath(); ctx.fill();
    // Bottom
    ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(ox+50, oy+60); ctx.lineTo(ox-10, oy+90); ctx.lineTo(ox+5, oy+100); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+50, oy+60); ctx.lineTo(ox+110, oy+90); ctx.lineTo(ox+95, oy+100); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Ears
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath(); ctx.moveTo(ox+25, oy+35); ctx.lineTo(ox+50, oy+35); ctx.lineTo(ox+37.5, oy+15); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+50, oy+35); ctx.lineTo(ox+75, oy+35); ctx.lineTo(ox+62.5, oy+15); ctx.closePath(); ctx.fill();

    // Orbital Feet
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(ox+32, oy+86, 8, 2, Math.PI/4, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(ox+68, oy+86, 8, 2, -Math.PI/4, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox+32, oy+86, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+68, oy+86, 2, 0, Math.PI*2); ctx.fill();

    // Body Base
    ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 15;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox+15, oy+22, 70, 65, 30);
    else ctx.rect(ox+15, oy+22, 70, 65);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner Core
    ctx.fillStyle = "#e2e8f0"; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.ellipse(ox+50, oy+54, 22, 28, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#94a3b8"; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.ellipse(ox+50, oy+54, 12, 18, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Eyes
    ctx.fillStyle = "#0f172a";
    ctx.beginPath(); ctx.moveTo(ox+25, oy+42); ctx.lineTo(ox+49, oy+42); ctx.lineTo(ox+37, oy+45); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+51, oy+42); ctx.lineTo(ox+75, oy+42); ctx.lineTo(ox+63, oy+45); ctx.closePath(); ctx.fill();

    // Beak
    ctx.beginPath(); ctx.moveTo(ox+50, oy+47); ctx.lineTo(ox+54, oy+52); ctx.lineTo(ox+50, oy+57); ctx.lineTo(ox+46, oy+52); ctx.closePath(); ctx.fill();

    // Ascended Crown
    ctx.fillStyle = "#ffffff"; ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(ox+50, oy+5); ctx.lineTo(ox+55, oy-5); ctx.lineTo(ox+50, oy-15); ctx.lineTo(ox+45, oy-5); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+40, oy+10); ctx.lineTo(ox+42, oy+2); ctx.lineTo(ox+40, oy-5); ctx.lineTo(ox+38, oy+2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+60, oy+10); ctx.lineTo(ox+62, oy+2); ctx.lineTo(ox+60, oy-5); ctx.lineTo(ox+58, oy+2); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  },
};