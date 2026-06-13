import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day500Milestone: StreakMilestone = {
  id: "day500",
  isMatch: (s) => s >= 500,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="0 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(79,70,229,0.15)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        {/* Holographic orbital rings (Back) */}
        <motion.ellipse
          cx="50" cy="50" rx="45" ry="15"
          fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="6 4" opacity="0.4"
          animate={{ rotate: [0, 360], rx: [45, 40, 45], ry: [15, 20, 15] }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          style={{ transformOrigin: "50px 50px" }}
        />

        {/* Ears */}
        <polygon points="20,35 50,35 25,18" fill="#312e81" />
        <polygon points="50,35 80,35 75,18" fill="#312e81" />

        {/* Ear glowing tips */}
        <circle cx="25" cy="18" r="1.5" fill="#22d3ee" />
        <circle cx="75" cy="18" r="1.5" fill="#22d3ee" />

        {/* Plasma Thrusters (Replacing Feet) */}
        <motion.path
          d="M27,85 L37,85 L32,95 Z"
          fill="#22d3ee"
          opacity="0.8"
          animate={{ scaleY: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 0.4 }}
          style={{ transformOrigin: "32px 85px" }}
        />
        <motion.path
          d="M63,85 L73,85 L68,95 Z"
          fill="#22d3ee"
          opacity="0.8"
          animate={{ scaleY: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }}
          style={{ transformOrigin: "68px 85px" }}
        />

        {/* Thruster nozzles */}
        <ellipse cx="32" cy="85" rx="5" ry="2" fill="#94a3b8" />
        <ellipse cx="68" cy="85" rx="5" ry="2" fill="#94a3b8" />

        {/* Body (Darker, sleeker alloy) */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#1e1b4b" />
        {/* Armor plating lines */}
        <path d="M15,55 Q50,65 85,55" fill="none" stroke="#312e81" strokeWidth="2" />
        <path d="M30,22 L30,55 M70,22 L70,55" fill="none" stroke="#312e81" strokeWidth="2" />

        {/* Cyber Belly */}
        <ellipse cx="50" cy="65" rx="18" ry="14" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        {/* Core Reactor in Belly */}
        <motion.circle
          cx="50" cy="65" r="8"
          fill="#06b6d4"
          filter="blur(2px)"
          animate={{ r: [6, 8, 6], opacity: [0.5, 0.9, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
        <circle cx="50" cy="65" r="4" fill="#cffafe" />

        {/* Cyber Visor (Replaces eyes) */}
        <rect x="25" y="36" width="50" height="12" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
        {/* Glowing scanline in visor */}
        <motion.rect
          x="28" y="38" width="44" height="8" rx="2" fill="#ef4444"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ filter: "drop-shadow(0 0 4px rgba(239,68,68,0.8))" }}
        />
        {/* Moving Cylon/Knight Rider eye */}
        <motion.rect
          x="30" y="39" width="10" height="6" rx="1" fill="#fca5a5"
          animate={{ x: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        />

        {/* Beak (Metallic) */}
        <polygon points="47,49 53,49 50,55" fill="#94a3b8" />

        {/* Angular robotic wings */}
        <motion.path
          d="M15,55 L5,45 L10,35"
          fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          style={{ transformOrigin: "15px 55px" }}
        />
        <motion.path
          d="M85,55 L95,45 L90,35"
          fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
          animate={{ rotate: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
          style={{ transformOrigin: "85px 55px" }}
        />

        {/* Holographic orbital rings (Front) */}
        <motion.ellipse
          cx="50" cy="50" rx="45" ry="15"
          fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="10 5" opacity="0.8"
          animate={{ rotate: [0, 360], rx: [45, 40, 45], ry: [15, 20, 15] }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          style={{ transformOrigin: "50px 50px" }}
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

    const ox = 0;
    const oy = 0;

    // Orbital Rings (Back)
    ctx.strokeStyle = "#06b6d4"; ctx.lineWidth = 1; ctx.setLineDash([6, 4]); ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 50, 45, 15, 0, 0, Math.PI); ctx.stroke();
    ctx.globalAlpha = 1.0; ctx.setLineDash([]);

    // Ears
    ctx.fillStyle = "#312e81";
    ctx.beginPath(); ctx.moveTo(ox + 20, oy + 35); ctx.lineTo(ox + 50, oy + 35); ctx.lineTo(ox + 25, oy + 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox + 50, oy + 35); ctx.lineTo(ox + 80, oy + 35); ctx.lineTo(ox + 75, oy + 18); ctx.fill();

    // Ear tips
    ctx.fillStyle = "#22d3ee";
    ctx.beginPath(); ctx.arc(ox + 25, oy + 18, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 75, oy + 18, 1.5, 0, Math.PI * 2); ctx.fill();

    // Plasma Thrusters
    ctx.fillStyle = "#22d3ee"; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(ox + 27, oy + 85); ctx.lineTo(ox + 37, oy + 85); ctx.lineTo(ox + 32, oy + 98); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox + 63, oy + 85); ctx.lineTo(ox + 73, oy + 85); ctx.lineTo(ox + 68, oy + 98); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Thruster nozzles
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath(); ctx.ellipse(ox + 32, oy + 85, 5, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ox + 68, oy + 85, 5, 2, 0, 0, Math.PI * 2); ctx.fill();

    // Body
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    else ctx.rect(ox + 15, oy + 22, 70, 65);
    ctx.fill();

    // Armor plating lines
    ctx.strokeStyle = "#312e81"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox + 15, oy + 55); ctx.quadraticCurveTo(ox + 50, oy + 65, ox + 85, oy + 55); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox + 30, oy + 22); ctx.lineTo(ox + 30, oy + 55); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox + 70, oy + 22); ctx.lineTo(ox + 70, oy + 55); ctx.stroke();

    // Cyber Belly
    ctx.fillStyle = "#0f172a"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 65, 18, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Core Reactor
    ctx.fillStyle = "#06b6d4"; ctx.shadowColor = "#06b6d4"; ctx.shadowBlur = 4; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.arc(ox + 50, oy + 65, 7, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1.0;
    ctx.fillStyle = "#cffafe";
    ctx.beginPath(); ctx.arc(ox + 50, oy + 65, 4, 0, Math.PI * 2); ctx.fill();

    // Cyber Visor
    ctx.fillStyle = "#0f172a"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox + 25, oy + 36, 50, 12, 4);
    else ctx.rect(ox + 25, oy + 36, 50, 12);
    ctx.fill(); ctx.stroke();

    // Glowing scanline
    ctx.fillStyle = "#ef4444"; ctx.shadowColor = "#ef4444"; ctx.shadowBlur = 8;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox + 28, oy + 38, 44, 8, 2);
    else ctx.rect(ox + 28, oy + 38, 44, 8);
    ctx.fill();

    // Bright eye center
    ctx.fillStyle = "#fca5a5"; ctx.shadowBlur = 0;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox + 45, oy + 39, 10, 6, 1);
    else ctx.rect(ox + 45, oy + 39, 10, 6);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath(); ctx.moveTo(ox + 47, oy + 49); ctx.lineTo(ox + 53, oy + 49); ctx.lineTo(ox + 50, oy + 55); ctx.fill();

    // Robotic wings
    ctx.strokeStyle = "#334155"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(ox + 15, oy + 55); ctx.lineTo(ox + 5, oy + 45); ctx.lineTo(ox + 10, oy + 35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox + 85, oy + 55); ctx.lineTo(ox + 95, oy + 45); ctx.lineTo(ox + 90, oy + 35); ctx.stroke();

    // Orbital Rings (Front)
    ctx.strokeStyle = "#22d3ee"; ctx.lineWidth = 1.5; ctx.setLineDash([10, 5]); ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 50, 45, 15, 0, Math.PI, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1.0; ctx.setLineDash([]);

    ctx.restore();
  },
};
