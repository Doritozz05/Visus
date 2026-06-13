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
      className="w-full h-full drop-shadow-[0_4px_20px_rgba(139,92,246,0.5)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        {/* Tesseract Back Lines */}
        <motion.path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" animate={{ rotate: [0, 90, 180] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />
        <motion.path d="M35,35 L65,35 L65,65 L35,65 Z" fill="none" stroke="#a855f7" strokeWidth="1" opacity="0.6" animate={{ rotate: [0, -90, -180] }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />

        <line x1="20" y1="20" x2="35" y2="35" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
        <line x1="80" y1="20" x2="65" y2="35" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
        <line x1="20" y1="80" x2="35" y2="65" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
        <line x1="80" y1="80" x2="65" y2="65" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />

        {/* Fragmented Ears */}
        <polygon points="20,35 50,35 25,18" fill="none" stroke="#c084fc" strokeWidth="1.5" />
        <polygon points="50,35 80,35 75,18" fill="none" stroke="#c084fc" strokeWidth="1.5" />

        <polygon points="23,35 47,35 27,21" fill="#8b5cf6" opacity="0.5" />
        <polygon points="53,35 77,35 73,21" fill="#8b5cf6" opacity="0.5" />

        {/* Feet (Floating geometric prisms) */}
        <motion.polygon points="32,86 38,92 32,98 26,92" fill="#c084fc" animate={{ y: [0, -5, 0], rotate: [0, 45, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ transformOrigin: "32px 92px" }} />
        <motion.polygon points="68,86 74,92 68,98 62,92" fill="#c084fc" animate={{ y: [0, -5, 0], rotate: [0, -45, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} style={{ transformOrigin: "68px 92px" }} />

        {/* Body (Hypercube Frame) */}
        <rect x="15" y="22" width="70" height="65" rx="10" fill="none" stroke="#a855f7" strokeWidth="2" />
        <rect x="25" y="32" width="50" height="45" rx="5" fill="#4c1d95" opacity="0.8" />
        
        <line x1="15" y1="22" x2="25" y2="32" stroke="#a855f7" strokeWidth="2" />
        <line x1="85" y1="22" x2="75" y2="32" stroke="#a855f7" strokeWidth="2" />
        <line x1="15" y1="87" x2="25" y2="77" stroke="#a855f7" strokeWidth="2" />
        <line x1="85" y1="87" x2="75" y2="77" stroke="#a855f7" strokeWidth="2" />

        {/* Belly (Void core) */}
        <ellipse cx="50" cy="62" rx="15" ry="12" fill="#2e1065" />
        <motion.circle cx="50" cy="62" r="5" fill="#e9d5ff" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} />

        {/* Abstract Eyes (Floating Polygons) */}
        <polygon points="37,35 45,42 37,49 29,42" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <polygon points="63,35 71,42 63,49 55,42" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        
        <polygon points="37,38 41,42 37,46 33,42" fill="#fbcfe8" opacity="0.8" />
        <polygon points="63,38 67,42 63,46 59,42" fill="#fbcfe8" opacity="0.8" />

        <circle cx="37" cy="42" r="2" fill="#ffffff" />
        <circle cx="63" cy="42" r="2" fill="#ffffff" />

        {/* Beak (Floating Diamond) */}
        <polygon points="50,49 54,54 50,59 46,54" fill="#fcd34d" />

        {/* Wings (Geometric Fragments) */}
        <motion.path
          d="M15,55 L5,45 L10,65 Z" fill="#8b5cf6" opacity="0.7"
          animate={{ x: [0, -5, 0], y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 3 }}
        />
        <motion.path
          d="M10,65 L0,55 L5,75 Z" fill="#c084fc" opacity="0.5"
          animate={{ x: [0, -8, 0], y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5 }}
        />

        <motion.path
          d="M85,55 L95,45 L90,65 Z" fill="#8b5cf6" opacity="0.7"
          animate={{ x: [0, 5, 0], y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0.2 }}
        />
        <motion.path
          d="M90,65 L100,55 L95,75 Z" fill="#c084fc" opacity="0.5"
          animate={{ x: [0, 8, 0], y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 0.3 }}
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

    const ox = 0; const oy = 0;

    // Tesseract Back
    ctx.strokeStyle = "#8b5cf6"; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
    ctx.strokeRect(ox+20, oy+20, 60, 60);
    ctx.strokeStyle = "#a855f7"; ctx.globalAlpha = 0.6;
    ctx.strokeRect(ox+35, oy+35, 30, 30);
    ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.moveTo(ox+20, oy+20); ctx.lineTo(ox+35, oy+35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+80, oy+20); ctx.lineTo(ox+65, oy+35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+20, oy+80); ctx.lineTo(ox+35, oy+65); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+80, oy+80); ctx.lineTo(ox+65, oy+65); ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Ears
    ctx.strokeStyle = "#c084fc"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox+20, oy+35); ctx.lineTo(ox+50, oy+35); ctx.lineTo(ox+25, oy+18); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+50, oy+35); ctx.lineTo(ox+80, oy+35); ctx.lineTo(ox+75, oy+18); ctx.closePath(); ctx.stroke();

    ctx.fillStyle = "#8b5cf6"; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(ox+23, oy+35); ctx.lineTo(ox+47, oy+35); ctx.lineTo(ox+27, oy+21); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+53, oy+35); ctx.lineTo(ox+77, oy+35); ctx.lineTo(ox+73, oy+21); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Prism Feet
    ctx.fillStyle = "#c084fc";
    ctx.beginPath(); ctx.moveTo(ox+32, oy+86); ctx.lineTo(ox+38, oy+92); ctx.lineTo(ox+32, oy+98); ctx.lineTo(ox+26, oy+92); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+68, oy+86); ctx.lineTo(ox+74, oy+92); ctx.lineTo(ox+68, oy+98); ctx.lineTo(ox+62, oy+92); ctx.closePath(); ctx.fill();

    // Body Frame
    ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox+15, oy+22, 70, 65, 10); else ctx.rect(ox+15, oy+22, 70, 65);
    ctx.stroke();

    ctx.fillStyle = "#4c1d95"; ctx.globalAlpha = 0.8;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox+25, oy+32, 50, 45, 5); else ctx.rect(ox+25, oy+32, 50, 45);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Connecting lines
    ctx.beginPath(); ctx.moveTo(ox+15, oy+22); ctx.lineTo(ox+25, oy+32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+22); ctx.lineTo(ox+75, oy+32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+15, oy+87); ctx.lineTo(ox+25, oy+77); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+87); ctx.lineTo(ox+75, oy+77); ctx.stroke();

    // Belly Core
    ctx.fillStyle = "#2e1065";
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 62, 15, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e9d5ff"; ctx.shadowColor = "#e9d5ff"; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(ox+50, oy+62, 5, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // Abstract Eyes
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(ox+37, oy+35); ctx.lineTo(ox+45, oy+42); ctx.lineTo(ox+37, oy+49); ctx.lineTo(ox+29, oy+42); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+63, oy+35); ctx.lineTo(ox+71, oy+42); ctx.lineTo(ox+63, oy+49); ctx.lineTo(ox+55, oy+42); ctx.closePath(); ctx.stroke();

    ctx.fillStyle = "#fbcfe8"; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(ox+37, oy+38); ctx.lineTo(ox+41, oy+42); ctx.lineTo(ox+37, oy+46); ctx.lineTo(ox+33, oy+42); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+63, oy+38); ctx.lineTo(ox+67, oy+42); ctx.lineTo(ox+63, oy+46); ctx.lineTo(ox+59, oy+42); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1.0;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox+37, oy+42, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+63, oy+42, 2, 0, Math.PI*2); ctx.fill();

    // Beak Diamond
    ctx.fillStyle = "#fcd34d";
    ctx.beginPath(); ctx.moveTo(ox+50, oy+49); ctx.lineTo(ox+54, oy+54); ctx.lineTo(ox+50, oy+59); ctx.lineTo(ox+46, oy+54); ctx.closePath(); ctx.fill();

    // Wings Fragmented
    ctx.fillStyle = "#8b5cf6"; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.moveTo(ox+15, oy+55); ctx.lineTo(ox+5, oy+45); ctx.lineTo(ox+10, oy+65); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+55); ctx.lineTo(ox+95, oy+45); ctx.lineTo(ox+90, oy+65); ctx.closePath(); ctx.fill();

    ctx.fillStyle = "#c084fc"; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(ox+10, oy+65); ctx.lineTo(ox+0, oy+55); ctx.lineTo(ox+5, oy+75); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+90, oy+65); ctx.lineTo(ox+100, oy+55); ctx.lineTo(ox+95, oy+75); ctx.closePath(); ctx.fill();

    ctx.restore();
  },
};