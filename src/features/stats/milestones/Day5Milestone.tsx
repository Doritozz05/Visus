import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day5Milestone: StreakMilestone = {
  id: "day5",
  isMatch: (s) => s >= 5 && s < 15,
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
        animate={{ y: [0, -3, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2.2,
          ease: "easeInOut",
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
        <polygon points="47,49 53,49 50,55" fill="#f97316" />

        {/* Day 5 Glasses */}
        <circle
          cx="37"
          cy="42"
          r="13.5"
          fill="none"
          stroke="#eab308"
          strokeWidth="2"
        />
        <circle
          cx="63"
          cy="42"
          r="13.5"
          fill="none"
          stroke="#eab308"
          strokeWidth="2"
        />
        <path
          d="M49.5,42 L50.5,42"
          fill="none"
          stroke="#eab308"
          strokeWidth="2"
        />

        {/* Day 5 Wings: hugging fire */}
        <path
          d="M15,55 Q28,62 38,58"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M85,55 Q72,62 62,58"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Fire held on chest between wings */}
        <g transform="translate(38, 42)">
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.5"
            style={{
              filter: "drop-shadow(0 0 8px rgba(249,115,22,0.8))",
              transformOrigin: "12px 18px"
            }}
            animate={{
              scale: [1.1, 1.15, 1.05, 1.1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </g>
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

    // Draw Body (rounded rect)
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

    // Draw Glasses (Gold)
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 42, 13.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ox + 63, oy + 42, 13.5, 0, Math.PI * 2);
    ctx.stroke();

    // Bridge
    ctx.beginPath();
    ctx.moveTo(ox + 49.5, oy + 42);
    ctx.lineTo(ox + 50.5, oy + 42);
    ctx.stroke();

    // Draw Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(ox + 47, oy + 49);
    ctx.lineTo(ox + 53, oy + 49);
    ctx.lineTo(ox + 50, oy + 55);
    ctx.closePath();
    ctx.fill();

    // Draw Wings
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ox + 15, oy + 55);
    ctx.quadraticCurveTo(ox + 28, oy + 62, ox + 38, oy + 58);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 85, oy + 55);
    ctx.quadraticCurveTo(ox + 72, oy + 62, ox + 62, oy + 58);
    ctx.stroke();

    // Draw Flame on chest
    ctx.save();
    ctx.translate(ox + 38, oy + 42);
    ctx.scale(1.1, 1.1);
    ctx.shadowColor = "rgba(249, 115, 22, 0.8)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#f97316";
    const flamePath = new Path2D(
      "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
    );
    ctx.fill(flamePath);
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.5;
    ctx.stroke(flamePath);
    ctx.restore();

    ctx.restore();
  }
};
