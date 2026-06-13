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
      {/* Matrix-style falling digital rain */}
      {[14, 26, 38, 62, 74, 86, 98].map((cx, i) => (
        <React.Fragment key={`rain-${i}`}>
          {[0, 12, 24, 36, 48, 60, 72, 84].map((baseY, j) => (
            <motion.circle
              key={`dot-${i}-${j}`}
              cx={cx}
              cy={baseY}
              r="1"
              fill="#22d3ee"
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: (i * 0.3 + j * 0.18) % 2.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </React.Fragment>
      ))}

      <motion.g
        animate={{ y: [0, -1.5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      >
        {/* Ears */}
        <polygon points="20,35 50,35 25,18" fill="#4f46e5" />
        <polygon points="50,35 80,35 75,18" fill="#4f46e5" />

        {/* Antenna on left ear */}
        <line
          x1="30"
          y1="18"
          x2="30"
          y2="6"
          stroke="#94a3b8"
          strokeWidth="1"
        />
        <motion.circle
          cx="30"
          cy="5"
          r="2"
          fill="#22d3ee"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
        />

        {/* Feet */}
        <ellipse cx="32" cy="86" rx="6" ry="4" fill="#f97316" />
        <ellipse cx="68" cy="86" rx="6" ry="4" fill="#f97316" />

        {/* Body — left half normal, right half metallic */}
        <defs>
          <clipPath id="body-left">
            <rect x="15" y="22" width="35" height="65" />
          </clipPath>
          <clipPath id="body-right">
            <rect x="50" y="22" width="35" height="65" />
          </clipPath>
        </defs>
        <rect
          x="15"
          y="22"
          width="70"
          height="65"
          rx="30"
          fill="#4f46e5"
          clipPath="url(#body-left)"
        />
        <rect
          x="15"
          y="22"
          width="70"
          height="65"
          rx="30"
          fill="#6366f1"
          clipPath="url(#body-right)"
        />

        {/* Circuit patterns on right half of body */}
        <g clipPath="url(#body-right)">
          {/* Horizontal circuit lines */}
          <line
            x1="54"
            y1="35"
            x2="72"
            y2="35"
            stroke="#94a3b8"
            strokeWidth="0.6"
            opacity="0.7"
          />
          <line
            x1="72"
            y1="35"
            x2="72"
            y2="45"
            stroke="#94a3b8"
            strokeWidth="0.6"
            opacity="0.7"
          />
          <line
            x1="56"
            y1="55"
            x2="68"
            y2="55"
            stroke="#94a3b8"
            strokeWidth="0.6"
            opacity="0.7"
          />
          <line
            x1="68"
            y1="55"
            x2="68"
            y2="65"
            stroke="#94a3b8"
            strokeWidth="0.6"
            opacity="0.7"
          />
          <line
            x1="60"
            y1="65"
            x2="75"
            y2="65"
            stroke="#94a3b8"
            strokeWidth="0.6"
            opacity="0.7"
          />
          <line
            x1="60"
            y1="65"
            x2="60"
            y2="75"
            stroke="#94a3b8"
            strokeWidth="0.6"
            opacity="0.7"
          />
          {/* Junction dots */}
          <circle cx="72" cy="35" r="1" fill="#94a3b8" opacity="0.8" />
          <circle cx="72" cy="45" r="1" fill="#94a3b8" opacity="0.8" />
          <circle cx="68" cy="55" r="1" fill="#94a3b8" opacity="0.8" />
          <circle cx="68" cy="65" r="1" fill="#94a3b8" opacity="0.8" />
          <circle cx="60" cy="65" r="1" fill="#94a3b8" opacity="0.8" />
          <circle cx="60" cy="75" r="1" fill="#94a3b8" opacity="0.8" />
        </g>

        {/* Belly */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#c7d2fe" />

        {/* Left eye — normal */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" />
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
        <circle cx="39" cy="40" r="1.5" fill="#ffffff" />

        {/* Left eye targeting reticle overlay */}
        <line
          x1="37"
          y1="35"
          x2="37"
          y2="38"
          stroke="#22d3ee"
          strokeWidth="0.4"
          opacity="0.6"
        />
        <line
          x1="37"
          y1="46"
          x2="37"
          y2="49"
          stroke="#22d3ee"
          strokeWidth="0.4"
          opacity="0.6"
        />
        <line
          x1="30"
          y1="42"
          x2="33"
          y2="42"
          stroke="#22d3ee"
          strokeWidth="0.4"
          opacity="0.6"
        />
        <line
          x1="41"
          y1="42"
          x2="44"
          y2="42"
          stroke="#22d3ee"
          strokeWidth="0.4"
          opacity="0.6"
        />

        {/* Right eye — robotic red lens */}
        <circle cx="63" cy="42" r="12" fill="#1a1a2e" />
        <circle
          cx="63"
          cy="42"
          r="10"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.5"
        />
        <circle
          cx="63"
          cy="42"
          r="6"
          fill="none"
          stroke="#dc2626"
          strokeWidth="1"
        />
        <circle cx="63" cy="42" r="3" fill="#dc2626" />
        <motion.circle
          cx="63"
          cy="42"
          r="1.5"
          fill="#ffffff"
          animate={{ opacity: [0.6, 1, 0.6], r: [1.5, 2, 1.5] as never[] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        />
        {/* Red glow ring pulsing */}
        <motion.circle
          cx="63"
          cy="42"
          r="11"
          fill="none"
          stroke="#ef4444"
          strokeWidth="0.5"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut",
          }}
          style={{ filter: "drop-shadow(0 0 3px rgba(239,68,68,0.8))" }}
        />

        {/* Beak */}
        <polygon points="47,49 53,49 50,55" fill="#f97316" />

        {/* Angular robotic wings — left */}
        <path
          d="M15,55 L8,50 L4,40 L8,32"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Angular robotic wings — right */}
        <path
          d="M85,55 L92,50 L96,40 L92,32"
          fill="none"
          stroke="#6366f1"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Digital flame — cyan/teal digital fire */}
        <g transform="translate(42, 42)">
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#06b6d4"
            stroke="#22d3ee"
            strokeWidth="0.5"
            style={{
              filter: "drop-shadow(0 0 6px rgba(6,182,212,0.8))",
              transformOrigin: "12px 18px",
            }}
            animate={{
              scale: [0.85, 0.92, 0.8, 0.85],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </g>

        {/* Pixelated flame accents — small squares around the flame */}
        <motion.rect
          x="44"
          y="44"
          width="2"
          height="2"
          fill="#06b6d4"
          opacity="0.7"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
        />
        <motion.rect
          x="58"
          y="46"
          width="2"
          height="2"
          fill="#22d3ee"
          opacity="0.6"
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: 0.5 }}
        />
        <motion.rect
          x="48"
          y="40"
          width="1.5"
          height="1.5"
          fill="#67e8f9"
          opacity="0.5"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 1.0, delay: 0.8 }}
        />
        <motion.rect
          x="56"
          y="42"
          width="1.5"
          height="1.5"
          fill="#06b6d4"
          opacity="0.5"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.3, delay: 0.3 }}
        />
      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    const ox = 0;
    const oy = 0;

    // Matrix-style falling digital rain (static snapshot)
    ctx.fillStyle = "#22d3ee";
    const rainColumns = [14, 26, 38, 62, 74, 86, 98];
    const rainRows = [0, 12, 24, 36, 48, 60, 72, 84];
    rainColumns.forEach((cx, i) => {
      rainRows.forEach((_cy, j) => {
        // Staggered visibility — show roughly half the dots for static look
        if ((i + j) % 3 === 0) {
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(cx, _cy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });
    ctx.globalAlpha = 1;

    // Ears
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

    // Antenna on left ear
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ox + 30, oy + 18);
    ctx.lineTo(ox + 30, oy + 6);
    ctx.stroke();

    ctx.fillStyle = "#22d3ee";
    ctx.beginPath();
    ctx.arc(ox + 30, oy + 5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Feet
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.ellipse(ox + 32, oy + 86, 6, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(ox + 68, oy + 86, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body — left half (normal #4f46e5)
    ctx.save();
    ctx.beginPath();
    ctx.rect(ox + 15, oy + 22, 35, 65);
    ctx.clip();
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    } else {
      ctx.rect(ox + 15, oy + 22, 70, 65);
    }
    ctx.fill();
    ctx.restore();

    // Body — right half (metallic #6366f1)
    ctx.save();
    ctx.beginPath();
    ctx.rect(ox + 50, oy + 22, 35, 65);
    ctx.clip();
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    } else {
      ctx.rect(ox + 15, oy + 22, 70, 65);
    }
    ctx.fill();

    // Circuit patterns on right half
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = 0.7;

    // Horizontal + vertical circuit lines
    ctx.beginPath();
    ctx.moveTo(ox + 54, oy + 35);
    ctx.lineTo(ox + 72, oy + 35);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 72, oy + 35);
    ctx.lineTo(ox + 72, oy + 45);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 56, oy + 55);
    ctx.lineTo(ox + 68, oy + 55);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 68, oy + 55);
    ctx.lineTo(ox + 68, oy + 65);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 60, oy + 65);
    ctx.lineTo(ox + 75, oy + 65);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 60, oy + 65);
    ctx.lineTo(ox + 60, oy + 75);
    ctx.stroke();

    // Junction dots
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#94a3b8";
    const junctions = [
      [72, 35],
      [72, 45],
      [68, 55],
      [68, 65],
      [60, 65],
      [60, 75],
    ];
    junctions.forEach(([jx, jy]) => {
      ctx.beginPath();
      ctx.arc(ox + jx, oy + jy, 1, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.restore();

    // Belly
    ctx.fillStyle = "#c7d2fe";
    ctx.beginPath();
    ctx.ellipse(ox + 50, oy + 62, 22, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Left eye — normal white
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2);
    ctx.fill();

    // Left pupil
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 42, 5, 0, Math.PI * 2);
    ctx.fill();

    // Left highlight
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 39, oy + 40, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Left eye targeting reticle
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 0.4;
    ctx.globalAlpha = 0.6;

    ctx.beginPath();
    ctx.moveTo(ox + 37, oy + 35);
    ctx.lineTo(ox + 37, oy + 38);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 37, oy + 46);
    ctx.lineTo(ox + 37, oy + 49);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 30, oy + 42);
    ctx.lineTo(ox + 33, oy + 42);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 41, oy + 42);
    ctx.lineTo(ox + 44, oy + 42);
    ctx.stroke();

    ctx.globalAlpha = 1;

    // Right eye — robotic red lens
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2);
    ctx.fill();

    // Outer red ring
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ox + 63, oy + 42, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Middle red ring
    ctx.strokeStyle = "#dc2626";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ox + 63, oy + 42, 6, 0, Math.PI * 2);
    ctx.stroke();

    // Inner red fill
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(ox + 63, oy + 42, 3, 0, Math.PI * 2);
    ctx.fill();

    // Center bright dot
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 63, oy + 42, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Red glow ring
    ctx.save();
    ctx.shadowColor = "rgba(239, 68, 68, 0.8)";
    ctx.shadowBlur = 6;
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(ox + 63, oy + 42, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(ox + 47, oy + 49);
    ctx.lineTo(ox + 53, oy + 49);
    ctx.lineTo(ox + 50, oy + 55);
    ctx.closePath();
    ctx.fill();

    // Angular robotic wings — left
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(ox + 15, oy + 55);
    ctx.lineTo(ox + 8, oy + 50);
    ctx.lineTo(ox + 4, oy + 40);
    ctx.lineTo(ox + 8, oy + 32);
    ctx.stroke();

    // Angular robotic wings — right
    ctx.strokeStyle = "#6366f1";
    ctx.beginPath();
    ctx.moveTo(ox + 85, oy + 55);
    ctx.lineTo(ox + 92, oy + 50);
    ctx.lineTo(ox + 96, oy + 40);
    ctx.lineTo(ox + 92, oy + 32);
    ctx.stroke();

    // Digital flame — cyan/teal
    ctx.save();
    ctx.translate(ox + 42, oy + 42);
    ctx.scale(0.85, 0.85);
    ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#06b6d4";
    const flamePath = new Path2D(
      "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
    );
    ctx.fill(flamePath);
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 0.5;
    ctx.stroke(flamePath);
    ctx.restore();

    // Pixelated flame accents
    ctx.fillStyle = "#06b6d4";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(ox + 44, oy + 44, 2, 2);

    ctx.fillStyle = "#22d3ee";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(ox + 58, oy + 46, 2, 2);

    ctx.fillStyle = "#67e8f9";
    ctx.globalAlpha = 0.4;
    ctx.fillRect(ox + 48, oy + 40, 1.5, 1.5);

    ctx.fillStyle = "#06b6d4";
    ctx.globalAlpha = 0.5;
    ctx.fillRect(ox + 56, oy + 42, 1.5, 1.5);

    ctx.globalAlpha = 1;

    ctx.restore();
  },
};
