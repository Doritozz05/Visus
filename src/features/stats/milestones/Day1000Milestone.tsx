import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day1000Milestone: StreakMilestone = {
  id: "day1000",
  isMatch: (s) => s >= 1000 && s < 1500,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="0 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(255,255,255,0.2)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Nebula Swirl */}
      <motion.ellipse
        cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#d8b4fe" strokeWidth="2" opacity="0.3" filter="blur(2px)"
        animate={{ rotate: 360, rx: [40, 45, 40] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} style={{ transformOrigin: "50px 50px" }}
      />

      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        {/* Cosmic Wings (Made of stardust) */}
        <motion.path
          d="M15,50 Q-10,30 5,0 Q20,30 25,45 Z" fill="#6b21a8" opacity="0.8"
          animate={{ rotate: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} style={{ transformOrigin: "25px 45px" }}
        />
        <motion.path
          d="M85,50 Q110,30 95,0 Q80,30 75,45 Z" fill="#6b21a8" opacity="0.8"
          animate={{ rotate: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.2 }} style={{ transformOrigin: "75px 45px" }}
        />

        {/* Ears */}
        <polygon points="20,35 50,35 25,18" fill="#1e1b4b" />
        <polygon points="50,35 80,35 75,18" fill="#1e1b4b" />

        {/* Floating Feet (Stars) */}
        <circle cx="32" cy="86" r="4" fill="#ffffff" filter="blur(1px)" />
        <circle cx="68" cy="86" r="4" fill="#ffffff" filter="blur(1px)" />
        <motion.circle cx="32" cy="86" r="6" fill="#d8b4fe" opacity="0.5" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
        <motion.circle cx="68" cy="86" r="6" fill="#d8b4fe" opacity="0.5" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} />

        {/* Body (Void / Space) */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#0f172a" />
        
        {/* Starfield inside the body */}
        <g opacity="0.8">
          <circle cx="30" cy="35" r="1" fill="#ffffff" />
          <circle cx="70" cy="40" r="1.5" fill="#fef08a" />
          <circle cx="45" cy="75" r="1" fill="#c0caf5" />
          <circle cx="65" cy="65" r="1" fill="#ffffff" />
          <circle cx="25" cy="60" r="1.5" fill="#e879f9" />
          <circle cx="50" cy="28" r="1" fill="#ffffff" />
        </g>

        {/* Belly (Black Hole Event Horizon) */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#020617" stroke="#8b5cf6" strokeWidth="2" />
        <motion.circle cx="50" cy="62" r="12" fill="#000000" stroke="#d8b4fe" strokeWidth="1" animate={{ r: [10, 12, 10] }} transition={{ repeat: Infinity, duration: 3 }} />
        {/* Accretion disk */}
        <motion.ellipse cx="50" cy="62" rx="28" ry="6" fill="none" stroke="#e879f9" strokeWidth="1" opacity="0.6" animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} style={{ transformOrigin: "50px 62px" }} />

        {/* Eyes (Pure Glowing White, no pupils) */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" filter="blur(2px)" />
        <circle cx="63" cy="42" r="12" fill="#ffffff" filter="blur(2px)" />
        <circle cx="37" cy="42" r="10" fill="#ffffff" />
        <circle cx="63" cy="42" r="10" fill="#ffffff" />

        {/* Energy Tears/Trails streaming up from eyes */}
        <motion.path d="M37,42 Q30,20 37,0" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" filter="blur(1px)" animate={{ opacity: [0.3, 0.8, 0.3], strokeWidth: [1, 3, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
        <motion.path d="M63,42 Q70,20 63,0" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" filter="blur(1px)" animate={{ opacity: [0.3, 0.8, 0.3], strokeWidth: [1, 3, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} />

        {/* Beak (Made of hard light) */}
        <polygon points="47,49 53,49 50,55" fill="#fef08a" />

        {/* Front Wings (Nebula arms embracing the cosmos) */}
        <path d="M15,55 Q35,70 50,85" fill="none" stroke="#d8b4fe" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        <path d="M85,55 Q65,70 50,85" fill="none" stroke="#d8b4fe" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        
        {/* Magic star at hands */}
        <motion.circle cx="50" cy="85" r="4" fill="#ffffff" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} />
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

    // Nebula Swirl
    ctx.strokeStyle = "#d8b4fe"; ctx.lineWidth = 2; ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.ellipse(ox+50, oy+50, 40, 15, Math.PI/4, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Cosmic Wings
    ctx.fillStyle = "#6b21a8"; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(ox+15, oy+50); ctx.quadraticCurveTo(ox-10, oy+30, ox+5, oy+0); ctx.quadraticCurveTo(ox+20, oy+30, ox+25, oy+45); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+50); ctx.quadraticCurveTo(ox+110, oy+30, ox+95, oy+0); ctx.quadraticCurveTo(ox+80, oy+30, ox+75, oy+45); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Ears
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.moveTo(ox + 20, oy + 35); ctx.lineTo(ox + 50, oy + 35); ctx.lineTo(ox + 25, oy + 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox + 50, oy + 35); ctx.lineTo(ox + 80, oy + 35); ctx.lineTo(ox + 75, oy + 18); ctx.fill();

    // Floating Feet
    ctx.fillStyle = "#d8b4fe"; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(ox+32, oy+86, 6, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+68, oy+86, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.globalAlpha = 1.0;
    ctx.beginPath(); ctx.arc(ox+32, oy+86, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+68, oy+86, 4, 0, Math.PI*2); ctx.fill();

    // Body (Void)
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    else ctx.rect(ox + 15, oy + 22, 70, 65);
    ctx.fill();

    // Starfield
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox+30, oy+35, 1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#fef08a"; ctx.beginPath(); ctx.arc(ox+70, oy+40, 1.5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#c0caf5"; ctx.beginPath(); ctx.arc(ox+45, oy+75, 1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(ox+65, oy+65, 1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#e879f9"; ctx.beginPath(); ctx.arc(ox+25, oy+60, 1.5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(ox+50, oy+28, 1, 0, Math.PI*2); ctx.fill();

    // Belly (Event Horizon)
    ctx.fillStyle = "#020617"; ctx.strokeStyle = "#8b5cf6"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 62, 22, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#000000"; ctx.strokeStyle = "#d8b4fe"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(ox+50, oy+62, 11, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    
    // Accretion disk
    ctx.strokeStyle = "#e879f9"; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.ellipse(ox+50, oy+62, 28, 6, Math.PI/8, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Eyes (Pure light)
    ctx.fillStyle = "#ffffff"; ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 10, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Energy Trails
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.globalAlpha = 0.6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+37, oy+42); ctx.quadraticCurveTo(ox+30, oy+20, ox+37, oy+0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+63, oy+42); ctx.quadraticCurveTo(ox+70, oy+20, ox+63, oy+0); ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Beak
    ctx.fillStyle = "#fef08a";
    ctx.beginPath(); ctx.moveTo(ox + 47, oy + 49); ctx.lineTo(ox + 53, oy + 49); ctx.lineTo(ox + 50, oy + 55); ctx.fill();

    // Front Wings (Nebula arms)
    ctx.strokeStyle = "#d8b4fe"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(ox+15, oy+55); ctx.quadraticCurveTo(ox+35, oy+70, ox+50, oy+85); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+55); ctx.quadraticCurveTo(ox+65, oy+70, ox+50, oy+85); ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Magic star at hands
    ctx.fillStyle = "#ffffff"; ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(ox+50, oy+85, 4, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  },
};