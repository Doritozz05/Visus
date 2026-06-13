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
        {/* Cape wings — folded behind body, drawn first */}
        <path
          d="M20,45 Q10,60 14,88 Q20,82 25,85 Q22,65 24,50"
          fill="#312e81"
          stroke="#4f46e5"
          strokeWidth="1"
          opacity="0.8"
        />
        <path
          d="M80,45 Q90,60 86,88 Q80,82 75,85 Q78,65 76,50"
          fill="#312e81"
          stroke="#4f46e5"
          strokeWidth="1"
          opacity="0.8"
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

        {/* Eyes outer white */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" />
        <circle cx="63" cy="42" r="12" fill="#ffffff" />

        {/* Half-closed eyelids — wise/sleepy look */}
        <rect x="25" y="32" width="24" height="7" fill="#4f46e5" rx="2" />
        <rect x="51" y="32" width="24" height="7" fill="#4f46e5" rx="2" />

        {/* Pupils — half-height ellipses (wise expression) */}
        <motion.ellipse
          cx="37"
          cy="44"
          rx="5"
          ry="3"
          fill="#1e1b4b"
          animate={{ scaleY: [1, 1, 0.3, 1] }}
          transition={{
            repeat: Infinity,
            duration: 5,
            repeatDelay: 4,
          }}
        />
        <motion.ellipse
          cx="63"
          cy="44"
          rx="5"
          ry="3"
          fill="#1e1b4b"
          animate={{ scaleY: [1, 1, 0.3, 1] }}
          transition={{
            repeat: Infinity,
            duration: 5,
            repeatDelay: 4,
          }}
        />

        {/* Highlights */}
        <circle cx="39" cy="43" r="1.5" fill="#ffffff" />
        <circle cx="65" cy="43" r="1.5" fill="#ffffff" />

        {/* Monocle — right eye */}
        <circle
          cx="63"
          cy="42"
          r="10"
          fill="none"
          stroke="#eab308"
          strokeWidth="1.5"
        />
        <circle
          cx="63"
          cy="42"
          r="11.5"
          fill="none"
          stroke="#eab308"
          strokeWidth="0.5"
          opacity="0.5"
        />
        {/* Monocle chain */}
        <path
          d="M63,52 Q60,58 58,66 Q56,72 52,76"
          fill="none"
          stroke="#eab308"
          strokeWidth="0.8"
          strokeDasharray="1.5,1.5"
        />
        {/* Monocle glint */}
        <circle cx="59" cy="38" r="1" fill="#fef3c7" opacity="0.8" />

        {/* Beak */}
        <polygon points="47,49 53,49 50,55" fill="#f97316" />

        {/* Graduation mortarboard cap */}
        {/* Board — rotated 45° square */}
        <rect
          x="33"
          y="11"
          width="34"
          height="6"
          rx="1"
          fill="#1e1b4b"
        />
        {/* Cap top surface */}
        <polygon points="30,14 50,8 70,14 50,20" fill="#1e1b4b" />
        {/* Cap band */}
        <rect x="38" y="19" width="24" height="4" rx="1" fill="#1e1b4b" />
        {/* Tassel string */}
        <line
          x1="50"
          y1="14"
          x2="30"
          y2="14"
          stroke="#eab308"
          strokeWidth="0.8"
        />
        <motion.g
          animate={{ rotate: [0, 5, -3, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "30px 14px" }}
        >
          {/* Tassel drop */}
          <line
            x1="30"
            y1="14"
            x2="28"
            y2="22"
            stroke="#eab308"
            strokeWidth="0.8"
          />
          {/* Tassel end */}
          <rect x="26" y="22" width="4" height="3" rx="1" fill="#eab308" />
        </motion.g>

        {/* Small wing arms holding the flame elegantly */}
        <path
          d="M15,55 Q22,62 30,60"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M85,55 Q78,62 70,60"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Controlled flame held in front — small and elegant */}
        <g transform="translate(39, 56)">
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.5"
            style={{
              filter: "drop-shadow(0 0 4px rgba(249,115,22,0.6))",
              transformOrigin: "12px 14px",
            }}
            animate={{
              scale: [0.55, 0.6, 0.53, 0.55],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}
          />
        </g>

        {/* Floating books orbiting Visi */}
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          }}
          style={{ transformOrigin: "50px 50px" }}
        >
          {/* Book 1 — top-right */}
          <g transform="translate(80, 30)">
            <rect x="0" y="0" width="8" height="6" rx="1" fill="#ef4444" />
            <line
              x1="4"
              y1="0"
              x2="4"
              y2="6"
              stroke="#fca5a5"
              strokeWidth="0.5"
            />
          </g>
          {/* Book 2 — bottom-left */}
          <g transform="translate(10, 65)">
            <rect x="0" y="0" width="8" height="6" rx="1" fill="#3b82f6" />
            <line
              x1="4"
              y1="0"
              x2="4"
              y2="6"
              stroke="#93c5fd"
              strokeWidth="0.5"
            />
          </g>
          {/* Book 3 — top-left */}
          <g transform="translate(15, 20)">
            <rect x="0" y="0" width="7" height="5" rx="1" fill="#10b981" />
            <line
              x1="3.5"
              y1="0"
              x2="3.5"
              y2="5"
              stroke="#6ee7b7"
              strokeWidth="0.5"
            />
          </g>
        </motion.g>
      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    const ox = 0;
    const oy = 0;

    // Cape wings — folded behind body
    ctx.fillStyle = "#312e81";
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.8;

    ctx.beginPath();
    ctx.moveTo(ox + 20, oy + 45);
    ctx.quadraticCurveTo(ox + 10, oy + 60, ox + 14, oy + 88);
    ctx.quadraticCurveTo(ox + 20, oy + 82, ox + 25, oy + 85);
    ctx.quadraticCurveTo(ox + 22, oy + 65, ox + 24, oy + 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 80, oy + 45);
    ctx.quadraticCurveTo(ox + 90, oy + 60, ox + 86, oy + 88);
    ctx.quadraticCurveTo(ox + 80, oy + 82, ox + 75, oy + 85);
    ctx.quadraticCurveTo(ox + 78, oy + 65, ox + 76, oy + 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.globalAlpha = 1.0;

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

    // Half-closed eyelids
    ctx.fillStyle = "#4f46e5";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 25, oy + 32, 24, 7, 2);
    } else {
      ctx.rect(ox + 25, oy + 32, 24, 7);
    }
    ctx.fill();
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 51, oy + 32, 24, 7, 2);
    } else {
      ctx.rect(ox + 51, oy + 32, 24, 7);
    }
    ctx.fill();

    // Pupils — half-height ellipses (wise)
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.ellipse(ox + 37, oy + 44, 5, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(ox + 63, oy + 44, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Highlights
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 39, oy + 43, 1.5, 0, Math.PI * 2);
    ctx.arc(ox + 65, oy + 43, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Monocle — right eye
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ox + 63, oy + 42, 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(ox + 63, oy + 42, 11.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // Monocle chain
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 0.8;
    ctx.setLineDash([1.5, 1.5]);
    ctx.beginPath();
    ctx.moveTo(ox + 63, oy + 52);
    ctx.quadraticCurveTo(ox + 60, oy + 58, ox + 58, oy + 66);
    ctx.quadraticCurveTo(ox + 56, oy + 72, ox + 52, oy + 76);
    ctx.stroke();
    ctx.setLineDash([]);

    // Monocle glint
    ctx.fillStyle = "#fef3c7";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(ox + 59, oy + 38, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(ox + 47, oy + 49);
    ctx.lineTo(ox + 53, oy + 49);
    ctx.lineTo(ox + 50, oy + 55);
    ctx.closePath();
    ctx.fill();

    // Graduation mortarboard cap
    ctx.fillStyle = "#1e1b4b";

    // Board
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 33, oy + 11, 34, 6, 1);
    } else {
      ctx.rect(ox + 33, oy + 11, 34, 6);
    }
    ctx.fill();

    // Cap top surface (diamond shape)
    ctx.beginPath();
    ctx.moveTo(ox + 30, oy + 14);
    ctx.lineTo(ox + 50, oy + 8);
    ctx.lineTo(ox + 70, oy + 14);
    ctx.lineTo(ox + 50, oy + 20);
    ctx.closePath();
    ctx.fill();

    // Cap band
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 38, oy + 19, 24, 4, 1);
    } else {
      ctx.rect(ox + 38, oy + 19, 24, 4);
    }
    ctx.fill();

    // Tassel string
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(ox + 50, oy + 14);
    ctx.lineTo(ox + 30, oy + 14);
    ctx.stroke();

    // Tassel drop
    ctx.beginPath();
    ctx.moveTo(ox + 30, oy + 14);
    ctx.lineTo(ox + 28, oy + 22);
    ctx.stroke();

    // Tassel end
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 26, oy + 22, 4, 3, 1);
    } else {
      ctx.rect(ox + 26, oy + 22, 4, 3);
    }
    ctx.fill();

    // Wing arms holding flame
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(ox + 15, oy + 55);
    ctx.quadraticCurveTo(ox + 22, oy + 62, ox + 30, oy + 60);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 85, oy + 55);
    ctx.quadraticCurveTo(ox + 78, oy + 62, ox + 70, oy + 60);
    ctx.stroke();

    // Controlled flame — small and elegant, held in front
    ctx.save();
    ctx.translate(ox + 39, oy + 56);
    ctx.scale(0.55, 0.55);
    ctx.shadowColor = "rgba(249, 115, 22, 0.6)";
    ctx.shadowBlur = 6;
    ctx.fillStyle = "#f97316";
    const flamePath = new Path2D(
      "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
    );
    ctx.fill(flamePath);
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.5;
    ctx.stroke(flamePath);
    ctx.restore();

    // Floating books at fixed positions
    // Book 1 — top-right (red)
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 80, oy + 30, 8, 6, 1);
    } else {
      ctx.rect(ox + 80, oy + 30, 8, 6);
    }
    ctx.fill();
    ctx.strokeStyle = "#fca5a5";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(ox + 84, oy + 30);
    ctx.lineTo(ox + 84, oy + 36);
    ctx.stroke();

    // Book 2 — bottom-left (blue)
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 10, oy + 65, 8, 6, 1);
    } else {
      ctx.rect(ox + 10, oy + 65, 8, 6);
    }
    ctx.fill();
    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(ox + 14, oy + 65);
    ctx.lineTo(ox + 14, oy + 71);
    ctx.stroke();

    // Book 3 — top-left (green)
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 15, oy + 20, 7, 5, 1);
    } else {
      ctx.rect(ox + 15, oy + 20, 7, 5);
    }
    ctx.fill();
    ctx.strokeStyle = "#6ee7b7";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(ox + 18.5, oy + 20);
    ctx.lineTo(ox + 18.5, oy + 25);
    ctx.stroke();

    ctx.restore();
  },
};
