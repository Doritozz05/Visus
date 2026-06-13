import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day730Milestone: StreakMilestone = {
  id: "day730",
  isMatch: (s) => s >= 730 && s < 1000,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="0 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(251,191,36,0.3)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* Seraphim Halos (Intersecting Rings) */}
        <motion.ellipse
          cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#fcd34d" strokeWidth="1.5" opacity="0.6"
          animate={{ rotate: [0, 360], rx: [45, 15, 45], ry: [15, 45, 15] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} style={{ transformOrigin: "50px 50px" }}
        />
        <motion.ellipse
          cx="50" cy="50" rx="15" ry="45" fill="none" stroke="#fcd34d" strokeWidth="1.5" opacity="0.6"
          animate={{ rotate: [0, -360], rx: [15, 45, 15], ry: [45, 15, 45] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} style={{ transformOrigin: "50px 50px" }}
        />

        {/* Six Golden Wings (Seraphim style) */}
        {/* Top Wings */}
        <motion.path d="M40,30 Q10,-10 -5,15 Q20,20 30,40 Z" fill="#fbbf24" opacity="0.9" animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} style={{ transformOrigin: "40px 30px" }} />
        <motion.path d="M60,30 Q90,-10 105,15 Q80,20 70,40 Z" fill="#fbbf24" opacity="0.9" animate={{ rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.2 }} style={{ transformOrigin: "60px 30px" }} />
        {/* Mid Wings */}
        <motion.path d="M25,50 Q-15,40 -5,65 Q15,60 25,60 Z" fill="#f59e0b" opacity="0.95" animate={{ rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ transformOrigin: "25px 50px" }} />
        <motion.path d="M75,50 Q115,40 105,65 Q85,60 75,60 Z" fill="#f59e0b" opacity="0.95" animate={{ rotate: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.1 }} style={{ transformOrigin: "75px 50px" }} />
        {/* Bottom Wings */}
        <motion.path d="M35,70 Q10,95 20,110 Q40,90 45,80 Z" fill="#d97706" opacity="0.9" animate={{ rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} style={{ transformOrigin: "35px 70px" }} />
        <motion.path d="M65,70 Q90,95 80,110 Q60,90 55,80 Z" fill="#d97706" opacity="0.9" animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0.3 }} style={{ transformOrigin: "65px 70px" }} />

        {/* Ears */}
        <polygon points="20,35 50,35 25,18" fill="#fef3c7" />
        <polygon points="50,35 80,35 75,18" fill="#fef3c7" />

        {/* Feet (Hovering glow) */}
        <ellipse cx="32" cy="86" rx="6" ry="4" fill="#fef08a" />
        <ellipse cx="68" cy="86" rx="6" ry="4" fill="#fef08a" />
        <motion.ellipse cx="32" cy="92" rx="10" ry="2" fill="#fef08a" opacity="0.3" filter="blur(2px)" animate={{ scaleX: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
        <motion.ellipse cx="68" cy="92" rx="10" ry="2" fill="#fef08a" opacity="0.3" filter="blur(2px)" animate={{ scaleX: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} />

        {/* Body (Pure Light/Gold) */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#fef3c7" />
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#ffffff" />

        {/* Third Eye (Awakened) */}
        <path d="M45,28 Q50,22 55,28 Q50,34 45,28 Z" fill="#ffffff" stroke="#fbbf24" strokeWidth="1" />
        <circle cx="50" cy="28" r="1.5" fill="#f59e0b" />
        <motion.circle cx="50" cy="28" r="4" fill="#fbbf24" opacity="0.4" filter="blur(1px)" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} />

        {/* Eyes outer white */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" />
        <circle cx="63" cy="42" r="12" fill="#ffffff" />

        {/* Eyelids (Serene, peaceful) */}
        <path d="M22,35 Q37,45 52,35 Z" fill="#fef3c7" />
        <path d="M48,35 Q63,45 78,35 Z" fill="#fef3c7" />

        {/* Glowing Pupils */}
        <circle cx="37" cy="45" r="4" fill="#fbbf24" />
        <circle cx="63" cy="45" r="4" fill="#fbbf24" />
        <circle cx="37" cy="45" r="2" fill="#ffffff" />
        <circle cx="63" cy="45" r="2" fill="#ffffff" />

        {/* Beak */}
        <polygon points="47,49 53,49 50,55" fill="#fcd34d" />

        {/* Hands folded in prayer */}
        <path d="M15,55 Q35,75 48,65" fill="none" stroke="#fef3c7" strokeWidth="9" strokeLinecap="round" />
        <path d="M85,55 Q65,75 52,65" fill="none" stroke="#fef3c7" strokeWidth="9" strokeLinecap="round" />
        
        {/* Spark of creation between hands */}
        <motion.circle cx="50" cy="62" r="3" fill="#ffffff" animate={{ scale: [1, 2, 1], opacity: [0.8, 1, 0.8] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9))" }} />
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

    // Halos
    ctx.strokeStyle = "#fcd34d"; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.ellipse(ox+50, oy+50, 45, 15, 0, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(ox+50, oy+50, 15, 45, 0, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Top Wings
    ctx.fillStyle = "#fbbf24"; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.moveTo(ox+40,oy+30); ctx.quadraticCurveTo(ox+10, oy-10, ox-5, oy+15); ctx.quadraticCurveTo(ox+20, oy+20, ox+30, oy+40); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+60,oy+30); ctx.quadraticCurveTo(ox+90, oy-10, ox+105, oy+15); ctx.quadraticCurveTo(ox+80, oy+20, ox+70, oy+40); ctx.fill();

    // Mid Wings
    ctx.fillStyle = "#f59e0b"; ctx.globalAlpha = 0.95;
    ctx.beginPath(); ctx.moveTo(ox+25,oy+50); ctx.quadraticCurveTo(ox-15, oy+40, ox-5, oy+65); ctx.quadraticCurveTo(ox+15, oy+60, ox+25, oy+60); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+75,oy+50); ctx.quadraticCurveTo(ox+115, oy+40, ox+105, oy+65); ctx.quadraticCurveTo(ox+85, oy+60, ox+75, oy+60); ctx.fill();

    // Bottom Wings
    ctx.fillStyle = "#d97706"; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.moveTo(ox+35,oy+70); ctx.quadraticCurveTo(ox+10, oy+95, ox+20, oy+110); ctx.quadraticCurveTo(ox+40, oy+90, ox+45, oy+80); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+65,oy+70); ctx.quadraticCurveTo(ox+90, oy+95, ox+80, oy+110); ctx.quadraticCurveTo(ox+60, oy+90, ox+55, oy+80); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Ears
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath(); ctx.moveTo(ox + 20, oy + 35); ctx.lineTo(ox + 50, oy + 35); ctx.lineTo(ox + 25, oy + 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox + 50, oy + 35); ctx.lineTo(ox + 80, oy + 35); ctx.lineTo(ox + 75, oy + 18); ctx.fill();

    // Hover Feet
    ctx.fillStyle = "#fef08a";
    ctx.beginPath(); ctx.ellipse(ox + 32, oy + 86, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ox + 68, oy + 86, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
    
    ctx.globalAlpha = 0.3; ctx.shadowColor = "#fef08a"; ctx.shadowBlur = 4;
    ctx.beginPath(); ctx.ellipse(ox + 32, oy + 92, 10, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ox + 68, oy + 92, 10, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1.0; ctx.shadowBlur = 0;

    // Body
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    else ctx.rect(ox + 15, oy + 22, 70, 65);
    ctx.fill();

    // Belly
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 62, 22, 18, 0, 0, Math.PI * 2); ctx.fill();

    // Third Eye
    ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ox+45, oy+28); ctx.quadraticCurveTo(ox+50, oy+22, ox+55, oy+28); ctx.quadraticCurveTo(ox+50, oy+34, ox+45, oy+28); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(ox+50, oy+28, 1.5, 0, Math.PI*2); ctx.fill();

    // Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2); ctx.fill();

    // Serene Eyelids
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath(); ctx.moveTo(ox+22, oy+35); ctx.quadraticCurveTo(ox+37, oy+45, ox+52, oy+35); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+48, oy+35); ctx.quadraticCurveTo(ox+63, oy+45, ox+78, oy+35); ctx.fill();

    // Glowing Pupils
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 45, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 45, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 45, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 45, 2, 0, Math.PI * 2); ctx.fill();

    // Beak
    ctx.fillStyle = "#fcd34d";
    ctx.beginPath(); ctx.moveTo(ox + 47, oy + 49); ctx.lineTo(ox + 53, oy + 49); ctx.lineTo(ox + 50, oy + 55); ctx.fill();

    // Hands in prayer
    ctx.strokeStyle = "#fef3c7"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+55); ctx.quadraticCurveTo(ox+35, oy+75, ox+48, oy+65); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+55); ctx.quadraticCurveTo(ox+65, oy+75, ox+52, oy+65); ctx.stroke();

    // Spark of creation
    ctx.fillStyle = "#ffffff"; ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.arc(ox+50, oy+62, 3, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  },
};