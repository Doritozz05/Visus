import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day5000Milestone: StreakMilestone = {
  id: "day5000",
  isMatch: (s) => s >= 5000 && s < 9999,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="0 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_25px_rgba(250,204,21,0.6)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* Spinning Celestial Rings */}
        <motion.circle cx="50" cy="50" r="45" fill="none" stroke="#fcd34d" strokeWidth="2" opacity="0.8" strokeDasharray="15 10" animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />
        <motion.ellipse cx="50" cy="50" rx="55" ry="15" fill="none" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.7" animate={{ rotate: [0, -360] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />
        <motion.ellipse cx="50" cy="50" rx="15" ry="55" fill="none" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.7" animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />

        {/* Six Golden Wings (Seraphim) */}
        {/* Top Wings */}
        <motion.path d="M40,35 Q20,-15 5,0 Q20,25 35,40" fill="#fde047" opacity="0.9" animate={{ rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }} style={{ transformOrigin: "40px 35px" }} />
        <motion.path d="M60,35 Q80,-15 95,0 Q80,25 65,40" fill="#fde047" opacity="0.9" animate={{ rotate: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }} style={{ transformOrigin: "60px 35px" }} />
        
        {/* Middle Wings */}
        <motion.path d="M25,50 Q-20,40 -15,65 Q10,70 25,60" fill="#facc15" opacity="0.8" animate={{ rotate: [-8, 8, -8] }} transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }} style={{ transformOrigin: "25px 50px" }} />
        <motion.path d="M75,50 Q120,40 115,65 Q90,70 75,60" fill="#facc15" opacity="0.8" animate={{ rotate: [8, -8, 8] }} transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }} style={{ transformOrigin: "75px 50px" }} />

        {/* Bottom Wings */}
        <motion.path d="M35,65 Q10,100 25,110 Q45,90 45,70" fill="#eab308" opacity="0.7" animate={{ rotate: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }} style={{ transformOrigin: "35px 65px" }} />
        <motion.path d="M65,65 Q90,100 75,110 Q55,90 55,70" fill="#eab308" opacity="0.7" animate={{ rotate: [6, -6, 6] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }} style={{ transformOrigin: "65px 65px" }} />

        {/* Ears (Crystalline Ascended) */}
        <polygon points="20,35 50,35 25,10" fill="#fef08a" />
        <polygon points="50,35 80,35 75,10" fill="#fef08a" />
        <polygon points="25,35 45,35 28,15" fill="#ffffff" opacity="0.6" />
        <polygon points="55,35 75,35 72,15" fill="#ffffff" opacity="0.6" />

        {/* Body */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#eab308" />
        <rect x="18" y="25" width="64" height="59" rx="26" fill="#fef08a" />

        {/* Belly (Nova Core) */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#ffffff" />
        <motion.circle cx="50" cy="62" r="12" fill="#7dd3fc" opacity="0.8" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} />
        <motion.circle cx="50" cy="62" r="6" fill="#0284c7" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} strokeDasharray="2 4" stroke="#ffffff" strokeWidth="3" style={{ transformOrigin: "50px 62px" }} />

        {/* Eyes (Glowing Celestial) */}
        <circle cx="37" cy="42" r="10" fill="#ffffff" />
        <circle cx="63" cy="42" r="10" fill="#ffffff" />
        
        {/* Pupils (Sky Blue Glowing) */}
        <circle cx="37" cy="42" r="5" fill="#38bdf8" />
        <circle cx="63" cy="42" r="5" fill="#38bdf8" />
        <circle cx="37" cy="42" r="2" fill="#ffffff" />
        <circle cx="63" cy="42" r="2" fill="#ffffff" />

        {/* Third Eye (Awakened) */}
        <polygon points="45,28 50,23 55,28 50,33" fill="#ffffff" />
        <circle cx="50" cy="28" r="2" fill="#38bdf8" />

        {/* Beak (Golden Light) */}
        <polygon points="47,49 53,49 50,56" fill="#ca8a04" />
        <polygon points="48,49 52,49 50,54" fill="#ffffff" />

        {/* Floating Halos around feet */}
        <motion.ellipse cx="25" cy="85" rx="8" ry="3" fill="none" stroke="#fcd34d" strokeWidth="2" animate={{ y: [-3, 3, -3], rotate: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} style={{ transformOrigin: "25px 85px" }} />
        <motion.ellipse cx="75" cy="85" rx="8" ry="3" fill="none" stroke="#fcd34d" strokeWidth="2" animate={{ y: [-3, 3, -3], rotate: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }} style={{ transformOrigin: "75px 85px" }} />

        {/* Crown Halo */}
        <motion.ellipse cx="50" cy="5" rx="25" ry="6" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" animate={{ y: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} />
        <motion.path d="M50,-5 L50,0 M30,0 L35,4 M70,0 L65,4" fill="none" stroke="#fcd34d" strokeWidth="1.5" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} />

      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);
    ctx.translate(11, 10);
    ctx.scale(0.8, 0.8);

    const ox = 0; const oy = 0;

    // Glowing effect
    ctx.shadowColor = "rgba(250,204,21,0.6)";
    ctx.shadowBlur = 15;

    // Rings
    ctx.strokeStyle = "#fcd34d"; ctx.lineWidth = 2; ctx.globalAlpha = 0.8; ctx.setLineDash([15, 10]);
    ctx.beginPath(); ctx.arc(ox+50, oy+50, 45, 0, Math.PI*2); ctx.stroke();
    
    ctx.strokeStyle = "#7dd3fc"; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7; ctx.setLineDash([]);
    ctx.beginPath(); ctx.ellipse(ox+50, oy+50, 55, 15, 0, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(ox+50, oy+50, 15, 55, 0, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Six Wings
    ctx.fillStyle = "#fde047"; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.moveTo(ox+40, oy+35); ctx.quadraticCurveTo(ox+20, oy-15, ox+5, oy+0); ctx.quadraticCurveTo(ox+20, oy+25, ox+35, oy+40); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+60, oy+35); ctx.quadraticCurveTo(ox+80, oy-15, ox+95, oy+0); ctx.quadraticCurveTo(ox+80, oy+25, ox+65, oy+40); ctx.fill();

    ctx.fillStyle = "#facc15"; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(ox+25, oy+50); ctx.quadraticCurveTo(ox-20, oy+40, ox-15, oy+65); ctx.quadraticCurveTo(ox+10, oy+70, ox+25, oy+60); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+75, oy+50); ctx.quadraticCurveTo(ox+120, oy+40, ox+115, oy+65); ctx.quadraticCurveTo(ox+90, oy+70, ox+75, oy+60); ctx.fill();

    ctx.fillStyle = "#eab308"; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.moveTo(ox+35, oy+65); ctx.quadraticCurveTo(ox+10, oy+100, ox+25, oy+110); ctx.quadraticCurveTo(ox+45, oy+90, ox+45, oy+70); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+65, oy+65); ctx.quadraticCurveTo(ox+90, oy+100, ox+75, oy+110); ctx.quadraticCurveTo(ox+55, oy+90, ox+55, oy+70); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Ears
    ctx.fillStyle = "#fef08a";
    ctx.beginPath(); ctx.moveTo(ox+20, oy+35); ctx.lineTo(ox+50, oy+35); ctx.lineTo(ox+25, oy+10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+50, oy+35); ctx.lineTo(ox+80, oy+35); ctx.lineTo(ox+75, oy+10); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(ox+25, oy+35); ctx.lineTo(ox+45, oy+35); ctx.lineTo(ox+28, oy+15); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+55, oy+35); ctx.lineTo(ox+75, oy+35); ctx.lineTo(ox+72, oy+15); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Body
    ctx.fillStyle = "#eab308";
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(ox+15, oy+22, 70, 65, 30); else ctx.rect(ox+15, oy+22, 70, 65); ctx.fill();
    ctx.fillStyle = "#fef08a";
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(ox+18, oy+25, 64, 59, 26); else ctx.rect(ox+18, oy+25, 64, 59); ctx.fill();

    // Belly (Nova Core)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.ellipse(ox+50, oy+62, 22, 18, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#7dd3fc"; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(ox+50, oy+62, 12, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 3; ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.arc(ox+50, oy+62, 6, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);

    // Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox+37, oy+42, 10, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+63, oy+42, 10, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath(); ctx.arc(ox+37, oy+42, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+63, oy+42, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox+37, oy+42, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+63, oy+42, 2, 0, Math.PI*2); ctx.fill();

    // Third Eye
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.moveTo(ox+45, oy+28); ctx.lineTo(ox+50, oy+23); ctx.lineTo(ox+55, oy+28); ctx.lineTo(ox+50, oy+33); ctx.fill();
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath(); ctx.arc(ox+50, oy+28, 2, 0, Math.PI*2); ctx.fill();

    // Beak
    ctx.fillStyle = "#ca8a04";
    ctx.beginPath(); ctx.moveTo(ox+47, oy+49); ctx.lineTo(ox+53, oy+49); ctx.lineTo(ox+50, oy+56); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.moveTo(ox+48, oy+49); ctx.lineTo(ox+52, oy+49); ctx.lineTo(ox+50, oy+54); ctx.fill();

    // Feet halos
    ctx.strokeStyle = "#fcd34d"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(ox+25, oy+85, 8, 3, 0, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(ox+75, oy+85, 8, 3, 0, 0, Math.PI*2); ctx.stroke();

    // Crown Halo
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.ellipse(ox+50, oy+5, 25, 6, 0, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = "#fcd34d"; ctx.lineWidth = 1.5; ctx.globalAlpha = 1.0;
    ctx.beginPath(); ctx.moveTo(ox+50, oy-5); ctx.lineTo(ox+50, oy+0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+30, oy+0); ctx.lineTo(ox+35, oy+4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+70, oy+0); ctx.lineTo(ox+65, oy+4); ctx.stroke();

    ctx.restore();
  },
};
