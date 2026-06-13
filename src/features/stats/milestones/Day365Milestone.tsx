import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day365Milestone: StreakMilestone = {
  id: "day365",
  isMatch: (s) => s >= 365 && s < 500,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="-5 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [-4, 2, -4] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* Legendary Sun Halo */}
        <motion.circle cx="50" cy="50" r="45" fill="#fef08a" opacity="0.15" filter="blur(8px)" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4 }} />
        <motion.circle cx="50" cy="50" r="40" fill="none" stroke="#fcd34d" strokeWidth="1" strokeDasharray="2 4" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />
        
        {/* Giant Phoenix Wings (Back) */}
        <motion.path
          d="M25,50 Q-10,30 5,0 Q15,20 25,35 Z" fill="#ef4444" opacity="0.8"
          animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ transformOrigin: "25px 50px" }}
        />
        <motion.path
          d="M75,50 Q110,30 95,0 Q85,20 75,35 Z" fill="#ef4444" opacity="0.8"
          animate={{ rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }} style={{ transformOrigin: "75px 50px" }}
        />

        {/* Phoenix Wings (Mid) */}
        <motion.path
          d="M20,55 Q-5,40 10,15 Q20,30 25,45 Z" fill="#f97316" opacity="0.9"
          animate={{ rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} style={{ transformOrigin: "20px 55px" }}
        />
        <motion.path
          d="M80,55 Q105,40 90,15 Q80,30 75,45 Z" fill="#f97316" opacity="0.9"
          animate={{ rotate: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.1 }} style={{ transformOrigin: "80px 55px" }}
        />

        {/* Phoenix Wings (Front) */}
        <motion.path
          d="M15,60 Q0,50 15,30 Q25,45 25,55 Z" fill="#fbbf24"
          animate={{ rotate: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} style={{ transformOrigin: "15px 60px" }}
        />
        <motion.path
          d="M85,60 Q100,50 85,30 Q75,45 75,55 Z" fill="#fbbf24"
          animate={{ rotate: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.3 }} style={{ transformOrigin: "85px 60px" }}
        />

        {/* Ears (Fiery) */}
        <polygon points="20,35 50,35 25,18" fill="#f97316" />
        <polygon points="50,35 80,35 75,18" fill="#f97316" />
        <polygon points="25,35 45,35 28,22" fill="#fbbf24" />
        <polygon points="55,35 75,35 72,22" fill="#fbbf24" />

        {/* Body (Golden/Orange gradient look via solid colors) */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#f97316" />
        <path d="M15,50 Q50,90 85,50 L85,87 A30,30 0 0,1 15,87 Z" fill="#ef4444" />

        {/* Belly */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#fef08a" />

        {/* Eyes outer white (Glowing) */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" filter="drop-shadow(0 0 4px rgba(255,255,255,0.8))" />
        <circle cx="63" cy="42" r="12" fill="#ffffff" filter="drop-shadow(0 0 4px rgba(255,255,255,0.8))" />

        {/* Pupils (Fierce slits) */}
        <ellipse cx="37" cy="42" rx="3" ry="8" fill="#7f1d1d" />
        <ellipse cx="63" cy="42" rx="3" ry="8" fill="#7f1d1d" />

        {/* Glowing aura in eyes */}
        <circle cx="37" cy="42" r="2" fill="#fbbf24" />
        <circle cx="63" cy="42" r="2" fill="#fbbf24" />

        {/* Majestic Crown/Crest on forehead */}
        <path d="M50,15 L45,5 L50,0 L55,5 Z" fill="#fbbf24" />
        <path d="M40,20 L35,10 L45,15 Z" fill="#fbbf24" />
        <path d="M60,20 L65,10 L55,15 Z" fill="#fbbf24" />

        {/* Beak */}
        <polygon points="47,49 53,49 50,55" fill="#fef08a" />

        {/* Front Wings (Embracing the core) */}
        <path d="M15,55 Q30,65 40,60" fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
        <path d="M85,55 Q70,65 60,60" fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />

        {/* Pure Energy Core in Hands */}
        <motion.circle
          cx="50" cy="58" r="8" fill="#ffffff" filter="blur(2px)"
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <circle cx="50" cy="58" r="4" fill="#fbbf24" />

        {/* Floating Embers */}
        <motion.circle cx="30" cy="20" r="1.5" fill="#fbbf24" animate={{ y: [0, -15], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
        <motion.circle cx="70" cy="25" r="2" fill="#f97316" animate={{ y: [0, -20], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} />
        <motion.circle cx="20" cy="70" r="1" fill="#fef08a" animate={{ y: [0, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 1 }} />
        <motion.circle cx="80" cy="70" r="1.5" fill="#ef4444" animate={{ y: [0, -15], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.8 }} />

        {/* Feet (Glowing Talons) */}
        <path d="M30,86 L34,95 L32,86 Z" fill="#fbbf24" />
        <path d="M28,86 L30,93 L30,86 Z" fill="#fbbf24" />
        <path d="M34,86 L38,93 L34,86 Z" fill="#fbbf24" />

        <path d="M70,86 L66,95 L68,86 Z" fill="#fbbf24" />
        <path d="M72,86 L70,93 L70,86 Z" fill="#fbbf24" />
        <path d="M66,86 L62,93 L66,86 Z" fill="#fbbf24" />

      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    ctx.translate(18.75, 10);
    ctx.scale(0.8, 0.8);

    const ox = 0;
    const oy = 0;

    // Legendary Sun Halo
    ctx.fillStyle = "#fef08a"; ctx.globalAlpha = 0.15; ctx.shadowColor = "#fef08a"; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.arc(ox+50, oy+50, 45, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1.0;
    
    ctx.strokeStyle = "#fcd34d"; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.arc(ox+50, oy+50, 40, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);

    // Giant Phoenix Wings
    ctx.fillStyle = "#ef4444"; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(ox+25, oy+50); ctx.quadraticCurveTo(ox-10, oy+30, ox+5, oy+0); ctx.quadraticCurveTo(ox+15, oy+20, ox+25, oy+35); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+75, oy+50); ctx.quadraticCurveTo(ox+110, oy+30, ox+95, oy+0); ctx.quadraticCurveTo(ox+85, oy+20, ox+75, oy+35); ctx.closePath(); ctx.fill();

    ctx.fillStyle = "#f97316"; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.moveTo(ox+20, oy+55); ctx.quadraticCurveTo(ox-5, oy+40, ox+10, oy+15); ctx.quadraticCurveTo(ox+20, oy+30, ox+25, oy+45); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+80, oy+55); ctx.quadraticCurveTo(ox+105, oy+40, ox+90, oy+15); ctx.quadraticCurveTo(ox+80, oy+30, ox+75, oy+45); ctx.closePath(); ctx.fill();

    ctx.fillStyle = "#fbbf24"; ctx.globalAlpha = 1.0;
    ctx.beginPath(); ctx.moveTo(ox+15, oy+60); ctx.quadraticCurveTo(ox+0, oy+50, ox+15, oy+30); ctx.quadraticCurveTo(ox+25, oy+45, ox+25, oy+55); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+60); ctx.quadraticCurveTo(ox+100, oy+50, ox+85, oy+30); ctx.quadraticCurveTo(ox+75, oy+45, ox+75, oy+55); ctx.closePath(); ctx.fill();

    // Ears (Fiery)
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.moveTo(ox + 20, oy + 35); ctx.lineTo(ox + 50, oy + 35); ctx.lineTo(ox + 25, oy + 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox + 50, oy + 35); ctx.lineTo(ox + 80, oy + 35); ctx.lineTo(ox + 75, oy + 18); ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.moveTo(ox + 25, oy + 35); ctx.lineTo(ox + 45, oy + 35); ctx.lineTo(ox + 28, oy + 22); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox + 55, oy + 35); ctx.lineTo(ox + 75, oy + 35); ctx.lineTo(ox + 72, oy + 22); ctx.fill();

    // Body (Golden/Orange gradient look via solid colors)
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    else ctx.rect(ox + 15, oy + 22, 70, 65);
    ctx.fill();

    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+50); ctx.quadraticCurveTo(ox+50, oy+90, ox+85, oy+50); ctx.lineTo(ox+85, oy+87); ctx.arcTo(ox+85, oy+87, ox+50, oy+87, 30); ctx.lineTo(ox+15, oy+87); ctx.closePath(); ctx.fill();

    // Belly
    ctx.fillStyle = "#fef08a";
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 62, 22, 18, 0, 0, Math.PI * 2); ctx.fill();

    // Eyes outer
    ctx.fillStyle = "#ffffff"; ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 4;
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Pupils (Slits)
    ctx.fillStyle = "#7f1d1d";
    ctx.beginPath(); ctx.ellipse(ox + 37, oy + 42, 3, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ox + 63, oy + 42, 3, 8, 0, 0, Math.PI * 2); ctx.fill();

    // Eye glow
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 2, 0, Math.PI * 2); ctx.fill();

    // Crest
    ctx.beginPath(); ctx.moveTo(ox+50, oy+15); ctx.lineTo(ox+45, oy+5); ctx.lineTo(ox+50, oy+0); ctx.lineTo(ox+55, oy+5); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+40, oy+20); ctx.lineTo(ox+35, oy+10); ctx.lineTo(ox+45, oy+15); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+60, oy+20); ctx.lineTo(ox+65, oy+10); ctx.lineTo(ox+55, oy+15); ctx.fill();

    // Beak
    ctx.fillStyle = "#fef08a";
    ctx.beginPath(); ctx.moveTo(ox + 47, oy + 49); ctx.lineTo(ox + 53, oy + 49); ctx.lineTo(ox + 50, oy + 55); ctx.fill();

    // Front Wings
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+55); ctx.quadraticCurveTo(ox+30, oy+65, ox+40, oy+60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+55); ctx.quadraticCurveTo(ox+70, oy+65, ox+60, oy+60); ctx.stroke();

    // Energy Core
    ctx.fillStyle = "#ffffff"; ctx.globalAlpha = 0.9; ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(ox+50, oy+58, 8, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1.0;
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.arc(ox+50, oy+58, 4, 0, Math.PI*2); ctx.fill();

    // Feet (Talons)
    ctx.beginPath(); ctx.moveTo(ox+30,oy+86); ctx.lineTo(ox+34,oy+95); ctx.lineTo(ox+32,oy+86); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+28,oy+86); ctx.lineTo(ox+30,oy+93); ctx.lineTo(ox+30,oy+86); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+34,oy+86); ctx.lineTo(ox+38,oy+93); ctx.lineTo(ox+34,oy+86); ctx.fill();

    ctx.beginPath(); ctx.moveTo(ox+70,oy+86); ctx.lineTo(ox+66,oy+95); ctx.lineTo(ox+68,oy+86); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+72,oy+86); ctx.lineTo(ox+70,oy+93); ctx.lineTo(ox+70,oy+86); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+66,oy+86); ctx.lineTo(ox+62,oy+93); ctx.lineTo(ox+66,oy+86); ctx.fill();

    ctx.restore();
  },
};