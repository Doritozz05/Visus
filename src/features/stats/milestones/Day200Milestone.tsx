import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day200Milestone: StreakMilestone = {
  id: "day200",
  isMatch: (s) => s >= 200 && s < 250,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="-5 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(79,70,229,0.15)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Zero-G floating animation for the entire astronaut */}
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        {/* Space background elements (stars) */}
        <motion.circle cx="20" cy="20" r="1" fill="#ffffff" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2 }} />
        <motion.circle cx="85" cy="15" r="1.5" fill="#fef08a" animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }} />
        <motion.circle cx="90" cy="80" r="1" fill="#ffffff" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} />

        {/* Ears */}
        <polygon points="20,35 50,35 25,18" fill="#4f46e5" />
        <polygon points="50,35 80,35 75,18" fill="#4f46e5" />

        {/* Jetpack Flames (Replacing Feet) */}
        <motion.path
          d="M28,85 L36,85 L32,100 Z"
          fill="#38bdf8"
          animate={{ scaleY: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          style={{ transformOrigin: "32px 85px" }}
        />
        <motion.path
          d="M64,85 L72,85 L68,100 Z"
          fill="#38bdf8"
          animate={{ scaleY: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
          style={{ transformOrigin: "68px 85px" }}
        />

        {/* Jetpack Nozzles */}
        <rect x="28" y="82" width="8" height="4" rx="1" fill="#94a3b8" />
        <rect x="64" y="82" width="8" height="4" rx="1" fill="#94a3b8" />

        {/* Body (Spacesuit base) */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#f8fafc" />
        
        {/* Spacesuit details (lines and panels) */}
        <path d="M15,50 Q50,60 85,50" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M35,22 L35,55 M65,22 L65,55" fill="none" stroke="#cbd5e1" strokeWidth="2" />
        
        {/* Chest Control Panel */}
        <rect x="40" y="60" width="20" height="15" rx="2" fill="#1e293b" />
        <circle cx="45" cy="65" r="2" fill="#ef4444" />
        <circle cx="55" cy="65" r="2" fill="#22c55e" />
        <rect x="44" y="70" width="12" height="2" fill="#38bdf8" />

        {/* Face plate area (inner body showing through helmet) */}
        <ellipse cx="50" cy="42" rx="25" ry="18" fill="#4f46e5" />

        {/* Eyes outer white */}
        <circle cx="37" cy="42" r="10" fill="#ffffff" />
        <circle cx="63" cy="42" r="10" fill="#ffffff" />

        {/* Pupils (looking up in wonder) */}
        <circle cx="37" cy="40" r="4" fill="#1e1b4b" />
        <circle cx="63" cy="40" r="4" fill="#1e1b4b" />
        <circle cx="38" cy="38" r="1.5" fill="#ffffff" />
        <circle cx="64" cy="38" r="1.5" fill="#ffffff" />

        {/* Beak */}
        <polygon points="47,47 53,47 50,52" fill="#f97316" />

        {/* Glass Dome Helmet */}
        <ellipse cx="50" cy="42" rx="35" ry="28" fill="#38bdf8" opacity="0.2" stroke="#bae6fd" strokeWidth="2" />
        
        {/* Helmet Glare */}
        <path d="M25,30 A25,20 0 0,1 50,16 A25,20 0 0,0 25,35 Z" fill="#ffffff" opacity="0.5" />

        {/* Wings (Thick spacesuit sleeves) */}
        <motion.path
          d="M15,45 Q5,35 10,25"
          fill="none" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round"
          animate={{ rotate: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ transformOrigin: "15px 45px" }}
        />
        <motion.path
          d="M85,45 Q95,55 100,65"
          fill="none" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round"
          animate={{ rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          style={{ transformOrigin: "85px 45px" }}
        />

        {/* Gloves */}
        <circle cx="10" cy="25" r="6" fill="#1e293b" />
        <circle cx="100" cy="65" r="6" fill="#1e293b" />

        {/* Floating Glowing Star held by left wing */}
        <motion.g
          animate={{ y: [0, -5, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <path d="M10,5 L12,12 L19,12 L13,16 L15,23 L10,18 L5,23 L7,16 L1,12 L8,12 Z" fill="#fef08a" />
          <circle cx="10" cy="15" r="8" fill="#fef08a" opacity="0.4" filter="blur(2px)" />
        </motion.g>
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

    // Stars
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox+20, oy+20, 1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+90, oy+80, 1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#fef08a";
    ctx.beginPath(); ctx.arc(ox+85, oy+15, 1.5, 0, Math.PI*2); ctx.fill();

    // Ears
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath(); ctx.moveTo(ox + 20, oy + 35); ctx.lineTo(ox + 50, oy + 35); ctx.lineTo(ox + 25, oy + 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox + 50, oy + 35); ctx.lineTo(ox + 80, oy + 35); ctx.lineTo(ox + 75, oy + 18); ctx.fill();

    // Jetpack Flames
    ctx.fillStyle = "#38bdf8"; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(ox+28, oy+85); ctx.lineTo(ox+36, oy+85); ctx.lineTo(ox+32, oy+100); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+64, oy+85); ctx.lineTo(ox+72, oy+85); ctx.lineTo(ox+68, oy+100); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Jetpack Nozzles
    ctx.fillStyle = "#94a3b8";
    if (ctx.roundRect) {
      ctx.beginPath(); ctx.roundRect(ox+28, oy+82, 8, 4, 1); ctx.fill();
      ctx.beginPath(); ctx.roundRect(ox+64, oy+82, 8, 4, 1); ctx.fill();
    } else {
      ctx.fillRect(ox+28, oy+82, 8, 4);
      ctx.fillRect(ox+64, oy+82, 8, 4);
    }

    // Spacesuit Body
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    else ctx.rect(ox + 15, oy + 22, 70, 65);
    ctx.fill();

    // Suit details
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox+15, oy+50); ctx.quadraticCurveTo(ox+50, oy+60, ox+85, oy+50); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+35, oy+22); ctx.lineTo(ox+35, oy+55); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+65, oy+22); ctx.lineTo(ox+65, oy+55); ctx.stroke();

    // Control Panel
    ctx.fillStyle = "#1e293b";
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(ox+40, oy+60, 20, 15, 2); ctx.fill(); }
    else { ctx.fillRect(ox+40, oy+60, 20, 15); }
    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.arc(ox+45, oy+65, 2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#22c55e"; ctx.beginPath(); ctx.arc(ox+55, oy+65, 2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#38bdf8"; ctx.fillRect(ox+44, oy+70, 12, 2);

    // Face Plate Background
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath(); ctx.ellipse(ox+50, oy+42, 25, 18, 0, 0, Math.PI*2); ctx.fill();

    // Eyes outer
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 10, 0, Math.PI * 2); ctx.fill();

    // Pupils (looking up)
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 40, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 40, 4, 0, Math.PI * 2); ctx.fill();

    // Highlights
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 38, oy + 38, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 64, oy + 38, 1.5, 0, Math.PI * 2); ctx.fill();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.moveTo(ox + 47, oy + 47); ctx.lineTo(ox + 53, oy + 47); ctx.lineTo(ox + 50, oy + 52); ctx.fill();

    // Glass Dome Helmet
    ctx.fillStyle = "#38bdf8"; ctx.globalAlpha = 0.2;
    ctx.strokeStyle = "#bae6fd"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(ox+50, oy+42, 35, 28, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    
    // Helmet Glare
    ctx.fillStyle = "#ffffff"; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(ox+25, oy+30); ctx.ellipse(ox+50, oy+42, 25, 20, 0, Math.PI, Math.PI*1.5); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Wings (Sleeves)
    ctx.strokeStyle = "#f8fafc"; ctx.lineWidth = 10; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+45); ctx.quadraticCurveTo(ox+5, oy+35, ox+10, oy+25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+45); ctx.quadraticCurveTo(ox+95, oy+55, ox+100, oy+65); ctx.stroke();

    // Gloves
    ctx.fillStyle = "#1e293b";
    ctx.beginPath(); ctx.arc(ox+10, oy+25, 6, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+100, oy+65, 6, 0, Math.PI*2); ctx.fill();

    // Glowing Star
    ctx.fillStyle = "#fef08a"; ctx.shadowColor = "#fef08a"; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(ox+10, oy+5); ctx.lineTo(ox+12, oy+12); ctx.lineTo(ox+19, oy+12); ctx.lineTo(ox+13, oy+16); ctx.lineTo(ox+15, oy+23); ctx.lineTo(ox+10, oy+18); ctx.lineTo(ox+5, oy+23); ctx.lineTo(ox+7, oy+16); ctx.lineTo(ox+1, oy+12); ctx.lineTo(ox+8, oy+12); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  },
};
