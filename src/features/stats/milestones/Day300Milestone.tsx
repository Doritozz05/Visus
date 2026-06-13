import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day300Milestone: StreakMilestone = {
  id: "day300",
  isMatch: (s) => s >= 300 && s < 365,
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
        style={{ scale: 0.7, transformOrigin: "center center" }}
        animate={{ y: [-8, -11, -8], rotate: [-1, 1, -1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        {/* Background Lightning */}
        <motion.path
          d="M20,10 L30,40 L10,50 L40,90"
          fill="none" stroke="#fde047" strokeWidth="2"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, repeatDelay: 1 }}
        />
        <motion.path
          d="M90,10 L80,40 L100,50 L70,90"
          fill="none" stroke="#fde047" strokeWidth="2"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, repeatDelay: 1.5 }}
        />

        {/* Rocker Spiky Hair */}
        <path d="M35,25 L30,5 L45,20 L50,0 L55,20 L70,5 L65,25 Z" fill="#1e1b4b" />
        <path d="M40,25 L35,10 L45,20 L50,5 L55,20 L65,10 L60,25 Z" fill="#4f46e5" />

        {/* Ears */}
        <polygon points="20,35 50,35 25,18" fill="#4f46e5" />
        <polygon points="50,35 80,35 75,18" fill="#4f46e5" />

        {/* Feet */}
        <ellipse cx="32" cy="86" rx="6" ry="4" fill="#f97316" />
        <ellipse cx="68" cy="86" rx="6" ry="4" fill="#f97316" />

        {/* Body (Leather Jacket style over base) */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#4f46e5" />
        {/* Leather jacket */}
        <path d="M15,40 L35,87 A30,30 0 0,0 85,87 L85,40 Q50,60 15,40 Z" fill="#1e293b" />
        
        {/* Belly */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#c7d2fe" />

        {/* Star Sunglasses */}
        {/* Left Star */}
        <path d="M37,32 L40,38 L47,38 L41,42 L43,49 L37,45 L31,49 L33,42 L27,38 L34,38 Z" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />
        {/* Right Star */}
        <path d="M63,32 L66,38 L73,38 L67,42 L69,49 L63,45 L57,49 L59,42 L53,38 L60,38 Z" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" />
        {/* Glasses Bridge */}
        <line x1="47" y1="41" x2="53" y2="41" stroke="#fca5a5" strokeWidth="2" />

        {/* Beak */}
        <polygon points="47,49 53,49 50,55" fill="#f97316" />

        {/* Wings playing guitar */}
        <path d="M15,55 Q5,50 15,70" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
        <path d="M85,55 Q100,50 85,75" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />

        {/* Electric Guitar */}
        <g transform="translate(0, 65) rotate(-30)">
          {/* Guitar Neck */}
          <rect x="40" y="25" width="40" height="4" fill="#8b5cf6" />
          {/* Headstock */}
          <polygon points="80,24 85,22 85,30 80,28 Z" fill="#1e1b4b" />
          {/* Guitar Body (V-Shape) */}
          <path d="M20,15 L45,25 L45,29 L20,39 L35,27 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
          {/* Soundhole/Pickups */}
          <circle cx="35" cy="27" r="2" fill="#1e1b4b" />
          {/* Strings */}
          <line x1="35" y1="26" x2="80" y2="26" stroke="#f8fafc" strokeWidth="0.5" />
          <line x1="35" y1="28" x2="80" y2="28" stroke="#f8fafc" strokeWidth="0.5" />
        </g>

        {/* Music Notes / Energy */}
        <motion.path
          d="M10,30 Q5,20 15,15 A5,5 0 0,0 20,20"
          fill="none" stroke="#38bdf8" strokeWidth="2"
          animate={{ y: [0, -10], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <motion.circle
          cx="15" cy="15" r="2" fill="#38bdf8"
          animate={{ y: [0, -10], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    ctx.translate(16, 5);
    ctx.scale(0.7, 0.7);

    const ox = 0;
    const oy = 0;

    // Background Lightning
    ctx.strokeStyle = "#fde047"; ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(ox+20, oy+10); ctx.lineTo(ox+30, oy+40); ctx.lineTo(ox+10, oy+50); ctx.lineTo(ox+40, oy+90); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+90, oy+10); ctx.lineTo(ox+80, oy+40); ctx.lineTo(ox+100, oy+50); ctx.lineTo(ox+70, oy+90); ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Spiky Hair
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.moveTo(ox+35, oy+25); ctx.lineTo(ox+30, oy+5); ctx.lineTo(ox+45, oy+20); ctx.lineTo(ox+50, oy+0); ctx.lineTo(ox+55, oy+20); ctx.lineTo(ox+70, oy+5); ctx.lineTo(ox+65, oy+25); ctx.fill();
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath(); ctx.moveTo(ox+40, oy+25); ctx.lineTo(ox+35, oy+10); ctx.lineTo(ox+45, oy+20); ctx.lineTo(ox+50, oy+5); ctx.lineTo(ox+55, oy+20); ctx.lineTo(ox+65, oy+10); ctx.lineTo(ox+60, oy+25); ctx.fill();

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

    // Leather Jacket
    ctx.fillStyle = "#1e293b";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+40); ctx.lineTo(ox+35, oy+87); ctx.arcTo(ox+50, oy+87, ox+85, oy+87, 30); ctx.lineTo(ox+85, oy+40); ctx.quadraticCurveTo(ox+50, oy+60, ox+15, oy+40); ctx.fill();

    // Belly
    ctx.fillStyle = "#c7d2fe";
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 62, 22, 18, 0, 0, Math.PI * 2); ctx.fill();

    // Star Sunglasses
    ctx.fillStyle = "#ef4444"; ctx.strokeStyle = "#fca5a5"; ctx.lineWidth = 1;
    // Left Star
    ctx.beginPath(); ctx.moveTo(ox+37, oy+32); ctx.lineTo(ox+40, oy+38); ctx.lineTo(ox+47, oy+38); ctx.lineTo(ox+41, oy+42); ctx.lineTo(ox+43, oy+49); ctx.lineTo(ox+37, oy+45); ctx.lineTo(ox+31, oy+49); ctx.lineTo(ox+33, oy+42); ctx.lineTo(ox+27, oy+38); ctx.lineTo(ox+34, oy+38); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Right Star
    ctx.beginPath(); ctx.moveTo(ox+63, oy+32); ctx.lineTo(ox+66, oy+38); ctx.lineTo(ox+73, oy+38); ctx.lineTo(ox+67, oy+42); ctx.lineTo(ox+69, oy+49); ctx.lineTo(ox+63, oy+45); ctx.lineTo(ox+57, oy+49); ctx.lineTo(ox+59, oy+42); ctx.lineTo(ox+53, oy+38); ctx.lineTo(ox+60, oy+38); ctx.closePath(); ctx.fill(); ctx.stroke();
    
    // Glasses Bridge
    ctx.strokeStyle = "#fca5a5"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox+47, oy+41); ctx.lineTo(ox+53, oy+41); ctx.stroke();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.moveTo(ox + 47, oy + 49); ctx.lineTo(ox + 53, oy + 49); ctx.lineTo(ox + 50, oy + 55); ctx.fill();

    // Wings (Leather sleeves)
    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 10; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+55); ctx.quadraticCurveTo(ox+5, oy+50, ox+15, oy+70); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+55); ctx.quadraticCurveTo(ox+100, oy+50, ox+85, oy+75); ctx.stroke();

    // Electric Guitar
    ctx.save(); ctx.translate(ox+0, oy+65); ctx.rotate(-30 * Math.PI / 180);
    // Neck
    ctx.fillStyle = "#8b5cf6"; ctx.fillRect(40, 25, 40, 4);
    // Headstock
    ctx.fillStyle = "#1e1b4b"; ctx.beginPath(); ctx.moveTo(80,24); ctx.lineTo(85,22); ctx.lineTo(85,30); ctx.lineTo(80,28); ctx.fill();
    // Body (V-shape)
    ctx.fillStyle = "#ef4444"; ctx.strokeStyle = "#b91c1c"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(20,15); ctx.lineTo(45,25); ctx.lineTo(45,29); ctx.lineTo(20,39); ctx.lineTo(35,27); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Pickups
    ctx.fillStyle = "#1e1b4b"; ctx.beginPath(); ctx.arc(35, 27, 2, 0, Math.PI*2); ctx.fill();
    // Strings
    ctx.strokeStyle = "#f8fafc"; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(35, 26); ctx.lineTo(80, 26); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(35, 28); ctx.lineTo(80, 28); ctx.stroke();
    ctx.restore();

    // Music Notes (Static)
    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(ox+10, oy+25); ctx.quadraticCurveTo(ox+5, oy+15, ox+15, oy+10); ctx.arc(ox+15, oy+15, 5, -Math.PI/2, Math.PI, true); ctx.stroke();
    ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.arc(ox+15, oy+10, 2, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1.0;

    ctx.restore();
  },
};