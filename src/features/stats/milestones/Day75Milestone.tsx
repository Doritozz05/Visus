import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day75Milestone: StreakMilestone = {
  id: "day75",
  isMatch: (s) => s >= 75 && s < 100,
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
        animate={{ y: [-5, -8, -5] }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: "easeInOut",
        }}
      >
        {/* Floating Rune/Halo behind head */}
        <motion.circle
          cx="50"
          cy="25"
          r="30"
          fill="none"
          stroke="#eab308"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          opacity="0.4"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ transformOrigin: "50px 25px" }}
        />
        <circle cx="50" cy="25" r="28" fill="none" stroke="#eab308" strokeWidth="0.5" opacity="0.3" />

        {/* Ears */}
        <polygon points="20,35 50,35 25,18" fill="#4f46e5" />
        <polygon points="50,35 80,35 75,18" fill="#4f46e5" />

        {/* Feet */}
        <ellipse cx="32" cy="86" rx="6" ry="4" fill="#f97316" />
        <ellipse cx="68" cy="86" rx="6" ry="4" fill="#f97316" />

        {/* Body */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#4f46e5" />

        {/* Belly */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#c7d2fe" />

        {/* Archmage Beard (Geometric overlapping triangles) */}
        <polygon points="35,55 65,55 50,85" fill="#f8fafc" opacity="0.9" />
        <polygon points="40,55 60,55 50,75" fill="#e2e8f0" opacity="0.9" />
        
        {/* Eyes outer white (slightly narrowed for ancient wisdom) */}
        <path d="M25,42 Q37,35 49,42 Q37,49 25,42" fill="#ffffff" />
        <path d="M51,42 Q63,35 75,42 Q63,49 51,42" fill="#ffffff" />

        {/* Pupils */}
        <circle cx="37" cy="42" r="4" fill="#1e1b4b" />
        <circle cx="63" cy="42" r="4" fill="#1e1b4b" />
        
        {/* Glowing eyes effect */}
        <motion.circle
          cx="37"
          cy="42"
          r="2"
          fill="#eab308"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <motion.circle
          cx="63"
          cy="42"
          r="2"
          fill="#eab308"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
        />

        {/* Majestic Eyebrows */}
        <path d="M22,35 L40,40 L45,35" fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M78,35 L60,40 L55,35" fill="none" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Beak (partially hidden by mustache/beard) */}
        <polygon points="47,49 53,49 50,54" fill="#f97316" />

        {/* Wings raised, casting magic */}
        <motion.path
          d="M15,50 Q0,35 10,20"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ transformOrigin: "15px 50px" }}
        />
        <motion.path
          d="M85,50 Q100,35 90,20"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          style={{ transformOrigin: "85px 50px" }}
        />

        {/* Floating Grimoire in front */}
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          {/* Magic glow behind book */}
          <circle cx="50" cy="70" r="20" fill="#eab308" opacity="0.15" filter="blur(4px)" />
          
          {/* Book Base */}
          <path d="M30,65 L50,70 L70,65 L70,75 L50,80 L30,75 Z" fill="#1e1b4b" stroke="#eab308" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Pages */}
          <path d="M32,64 L50,68 L68,64 L68,68 L50,72 L32,68 Z" fill="#fef3c7" />
          <path d="M50,68 L50,80" fill="none" stroke="#eab308" strokeWidth="1" />
          
          {/* Glowing Rune on Book */}
          <path d="M46,67 L54,67 L50,71 Z" fill="none" stroke="#eab308" strokeWidth="1" />
        </motion.g>

        {/* Magic sparks rising from book */}
        <motion.circle cx="40" cy="60" r="1.5" fill="#fde047" animate={{ y: [0, -20], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0 }} />
        <motion.circle cx="60" cy="55" r="2" fill="#fde047" animate={{ y: [0, -25], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} />
        <motion.circle cx="50" cy="50" r="1" fill="#fef08a" animate={{ y: [0, -15], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 1 }} />
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

    // Halo
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 8]);
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(ox + 50, oy + 25, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(ox + 50, oy + 25, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

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

    // Belly
    ctx.fillStyle = "#c7d2fe";
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 62, 22, 18, 0, 0, Math.PI * 2); ctx.fill();

    // Beard
    ctx.fillStyle = "#f8fafc"; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.moveTo(ox+35, oy+55); ctx.lineTo(ox+65, oy+55); ctx.lineTo(ox+50, oy+85); ctx.fill();
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath(); ctx.moveTo(ox+40, oy+55); ctx.lineTo(ox+60, oy+55); ctx.lineTo(ox+50, oy+75); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Wise Eyes (Almond shape)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.moveTo(ox+25, oy+42); ctx.quadraticCurveTo(ox+37, oy+35, ox+49, oy+42); ctx.quadraticCurveTo(ox+37, oy+49, ox+25, oy+42); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+51, oy+42); ctx.quadraticCurveTo(ox+63, oy+35, ox+75, oy+42); ctx.quadraticCurveTo(ox+63, oy+49, ox+51, oy+42); ctx.fill();

    // Pupils & Glow
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.arc(ox+37, oy+42, 4, 0, Math.PI*2); ctx.arc(ox+63, oy+42, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#eab308";
    ctx.beginPath(); ctx.arc(ox+37, oy+42, 2, 0, Math.PI*2); ctx.arc(ox+63, oy+42, 2, 0, Math.PI*2); ctx.fill();

    // Eyebrows
    ctx.strokeStyle = "#f8fafc"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(ox+22, oy+35); ctx.lineTo(ox+40, oy+40); ctx.lineTo(ox+45, oy+35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+78, oy+35); ctx.lineTo(ox+60, oy+40); ctx.lineTo(ox+55, oy+35); ctx.stroke();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.moveTo(ox+47, oy+49); ctx.lineTo(ox+53, oy+49); ctx.lineTo(ox+50, oy+54); ctx.fill();

    // Wings casting magic
    ctx.strokeStyle = "#4f46e5"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+50); ctx.quadraticCurveTo(ox+0, oy+35, ox+10, oy+20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+50); ctx.quadraticCurveTo(ox+100, oy+35, ox+90, oy+20); ctx.stroke();

    // Grimoire Glow
    ctx.fillStyle = "#eab308"; ctx.globalAlpha = 0.15; ctx.shadowColor = "#eab308"; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(ox+50, oy+70, 20, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1.0;

    // Grimoire Base
    ctx.fillStyle = "#1e1b4b"; ctx.strokeStyle = "#eab308"; ctx.lineWidth = 1.5; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(ox+30, oy+65); ctx.lineTo(ox+50, oy+70); ctx.lineTo(ox+70, oy+65); ctx.lineTo(ox+70, oy+75); ctx.lineTo(ox+50, oy+80); ctx.lineTo(ox+30, oy+75); ctx.closePath(); ctx.fill(); ctx.stroke();
    
    // Pages
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath(); ctx.moveTo(ox+32, oy+64); ctx.lineTo(ox+50, oy+68); ctx.lineTo(ox+68, oy+64); ctx.lineTo(ox+68, oy+68); ctx.lineTo(ox+50, oy+72); ctx.lineTo(ox+32, oy+68); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#eab308"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ox+50, oy+68); ctx.lineTo(ox+50, oy+80); ctx.stroke();

    // Rune
    ctx.beginPath(); ctx.moveTo(ox+46, oy+67); ctx.lineTo(ox+54, oy+67); ctx.lineTo(ox+50, oy+71); ctx.closePath(); ctx.stroke();

    // Sparks
    ctx.fillStyle = "#fde047";
    ctx.beginPath(); ctx.arc(ox+40, oy+50, 1.5, 0, Math.PI*2); ctx.arc(ox+60, oy+45, 2, 0, Math.PI*2); ctx.fill();

    ctx.restore();
  },
};
