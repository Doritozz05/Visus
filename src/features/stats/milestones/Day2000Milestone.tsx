import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day2000Milestone: StreakMilestone = {
  id: "day2000",
  isMatch: (s) => s >= 2000 && s < 3000,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="0 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_16px_rgba(45,212,191,0.4)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* Floating Crystal Shards (Background) */}
        <motion.polygon points="20,10 25,20 20,30 15,20" fill="#ccfbf1" opacity="0.4" animate={{ y: [0, -10, 0], rotate: [0, 90, 180] }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }} style={{ transformOrigin: "20px 20px" }} />
        <motion.polygon points="90,15 95,25 90,35 85,25" fill="#5eead4" opacity="0.4" animate={{ y: [0, 10, 0], rotate: [0, -90, -180] }} transition={{ repeat: Infinity, duration: 7, ease: "linear" }} style={{ transformOrigin: "90px 25px" }} />

        {/* Crystal Ears */}
        <polygon points="20,35 50,35 35,5" fill="#5eead4" opacity="0.8" />
        <polygon points="35,5 50,35 25,18" fill="#2dd4bf" opacity="0.9" />
        
        <polygon points="50,35 80,35 65,5" fill="#5eead4" opacity="0.8" />
        <polygon points="65,5 80,35 75,18" fill="#2dd4bf" opacity="0.9" />

        {/* Crystal Body Base */}
        <polygon points="50,20 85,45 65,90 35,90 15,45" fill="#14b8a6" opacity="0.7" />
        
        {/* Crystal Facets (Body) */}
        <polygon points="50,20 85,45 50,60" fill="#ccfbf1" opacity="0.8" />
        <polygon points="50,20 15,45 50,60" fill="#99f6e4" opacity="0.8" />
        <polygon points="15,45 35,90 50,60" fill="#0d9488" opacity="0.8" />
        <polygon points="85,45 65,90 50,60" fill="#0f766e" opacity="0.8" />

        {/* Belly Core (Pure Light) */}
        <motion.polygon
          points="50,45 65,65 50,85 35,65"
          fill="#ffffff"
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ transformOrigin: "50px 65px", filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))" }}
        />

        {/* Prism Eyes */}
        <polygon points="37,35 45,42 37,49 29,42" fill="#ffffff" />
        <polygon points="63,35 71,42 63,49 55,42" fill="#ffffff" />

        {/* Slit Pupils */}
        <line x1="37" y1="38" x2="37" y2="46" stroke="#042f2e" strokeWidth="2" strokeLinecap="round" />
        <line x1="63" y1="38" x2="63" y2="46" stroke="#042f2e" strokeWidth="2" strokeLinecap="round" />

        {/* Crystal Beak */}
        <polygon points="45,49 55,49 50,58" fill="#fef08a" />
        <polygon points="50,49 55,49 50,58" fill="#facc15" />

        {/* Floating Crystal Feet */}
        <motion.polygon points="32,95 38,105 32,115 26,105" fill="#5eead4" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
        <motion.polygon points="68,95 74,105 68,115 62,105" fill="#2dd4bf" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.2 }} />

        {/* Floating Crystal Wings */}
        <motion.polygon
          points="10,45 0,60 10,75 20,60"
          fill="#5eead4" opacity="0.8"
          animate={{ rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          style={{ transformOrigin: "15px 45px" }}
        />
        <motion.polygon
          points="90,45 100,60 90,75 80,60"
          fill="#2dd4bf" opacity="0.8"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
          style={{ transformOrigin: "85px 45px" }}
        />

        {/* Sparkles */}
        <motion.circle cx="50" cy="15" r="1.5" fill="#ffffff" animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} />
        <motion.circle cx="20" cy="50" r="1.5" fill="#ffffff" animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} />
        <motion.circle cx="80" cy="50" r="1.5" fill="#ffffff" animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.8 }} />

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

    // Background Shards
    ctx.fillStyle = "#ccfbf1"; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.moveTo(ox+20, oy+10); ctx.lineTo(ox+25, oy+20); ctx.lineTo(ox+20, oy+30); ctx.lineTo(ox+15, oy+20); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#5eead4";
    ctx.beginPath(); ctx.moveTo(ox+90, oy+15); ctx.lineTo(ox+95, oy+25); ctx.lineTo(ox+90, oy+35); ctx.lineTo(ox+85, oy+25); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Ears
    ctx.fillStyle = "#5eead4"; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(ox+20, oy+35); ctx.lineTo(ox+50, oy+35); ctx.lineTo(ox+35, oy+5); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+50, oy+35); ctx.lineTo(ox+80, oy+35); ctx.lineTo(ox+65, oy+5); ctx.fill();
    
    ctx.fillStyle = "#2dd4bf"; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.moveTo(ox+35, oy+5); ctx.lineTo(ox+50, oy+35); ctx.lineTo(ox+25, oy+18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+65, oy+5); ctx.lineTo(ox+80, oy+35); ctx.lineTo(ox+75, oy+18); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Body Base
    ctx.fillStyle = "#14b8a6"; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.moveTo(ox+50, oy+20); ctx.lineTo(ox+85, oy+45); ctx.lineTo(ox+65, oy+90); ctx.lineTo(ox+35, oy+90); ctx.lineTo(ox+15, oy+45); ctx.closePath(); ctx.fill();
    
    // Facets
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#ccfbf1"; ctx.beginPath(); ctx.moveTo(ox+50, oy+20); ctx.lineTo(ox+85, oy+45); ctx.lineTo(ox+50, oy+60); ctx.fill();
    ctx.fillStyle = "#99f6e4"; ctx.beginPath(); ctx.moveTo(ox+50, oy+20); ctx.lineTo(ox+15, oy+45); ctx.lineTo(ox+50, oy+60); ctx.fill();
    ctx.fillStyle = "#0d9488"; ctx.beginPath(); ctx.moveTo(ox+15, oy+45); ctx.lineTo(ox+35, oy+90); ctx.lineTo(ox+50, oy+60); ctx.fill();
    ctx.fillStyle = "#0f766e"; ctx.beginPath(); ctx.moveTo(ox+85, oy+45); ctx.lineTo(ox+65, oy+90); ctx.lineTo(ox+50, oy+60); ctx.fill();

    // Belly Core
    ctx.fillStyle = "#ffffff"; ctx.globalAlpha = 0.9; ctx.shadowColor = "#ffffff"; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(ox+50, oy+45); ctx.lineTo(ox+65, oy+65); ctx.lineTo(ox+50, oy+85); ctx.lineTo(ox+35, oy+65); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1.0; ctx.shadowBlur = 0;

    // Prism Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.moveTo(ox+37, oy+35); ctx.lineTo(ox+45, oy+42); ctx.lineTo(ox+37, oy+49); ctx.lineTo(ox+29, oy+42); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+63, oy+35); ctx.lineTo(ox+71, oy+42); ctx.lineTo(ox+63, oy+49); ctx.lineTo(ox+55, oy+42); ctx.fill();

    // Pupils
    ctx.strokeStyle = "#042f2e"; ctx.lineWidth = 2; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+37, oy+38); ctx.lineTo(ox+37, oy+46); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+63, oy+38); ctx.lineTo(ox+63, oy+46); ctx.stroke();

    // Beak
    ctx.fillStyle = "#fef08a";
    ctx.beginPath(); ctx.moveTo(ox+45, oy+49); ctx.lineTo(ox+55, oy+49); ctx.lineTo(ox+50, oy+58); ctx.fill();
    ctx.fillStyle = "#facc15";
    ctx.beginPath(); ctx.moveTo(ox+50, oy+49); ctx.lineTo(ox+55, oy+49); ctx.lineTo(ox+50, oy+58); ctx.fill();

    // Feet
    ctx.fillStyle = "#5eead4";
    ctx.beginPath(); ctx.moveTo(ox+32, oy+95); ctx.lineTo(ox+38, oy+105); ctx.lineTo(ox+32, oy+115); ctx.lineTo(ox+26, oy+105); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2dd4bf";
    ctx.beginPath(); ctx.moveTo(ox+68, oy+95); ctx.lineTo(ox+74, oy+105); ctx.lineTo(ox+68, oy+115); ctx.lineTo(ox+62, oy+105); ctx.closePath(); ctx.fill();

    // Wings
    ctx.fillStyle = "#5eead4"; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(ox+10, oy+45); ctx.lineTo(ox+0, oy+60); ctx.lineTo(ox+10, oy+75); ctx.lineTo(ox+20, oy+60); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2dd4bf";
    ctx.beginPath(); ctx.moveTo(ox+90, oy+45); ctx.lineTo(ox+100, oy+60); ctx.lineTo(ox+90, oy+75); ctx.lineTo(ox+80, oy+60); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Sparkles
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox+50, oy+15, 1.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+20, oy+50, 1.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+80, oy+50, 1.5, 0, Math.PI*2); ctx.fill();

    ctx.restore();
  },
};