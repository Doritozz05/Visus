import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day100Milestone: StreakMilestone = {
  id: "day100",
  isMatch: (s) => s >= 100 && s < 150,
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
        animate={{ y: [0, -1.5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      >
        {/* Throne behind Visi */}
        <rect x="22" y="60" width="56" height="32" rx="3" fill="#7c2d12" />
        <rect x="22" y="56" width="56" height="8" rx="2" fill="#92400e" />
        {/* Throne back */}
        <rect x="26" y="30" width="48" height="30" rx="4" fill="#7c2d12" />
        <rect x="30" y="34" width="40" height="22" rx="2" fill="#92400e" />
        {/* Throne armrests */}
        <rect x="14" y="56" width="12" height="20" rx="3" fill="#92400e" />
        <rect x="74" y="56" width="12" height="20" rx="3" fill="#92400e" />
        {/* Throne gold trim */}
        <line x1="22" y1="56" x2="78" y2="56" stroke="#eab308" strokeWidth="1.5" />
        <line x1="26" y1="30" x2="74" y2="30" stroke="#eab308" strokeWidth="1" />
        <circle cx="50" cy="44" r="3" fill="#eab308" opacity="0.6" />

        {/* Cape — flows behind and below body */}
        <motion.path
          d="M25,40 Q20,65 12,92 Q50,98 88,92 Q80,65 75,40"
          fill="#dc2626"
          opacity="0.9"
          animate={{ d: [
            "M25,40 Q20,65 12,92 Q50,98 88,92 Q80,65 75,40",
            "M25,40 Q18,65 10,94 Q50,100 90,94 Q82,65 75,40",
            "M25,40 Q20,65 12,92 Q50,98 88,92 Q80,65 75,40",
          ] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
        {/* Cape gold trim border */}
        <motion.path
          d="M12,92 Q50,98 88,92"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          animate={{ d: [
            "M12,92 Q50,98 88,92",
            "M10,94 Q50,100 90,94",
            "M12,92 Q50,98 88,92",
          ] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />

        {/* Fire trail particles behind cape */}
        <motion.circle
          cx="18" cy="88" r="2"
          fill="#f97316" opacity="0.7"
          animate={{ y: [0, -4, 0], opacity: [0.7, 0.3, 0.7], scale: [1, 0.6, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
        <motion.circle
          cx="82" cy="86" r="1.5"
          fill="#fb923c" opacity="0.6"
          animate={{ y: [0, -5, 0], opacity: [0.6, 0.2, 0.6], scale: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.circle
          cx="25" cy="92" r="1.5"
          fill="#fbbf24" opacity="0.5"
          animate={{ y: [0, -6, 0], opacity: [0.5, 0.1, 0.5], scale: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.6 }}
        />
        <motion.circle
          cx="75" cy="90" r="2"
          fill="#f97316" opacity="0.6"
          animate={{ y: [0, -5, 0], opacity: [0.6, 0.2, 0.6], scale: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay: 0.9 }}
        />

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

        {/* Eyes Outer White */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" />
        <circle cx="63" cy="42" r="12" fill="#ffffff" />

        {/* Pupils — confident squint (smaller, higher) */}
        <motion.circle
          cx="37" cy="40" r="3" fill="#1e1b4b"
          animate={{ scaleY: [1, 1, 0.15, 1] }}
          transition={{ repeat: Infinity, duration: 4, repeatDelay: 3 }}
        />
        <motion.circle
          cx="63" cy="40" r="3" fill="#1e1b4b"
          animate={{ scaleY: [1, 1, 0.15, 1] }}
          transition={{ repeat: Infinity, duration: 4, repeatDelay: 3 }}
        />

        {/* Squint eyelids — half-closed confident look */}
        <rect x="25" y="34" width="24" height="6" rx="3" fill="#4f46e5" opacity="0.6" />
        <rect x="51" y="34" width="24" height="6" rx="3" fill="#4f46e5" opacity="0.6" />

        {/* Highlights */}
        <circle cx="39" cy="39" r="1" fill="#ffffff" />
        <circle cx="65" cy="39" r="1" fill="#ffffff" />

        {/* Beak */}
        <polygon points="47,49 53,49 50,55" fill="#f97316" />

        {/* Wings — regal resting pose */}
        <path
          d="M15,55 Q5,50 8,40"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M85,55 Q95,50 92,40"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Flame Crown — three flames arranged in crown shape */}
        {/* Center flame (largest) */}
        <g transform="translate(43, -2) scale(0.7)">
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.5"
            style={{ filter: "drop-shadow(0 0 4px rgba(249,115,22,0.8))", transformOrigin: "12px 14px" }}
            animate={{ scale: [1, 1.08, 0.95, 1], rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </g>
        {/* Left flame (smaller) */}
        <g transform="translate(28, 4) scale(0.5)">
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.5"
            style={{ filter: "drop-shadow(0 0 3px rgba(249,115,22,0.8))", transformOrigin: "12px 14px" }}
            animate={{ scale: [0.9, 1, 0.85, 0.9], rotate: [0, -3, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut", delay: 0.2 }}
          />
        </g>
        {/* Right flame (smaller) */}
        <g transform="translate(60, 4) scale(0.5)">
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.5"
            style={{ filter: "drop-shadow(0 0 3px rgba(249,115,22,0.8))", transformOrigin: "12px 14px" }}
            animate={{ scale: [0.9, 1, 0.85, 0.9], rotate: [0, 3, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut", delay: 0.4 }}
          />
        </g>

        {/* Crown base band */}
        <rect x="28" y="20" width="44" height="4" rx="2" fill="#eab308" />
        {/* Crown jewels */}
        <circle cx="40" cy="22" r="1.5" fill="#dc2626" />
        <circle cx="50" cy="22" r="2" fill="#7c3aed" />
        <circle cx="60" cy="22" r="1.5" fill="#dc2626" />
        {/* Crown points */}
        <polygon points="32,20 36,14 40,20" fill="#eab308" />
        <polygon points="46,20 50,12 54,20" fill="#eab308" />
        <polygon points="60,20 64,14 68,20" fill="#eab308" />
      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    const ox = 0;
    const oy = 0;

    // Throne behind Visi
    ctx.fillStyle = "#7c2d12";
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(ox + 22, oy + 60, 56, 32, 3); } else { ctx.rect(ox + 22, oy + 60, 56, 32); }
    ctx.fill();

    ctx.fillStyle = "#92400e";
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(ox + 22, oy + 56, 56, 8, 2); } else { ctx.rect(ox + 22, oy + 56, 56, 8); }
    ctx.fill();

    // Throne back
    ctx.fillStyle = "#7c2d12";
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(ox + 26, oy + 30, 48, 30, 4); } else { ctx.rect(ox + 26, oy + 30, 48, 30); }
    ctx.fill();

    ctx.fillStyle = "#92400e";
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(ox + 30, oy + 34, 40, 22, 2); } else { ctx.rect(ox + 30, oy + 34, 40, 22); }
    ctx.fill();

    // Throne armrests
    ctx.fillStyle = "#92400e";
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(ox + 14, oy + 56, 12, 20, 3); } else { ctx.rect(ox + 14, oy + 56, 12, 20); }
    ctx.fill();
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(ox + 74, oy + 56, 12, 20, 3); } else { ctx.rect(ox + 74, oy + 56, 12, 20); }
    ctx.fill();

    // Throne gold trim
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox + 22, oy + 56);
    ctx.lineTo(ox + 78, oy + 56);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ox + 26, oy + 30);
    ctx.lineTo(ox + 74, oy + 30);
    ctx.stroke();

    ctx.fillStyle = "rgba(234, 179, 8, 0.6)";
    ctx.beginPath();
    ctx.arc(ox + 50, oy + 44, 3, 0, Math.PI * 2);
    ctx.fill();

    // Cape
    ctx.fillStyle = "#dc2626";
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(ox + 25, oy + 40);
    ctx.quadraticCurveTo(ox + 20, oy + 65, ox + 12, oy + 92);
    ctx.quadraticCurveTo(ox + 50, oy + 98, ox + 88, oy + 92);
    ctx.quadraticCurveTo(ox + 80, oy + 65, ox + 75, oy + 40);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Cape gold trim
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox + 12, oy + 92);
    ctx.quadraticCurveTo(ox + 50, oy + 98, ox + 88, oy + 92);
    ctx.stroke();

    // Fire trail particles
    ctx.fillStyle = "#f97316";
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(ox + 18, oy + 88, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fb923c";
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(ox + 82, oy + 86, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fbbf24";
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(ox + 25, oy + 92, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f97316";
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(ox + 75, oy + 90, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;

    // Ears
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    ctx.moveTo(ox + 20, oy + 35); ctx.lineTo(ox + 50, oy + 35); ctx.lineTo(ox + 25, oy + 18); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(ox + 50, oy + 35); ctx.lineTo(ox + 80, oy + 35); ctx.lineTo(ox + 75, oy + 18); ctx.closePath(); ctx.fill();

    // Feet
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.ellipse(ox + 32, oy + 86, 6, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(ox + 68, oy + 86, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(ox + 15, oy + 22, 70, 65, 30); } else { ctx.rect(ox + 15, oy + 22, 70, 65); }
    ctx.fill();

    // Belly
    ctx.fillStyle = "#c7d2fe";
    ctx.beginPath();
    ctx.ellipse(ox + 50, oy + 62, 22, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2);
    ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2);
    ctx.fill();

    // Pupils — confident squint (smaller, higher)
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 40, 3, 0, Math.PI * 2);
    ctx.arc(ox + 63, oy + 40, 3, 0, Math.PI * 2);
    ctx.fill();

    // Squint eyelids
    ctx.fillStyle = "rgba(79, 70, 229, 0.6)";
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(ox + 25, oy + 34, 24, 6, 3); } else { ctx.rect(ox + 25, oy + 34, 24, 6); }
    ctx.fill();
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(ox + 51, oy + 34, 24, 6, 3); } else { ctx.rect(ox + 51, oy + 34, 24, 6); }
    ctx.fill();

    // Highlights
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 39, oy + 39, 1, 0, Math.PI * 2);
    ctx.arc(ox + 65, oy + 39, 1, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(ox + 47, oy + 49); ctx.lineTo(ox + 53, oy + 49); ctx.lineTo(ox + 50, oy + 55); ctx.closePath(); ctx.fill();

    // Wings — regal resting pose
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(ox + 15, oy + 55);
    ctx.quadraticCurveTo(ox + 5, oy + 50, ox + 8, oy + 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 85, oy + 55);
    ctx.quadraticCurveTo(ox + 95, oy + 50, ox + 92, oy + 40);
    ctx.stroke();

    // Crown base band
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(ox + 28, oy + 20, 44, 4, 2); } else { ctx.rect(ox + 28, oy + 20, 44, 4); }
    ctx.fill();

    // Crown points
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    ctx.moveTo(ox + 32, oy + 20); ctx.lineTo(ox + 36, oy + 14); ctx.lineTo(ox + 40, oy + 20); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(ox + 46, oy + 20); ctx.lineTo(ox + 50, oy + 12); ctx.lineTo(ox + 54, oy + 20); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(ox + 60, oy + 20); ctx.lineTo(ox + 64, oy + 14); ctx.lineTo(ox + 68, oy + 20); ctx.closePath(); ctx.fill();

    // Crown jewels
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(ox + 40, oy + 22, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#7c3aed";
    ctx.beginPath();
    ctx.arc(ox + 50, oy + 22, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(ox + 60, oy + 22, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Flame Crown — three flames
    const flamePath = new Path2D(
      "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
    );

    // Center flame (largest)
    ctx.save();
    ctx.translate(ox + 43, oy - 2);
    ctx.scale(0.7, 0.7);
    ctx.shadowColor = "rgba(249, 115, 22, 0.8)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#f97316";
    ctx.fill(flamePath);
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.5;
    ctx.stroke(flamePath);
    ctx.restore();

    // Left flame (smaller)
    ctx.save();
    ctx.translate(ox + 28, oy + 4);
    ctx.scale(0.5, 0.5);
    ctx.shadowColor = "rgba(249, 115, 22, 0.8)";
    ctx.shadowBlur = 6;
    ctx.fillStyle = "#f97316";
    ctx.fill(flamePath);
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.5;
    ctx.stroke(flamePath);
    ctx.restore();

    // Right flame (smaller)
    ctx.save();
    ctx.translate(ox + 60, oy + 4);
    ctx.scale(0.5, 0.5);
    ctx.shadowColor = "rgba(249, 115, 22, 0.8)";
    ctx.shadowBlur = 6;
    ctx.fillStyle = "#f97316";
    ctx.fill(flamePath);
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.5;
    ctx.stroke(flamePath);
    ctx.restore();

    ctx.restore();
  },
};
