import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day600Milestone: StreakMilestone = {
  id: "day600",
  isMatch: (s) => s >= 600 && s < 730,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="-5 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(79,70,229,0.15)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        {/* Background Rotating Gears */}
        <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} style={{ transformOrigin: "20px 20px" }}>
          <circle cx="20" cy="20" r="12" fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" />
          <circle cx="20" cy="20" r="8" fill="none" stroke="#d97706" strokeWidth="3" opacity="0.6" />
        </motion.g>
        <motion.g animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 12, ease: "linear" }} style={{ transformOrigin: "85px 75px" }}>
          <circle cx="85" cy="75" r="15" fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="6 3" opacity="0.5" />
          <circle cx="85" cy="75" r="10" fill="none" stroke="#d97706" strokeWidth="4" opacity="0.5" />
        </motion.g>

        {/* Ears */}
        <polygon points="20,35 50,35 25,18" fill="#4f46e5" />
        <polygon points="50,35 80,35 75,18" fill="#4f46e5" />

        {/* Feet (Brass Boots) */}
        <path d="M28,86 L36,86 L34,92 L30,92 Z" fill="#b45309" />
        <path d="M64,86 L72,86 L70,92 L66,92 Z" fill="#b45309" />

        {/* Body */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#4f46e5" />

        {/* Steampunk Vest */}
        <path d="M15,40 L45,87 L55,87 L85,40 Q50,60 15,40 Z" fill="#78350f" />
        <line x1="50" y1="45" x2="50" y2="85" stroke="#451a03" strokeWidth="2" />
        <circle cx="50" cy="55" r="2" fill="#fbbf24" />
        <circle cx="50" cy="65" r="2" fill="#fbbf24" />
        <circle cx="50" cy="75" r="2" fill="#fbbf24" />

        {/* Belly */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#c7d2fe" />

        {/* Pocket Watch Chain */}
        <path d="M35,65 Q45,75 50,65" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2 1" />

        {/* Eyes outer white */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" />
        <circle cx="63" cy="42" r="12" fill="#ffffff" />

        {/* Steampunk Monocle / Goggles */}
        <circle cx="37" cy="42" r="13" fill="none" stroke="#d97706" strokeWidth="2" />
        <circle cx="63" cy="42" r="14" fill="none" stroke="#b45309" strokeWidth="3" />
        
        {/* Clock Face in Right Eye */}
        <g transform="translate(63, 42)">
          <circle cx="0" cy="0" r="12" fill="#fef3c7" opacity="0.3" />
          <line x1="0" y1="0" x2="0" y2="-8" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1="0" x2="5" y2="5" stroke="#1e1b4b" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Left Pupil */}
        <circle cx="37" cy="42" r="5" fill="#1e1b4b" />
        <circle cx="39" cy="40" r="1.5" fill="#ffffff" />

        {/* Beak */}
        <polygon points="47,49 53,49 50,55" fill="#f97316" />

        {/* Top Hat */}
        <rect x="35" y="18" width="30" height="4" rx="1" fill="#451a03" />
        <path d="M38,4 L62,4 L60,18 L40,18 Z" fill="#78350f" />
        <rect x="39" y="14" width="22" height="4" fill="#991b1b" />
        {/* Hat Goggles */}
        <circle cx="45" cy="16" r="4" fill="#0f172a" stroke="#d97706" strokeWidth="1.5" />
        <circle cx="55" cy="16" r="4" fill="#0f172a" stroke="#d97706" strokeWidth="1.5" />
        <line x1="49" y1="16" x2="51" y2="16" stroke="#d97706" strokeWidth="1" />

        {/* Wings */}
        <path d="M15,55 Q5,65 10,75" fill="none" stroke="#78350f" strokeWidth="9" strokeLinecap="round" />
        <path d="M85,55 Q100,50 90,65" fill="none" stroke="#78350f" strokeWidth="9" strokeLinecap="round" />

        {/* Pocket Watch held by wing */}
        <g transform="translate(90, 65)">
          <circle cx="0" cy="0" r="8" fill="#fef3c7" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="0" cy="0" r="6" fill="none" stroke="#d97706" strokeWidth="0.5" />
          <motion.line x1="0" y1="0" x2="0" y2="-5" stroke="#1e1b4b" strokeWidth="1" strokeLinecap="round" animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} style={{ transformOrigin: "0px 0px" }} />
          <rect x="-1.5" y="-10" width="3" height="2" fill="#fbbf24" />
        </g>
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

    // Background Gears (Static)
    ctx.save(); ctx.translate(ox+20, oy+20);
    ctx.strokeStyle = "#b45309"; ctx.lineWidth = 2; ctx.globalAlpha = 0.6; ctx.setLineDash([4, 2]);
    ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = "#d97706"; ctx.lineWidth = 3; ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.stroke();
    ctx.restore();

    ctx.save(); ctx.translate(ox+85, oy+75);
    ctx.strokeStyle = "#b45309"; ctx.lineWidth = 2; ctx.globalAlpha = 0.5; ctx.setLineDash([6, 3]);
    ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = "#d97706"; ctx.lineWidth = 4; ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.stroke();
    ctx.restore();

    ctx.globalAlpha = 1.0;

    // Ears
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath(); ctx.moveTo(ox + 20, oy + 35); ctx.lineTo(ox + 50, oy + 35); ctx.lineTo(ox + 25, oy + 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox + 50, oy + 35); ctx.lineTo(ox + 80, oy + 35); ctx.lineTo(ox + 75, oy + 18); ctx.fill();

    // Brass Boots
    ctx.fillStyle = "#b45309";
    ctx.beginPath(); ctx.moveTo(ox+28, oy+86); ctx.lineTo(ox+36, oy+86); ctx.lineTo(ox+34, oy+92); ctx.lineTo(ox+30, oy+92); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+64, oy+86); ctx.lineTo(ox+72, oy+86); ctx.lineTo(ox+70, oy+92); ctx.lineTo(ox+66, oy+92); ctx.closePath(); ctx.fill();

    // Body
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    else ctx.rect(ox + 15, oy + 22, 70, 65);
    ctx.fill();

    // Steampunk Vest
    ctx.fillStyle = "#78350f";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+40); ctx.lineTo(ox+45, oy+87); ctx.lineTo(ox+55, oy+87); ctx.lineTo(ox+85, oy+40); ctx.quadraticCurveTo(ox+50, oy+60, ox+15, oy+40); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#451a03"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox+50, oy+45); ctx.lineTo(ox+50, oy+85); ctx.stroke();
    
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.arc(ox+50, oy+55, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+50, oy+65, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+50, oy+75, 2, 0, Math.PI*2); ctx.fill();

    // Belly
    ctx.fillStyle = "#c7d2fe";
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 62, 22, 18, 0, 0, Math.PI * 2); ctx.fill();

    // Chain
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.setLineDash([2, 1]);
    ctx.beginPath(); ctx.moveTo(ox+35, oy+65); ctx.quadraticCurveTo(ox+45, oy+75, ox+50, oy+65); ctx.stroke();
    ctx.setLineDash([]);

    // Eyes outer
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2); ctx.fill();

    // Goggles / Monocle
    ctx.strokeStyle = "#d97706"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(ox+37, oy+42, 13, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = "#b45309"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ox+63, oy+42, 14, 0, Math.PI*2); ctx.stroke();

    // Left Pupil
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 39, oy + 40, 1.5, 0, Math.PI * 2); ctx.fill();

    // Clock Face (Right Eye)
    ctx.fillStyle = "#fef3c7"; ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.arc(ox+63, oy+42, 12, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = "#1e1b4b"; ctx.lineWidth = 1.5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+63, oy+42); ctx.lineTo(ox+63, oy+34); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+63, oy+42); ctx.lineTo(ox+68, oy+47); ctx.stroke();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.moveTo(ox + 47, oy + 49); ctx.lineTo(ox + 53, oy + 49); ctx.lineTo(ox + 50, oy + 55); ctx.fill();

    // Top Hat
    ctx.fillStyle = "#451a03";
    ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(ox+35, oy+18, 30, 4, 1); else ctx.rect(ox+35, oy+18, 30, 4); ctx.fill();
    ctx.fillStyle = "#78350f";
    ctx.beginPath(); ctx.moveTo(ox+38, oy+4); ctx.lineTo(ox+62, oy+4); ctx.lineTo(ox+60, oy+18); ctx.lineTo(ox+40, oy+18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#991b1b";
    ctx.fillRect(ox+39, oy+14, 22, 4);
    
    // Hat Goggles
    ctx.fillStyle = "#0f172a"; ctx.strokeStyle = "#d97706"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(ox+45, oy+16, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(ox+55, oy+16, 4, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ox+49, oy+16); ctx.lineTo(ox+51, oy+16); ctx.stroke();

    // Wings
    ctx.strokeStyle = "#78350f"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+55); ctx.quadraticCurveTo(ox+5, oy+65, ox+10, oy+75); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+55); ctx.quadraticCurveTo(ox+100, oy+50, ox+90, oy+65); ctx.stroke();

    // Pocket Watch
    ctx.save(); ctx.translate(ox+90, oy+65);
    ctx.fillStyle = "#fef3c7"; ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#d97706"; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = "#1e1b4b"; ctx.lineWidth = 1; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-5); ctx.stroke();
    ctx.fillStyle = "#fbbf24"; ctx.fillRect(-1.5, -10, 3, 2);
    ctx.restore();

    ctx.restore();
  },
};