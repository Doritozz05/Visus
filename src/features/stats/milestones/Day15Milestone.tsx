import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day15Milestone: StreakMilestone = {
  id: "day15",
  isMatch: (s) => s >= 15 && s < 30,
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
        animate={{ y: [8, 3, 8] }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
      >
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

        {/* Pupils */}
        <motion.circle
          cx="37"
          cy="42"
          r="5"
          fill="#1e1b4b"
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            repeatDelay: 2,
          }}
        />
        <motion.circle
          cx="63"
          cy="42"
          r="5"
          fill="#1e1b4b"
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            repeatDelay: 2,
          }}
        />

        {/* Highlights */}
        <circle cx="39" cy="40" r="1.5" fill="#ffffff" />
        <circle cx="65" cy="40" r="1.5" fill="#ffffff" />

        {/* Beak */}
        <polygon points="47,48 53,48 50,55" fill="#f97316" />

        {/* Day 15 Party Hat */}
        <polygon points="42,22 58,22 50,2" fill="#eab308" />
        <line x1="42" y1="22" x2="58" y2="22" stroke="#4f46e5" strokeWidth="1.5" />
        <line x1="45" y1="17" x2="55" y2="17" stroke="#3b82f6" strokeWidth="1.5" />
        <line x1="48" y1="12" x2="52" y2="12" stroke="#ef4444" strokeWidth="1.5" />
        <circle cx="50" cy="0" r="3" fill="#ef4444" />

        {/* Day 15 Neon Sunglasses */}
        <polygon points="20,38 48,38 38,48" fill="#ec4899" opacity="0.95" />
        <polygon points="52,38 80,38 62,48" fill="#ec4899" opacity="0.95" />
        <line
          x1="20"
          y1="38"
          x2="80"
          y2="38"
          stroke="#f472b6"
          strokeWidth="2"
        />
        <line
          x1="25"
          y1="40"
          x2="35"
          y2="40"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.8"
        />
        <line
          x1="57"
          y1="40"
          x2="67"
          y2="40"
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.8"
        />

        {/* Day 15 Left Wing raised in celebration (Waving Inward) */}
        <motion.path
          d="M15,55 Q8,38 15,28"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
          animate={{ rotate: [0, -20, 0, 10, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear"
          }}
          style={{ transformOrigin: "15px 55px" }}
        />

        {/* Day 15 Right Wing holding/celebrating the flame */}
        <path
          d="M85,55 Q95,65 100,55"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Day 15 Juggled Flame floating above wing */}
        <g transform="translate(86, 26)">
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.5"
            className="origin-bottom"
            animate={{
              y: [0, -6, 0],
              scale: [0.7, 0.75, 0.68, 0.7],
              rotate: [0, 4, -4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.0,
              ease: "easeInOut",
            }}
            style={{ filter: "drop-shadow(0 0 6px rgba(249,115,22,0.85))" }}
          />
        </g>

        {/* Sparkles around floating flame */}
        <motion.circle
          cx="82"
          cy="20"
          r="2"
          fill="#fbbf24"
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
        <motion.circle
          cx="106"
          cy="34"
          r="1.5"
          fill="#38bdf8"
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
        />
        <motion.circle
          cx="98"
          cy="16"
          r="2"
          fill="#ec4899"
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{ repeat: Infinity, duration: 1.8, delay: 0.6 }}
        />
      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    // Use local coordinates (origin at translated x, y)
    const ox = 0;
    const oy = 0;

    // Draw Ears
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    ctx.moveTo(ox + 20, oy + 35);
    ctx.lineTo(ox + 50, oy + 35);
    ctx.lineTo(ox + 25, oy + 18);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(ox + 50, oy + 35);
    ctx.lineTo(ox + 80, oy + 35);
    ctx.lineTo(ox + 75, oy + 18);
    ctx.closePath();
    ctx.fill();

    // Draw Feet
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.ellipse(ox + 32, oy + 86, 6, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(ox + 68, oy + 86, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw Body
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    } else {
      ctx.rect(ox + 15, oy + 22, 70, 65);
    }
    ctx.fill();

    // Draw Belly
    ctx.fillStyle = "#c7d2fe";
    ctx.beginPath();
    ctx.ellipse(ox + 50, oy + 62, 22, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2);
    ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2);
    ctx.fill();

    // Draw Pupils
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 42, 5, 0, Math.PI * 2);
    ctx.arc(ox + 63, oy + 42, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Highlights
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 39, oy + 40, 1.5, 0, Math.PI * 2);
    ctx.arc(ox + 65, oy + 40, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(ox + 47, oy + 48);
    ctx.lineTo(ox + 53, oy + 48);
    ctx.lineTo(ox + 50, oy + 55);
    ctx.closePath();
    ctx.fill();

    // Draw Wings (Waving Inward)
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    // Left wing
    ctx.beginPath();
    ctx.moveTo(ox + 15, oy + 55);
    ctx.quadraticCurveTo(ox + 8, oy + 38, ox + 15, oy + 28);
    ctx.stroke();

    // Right wing
    ctx.beginPath();
    ctx.moveTo(ox + 85, oy + 55);
    ctx.quadraticCurveTo(ox + 95, oy + 65, ox + 100, oy + 55);
    ctx.stroke();

    // Draw Neon Sunglasses
    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.moveTo(ox + 20, oy + 38);
    ctx.lineTo(ox + 48, oy + 38);
    ctx.lineTo(ox + 38, oy + 48);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(ox + 52, oy + 38);
    ctx.lineTo(ox + 80, oy + 38);
    ctx.lineTo(ox + 62, oy + 48);
    ctx.closePath();
    ctx.fill();

    // Bridge & Frame line
    ctx.strokeStyle = "#f472b6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox + 20, oy + 38);
    ctx.lineTo(ox + 80, oy + 38);
    ctx.stroke();

    // Glare line
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ox + 25, oy + 40);
    ctx.lineTo(ox + 35, oy + 40);
    ctx.moveTo(ox + 57, oy + 40);
    ctx.lineTo(ox + 67, oy + 40);
    ctx.stroke();

    // Draw Party Hat
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    ctx.moveTo(ox + 42, oy + 22);
    ctx.lineTo(ox + 58, oy + 22);
    ctx.lineTo(ox + 50, oy + 2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox + 42, oy + 22);
    ctx.lineTo(ox + 58, oy + 22);
    ctx.stroke();

    ctx.strokeStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(ox + 45, oy + 17);
    ctx.lineTo(ox + 55, oy + 17);
    ctx.stroke();

    ctx.strokeStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(ox + 48, oy + 12);
    ctx.lineTo(ox + 52, oy + 12);
    ctx.stroke();

    // Pompom
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(ox + 50, oy + 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw Juggled Flame floating
    ctx.save();
    ctx.translate(ox + 86, oy + 26);
    ctx.scale(0.7, 0.7);
    ctx.shadowColor = "rgba(249, 115, 22, 0.85)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#f97316";
    const flamePath = new Path2D(
      "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
    );
    ctx.fill(flamePath);
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.5;
    ctx.stroke(flamePath);
    ctx.restore();

    // Sparkles
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(ox + 82, oy + 20, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(ox + 106, oy + 34, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.arc(ox + 98, oy + 16, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
};
