import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day250Milestone: StreakMilestone = {
  id: "day250",
  isMatch: (s) => s >= 250 && s < 300,
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
        animate={{ y: [0, -2, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
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

        {/* Eyes outer white */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" />
        <circle cx="63" cy="42" r="12" fill="#ffffff" />

        {/* Happy closed-eye smile — ^^ arcs instead of pupils */}
        <path
          d="M32,42 Q37,36 42,42"
          fill="none"
          stroke="#1e1b4b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M58,42 Q63,36 68,42"
          fill="none"
          stroke="#1e1b4b"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Blush cheeks */}
        <ellipse cx="30" cy="48" rx="4" ry="2.5" fill="#fca5a5" opacity="0.5" />
        <ellipse cx="70" cy="48" rx="4" ry="2.5" fill="#fca5a5" opacity="0.5" />

        {/* U-shaped smile replacing beak */}
        <path
          d="M44,52 Q50,60 56,52"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Chef hat — tall white toque */}
        {/* Hat band (red) */}
        <rect x="30" y="19" width="40" height="5" rx="1" fill="#ef4444" />
        {/* Hat body (white rectangle) */}
        <rect x="32" y="4" width="36" height="16" rx="2" fill="#ffffff" />
        {/* Puffy top (circles forming the poofy crown) */}
        <circle cx="38" cy="5" r="7" fill="#ffffff" />
        <circle cx="50" cy="3" r="8" fill="#ffffff" />
        <circle cx="62" cy="5" r="7" fill="#ffffff" />

        {/* Left wing — extended holding spoon */}
        <path
          d="M15,55 Q6,50 0,58"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Spoon — line with small circle end */}
        <line
          x1="0"
          y1="58"
          x2="-2"
          y2="74"
          stroke="#9ca3af"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse cx="-2" cy="76" rx="3" ry="2" fill="#d1d5db" />

        {/* Right wing — resting */}
        <path
          d="M85,55 Q94,60 90,68"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Pot — half-circle bowl shape */}
        <path
          d="M-12,80 Q-12,96 12,96 Q12,80 12,80"
          fill="#6b7280"
          stroke="#4b5563"
          strokeWidth="1"
        />
        {/* Pot rim */}
        <rect x="-14" y="78" width="28" height="4" rx="1" fill="#9ca3af" />
        {/* Pot handles */}
        <rect x="-16" y="84" width="4" height="3" rx="1" fill="#9ca3af" />
        <rect x="12" y="84" width="4" height="3" rx="1" fill="#9ca3af" />

        {/* Flame inside the pot — heating it */}
        <g transform="translate(-6, 82)">
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.5"
            style={{
              filter: "drop-shadow(0 0 6px rgba(249,115,22,0.8))",
              transformOrigin: "12px 10px",
            }}
            animate={{
              scale: [0.45, 0.5, 0.42, 0.45],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
          />
        </g>

        {/* Floating letters — steam from pot */}
        <motion.text
          x="0"
          y="72"
          fontSize="7"
          fontWeight="bold"
          fill="#4f46e5"
          opacity="0.8"
          animate={{ y: [72, 60, 50], opacity: [0, 0.9, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
        >
          A
        </motion.text>
        <motion.text
          x="8"
          y="68"
          fontSize="6"
          fontWeight="bold"
          fill="#f97316"
          opacity="0.7"
          animate={{ y: [68, 54, 44], opacity: [0, 0.8, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeOut",
            delay: 0.8,
          }}
        >
          B
        </motion.text>
        <motion.text
          x="-6"
          y="70"
          fontSize="5"
          fontWeight="bold"
          fill="#eab308"
          opacity="0.7"
          animate={{ y: [70, 58, 46], opacity: [0, 0.7, 0] }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeOut",
            delay: 1.5,
          }}
        >
          Z
        </motion.text>

        {/* Steam wisps from pot */}
        <motion.path
          d="M-4,76 Q-2,72 0,76"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
          strokeLinecap="round"
          animate={{ y: [-4, -10], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
        />
        <motion.path
          d="M4,74 Q6,70 8,74"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          strokeLinecap="round"
          animate={{ y: [-4, -12], opacity: [0.4, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: "easeOut",
            delay: 0.5,
          }}
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

    // Feet
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.ellipse(ox + 32, oy + 86, 6, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(ox + 68, oy + 86, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    } else {
      ctx.rect(ox + 15, oy + 22, 70, 65);
    }
    ctx.fill();

    // Belly
    ctx.fillStyle = "#c7d2fe";
    ctx.beginPath();
    ctx.ellipse(ox + 50, oy + 62, 22, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes outer white
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2);
    ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2);
    ctx.fill();

    // Happy closed-eye smile — ^^ arcs
    ctx.strokeStyle = "#1e1b4b";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(ox + 32, oy + 42);
    ctx.quadraticCurveTo(ox + 37, oy + 36, ox + 42, oy + 42);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 58, oy + 42);
    ctx.quadraticCurveTo(ox + 63, oy + 36, ox + 68, oy + 42);
    ctx.stroke();

    // Blush cheeks
    ctx.fillStyle = "rgba(252, 165, 165, 0.5)";
    ctx.beginPath();
    ctx.ellipse(ox + 30, oy + 48, 4, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(ox + 70, oy + 48, 4, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // U-shaped smile replacing beak
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ox + 44, oy + 52);
    ctx.quadraticCurveTo(ox + 50, oy + 60, ox + 56, oy + 52);
    ctx.stroke();

    // Chef hat — tall white toque
    // Hat band (red)
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 30, oy + 19, 40, 5, 1);
    } else {
      ctx.rect(ox + 30, oy + 19, 40, 5);
    }
    ctx.fill();

    // Hat body (white rectangle)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 32, oy + 4, 36, 16, 2);
    } else {
      ctx.rect(ox + 32, oy + 4, 36, 16);
    }
    ctx.fill();

    // Puffy top (circles forming poofy crown)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 38, oy + 5, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ox + 50, oy + 3, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ox + 62, oy + 5, 7, 0, Math.PI * 2);
    ctx.fill();

    // Left wing — extended holding spoon
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(ox + 15, oy + 55);
    ctx.quadraticCurveTo(ox + 6, oy + 50, ox + 0, oy + 58);
    ctx.stroke();

    // Spoon — line with small circle end
    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ox + 0, oy + 58);
    ctx.lineTo(ox - 2, oy + 74);
    ctx.stroke();

    ctx.fillStyle = "#d1d5db";
    ctx.beginPath();
    ctx.ellipse(ox - 2, oy + 76, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right wing — resting
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(ox + 85, oy + 55);
    ctx.quadraticCurveTo(ox + 94, oy + 60, ox + 90, oy + 68);
    ctx.stroke();

    // Pot — half-circle bowl shape
    ctx.fillStyle = "#6b7280";
    ctx.strokeStyle = "#4b5563";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ox - 12, oy + 80);
    ctx.quadraticCurveTo(ox - 12, oy + 96, ox + 12, oy + 96);
    ctx.quadraticCurveTo(ox + 12, oy + 80, ox + 12, oy + 80);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Pot rim
    ctx.fillStyle = "#9ca3af";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox - 14, oy + 78, 28, 4, 1);
    } else {
      ctx.rect(ox - 14, oy + 78, 28, 4);
    }
    ctx.fill();

    // Pot handles
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox - 16, oy + 84, 4, 3, 1);
    } else {
      ctx.rect(ox - 16, oy + 84, 4, 3);
    }
    ctx.fill();
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 12, oy + 84, 4, 3, 1);
    } else {
      ctx.rect(ox + 12, oy + 84, 4, 3);
    }
    ctx.fill();

    // Flame inside the pot — heating it
    ctx.save();
    ctx.translate(ox - 6, oy + 82);
    ctx.scale(0.45, 0.45);
    ctx.shadowColor = "rgba(249, 115, 22, 0.8)";
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

    // Floating letters — steam from pot
    ctx.font = "bold 7px sans-serif";
    ctx.fillStyle = "#4f46e5";
    ctx.globalAlpha = 0.7;
    ctx.fillText("A", ox + 0, oy + 64);

    ctx.font = "bold 6px sans-serif";
    ctx.fillStyle = "#f97316";
    ctx.globalAlpha = 0.6;
    ctx.fillText("B", ox + 8, oy + 58);

    ctx.font = "bold 5px sans-serif";
    ctx.fillStyle = "#eab308";
    ctx.globalAlpha = 0.5;
    ctx.fillText("Z", ox - 6, oy + 60);

    ctx.globalAlpha = 1;

    // Steam wisps from pot
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ox - 4, oy + 72);
    ctx.quadraticCurveTo(ox - 2, oy + 68, ox + 0, oy + 72);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 4, oy + 70);
    ctx.quadraticCurveTo(ox + 6, oy + 66, ox + 8, oy + 70);
    ctx.stroke();

    ctx.restore();
  },
};
