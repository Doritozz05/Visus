import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day50Milestone: StreakMilestone = {
  id: "day50",
  isMatch: (s) => s >= 50 && s < 75,
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
        animate={{ y: [-2, -3, -2] }}
        transition={{
          repeat: Infinity,
          duration: 2.0,
          ease: "easeInOut",
        }}
      >
        {/* Blue fire aura — pulsing glow behind body */}
      <motion.circle
        cx="50"
        cy="55"
        r="42"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        opacity="0.3"
        animate={{
          r: [40, 44, 40],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "easeInOut",
        }}
      />
      <motion.circle
        cx="50"
        cy="55"
        r="36"
        fill="#3b82f6"
        opacity="0.06"
        animate={{
          r: [34, 38, 34],
          opacity: [0.04, 0.1, 0.04],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.0,
          ease: "easeInOut",
        }}
      />

      <motion.g
        animate={{ x: [-0.8, 0.8, -0.5, 0.5, -0.8] }}
        transition={{
          repeat: Infinity,
          duration: 0.15,
          ease: "linear",
        }}
      >
        {/* Ears */}
        <polygon points="20,35 50,35 25,18" fill="#4f46e5" />
        <polygon points="50,35 80,35 75,18" fill="#4f46e5" />

        {/* Feet */}
        <ellipse cx="32" cy="86" rx="6" ry="4" fill="#f97316" />
        <ellipse cx="68" cy="86" rx="6" ry="4" fill="#f97316" />

        {/* Wild jagged wings — spread outward/upward */}
        <motion.path
          d="M15,52 Q4,42 0,30 Q6,36 10,32 Q5,22 2,12"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
          animate={{ rotate: [0, -6, 3, -6, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.4,
            ease: "linear",
          }}
          style={{ transformOrigin: "15px 52px" }}
        />
        <motion.path
          d="M85,52 Q96,42 100,30 Q94,36 90,32 Q95,22 98,12"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
          animate={{ rotate: [0, 6, -3, 6, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.4,
            ease: "linear",
          }}
          style={{ transformOrigin: "85px 52px" }}
        />

        {/* Body */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#4f46e5" />

        {/* Belly */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#c7d2fe" />

        {/* Eyes outer white */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" />
        <circle cx="63" cy="42" r="12" fill="#ffffff" />

        {/* Spiral pupils — left eye */}
        <motion.g
          style={{ transformOrigin: "37px 42px" }}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.0,
            ease: "linear",
          }}
        >
          <path
            d="M37,34 A8,8 0 0,1 45,42"
            fill="none"
            stroke="#1e1b4b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M37,50 A8,8 0 0,1 29,42"
            fill="none"
            stroke="#1e1b4b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Spiral pupils — right eye */}
        <motion.g
          style={{ transformOrigin: "63px 42px" }}
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            ease: "linear",
          }}
        >
          <path
            d="M63,34 A8,8 0 0,1 71,42"
            fill="none"
            stroke="#1e1b4b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M63,50 A8,8 0 0,1 55,42"
            fill="none"
            stroke="#1e1b4b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Beak — wide open */}
        <polygon points="46,48 54,48 50,44" fill="#f97316" />
        <polygon points="46,51 54,51 50,58" fill="#f97316" />

        {/* Blue flame above head */}
        <g transform="translate(38, -4)">
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#3b82f6"
            stroke="#93c5fd"
            strokeWidth="0.5"
            style={{
              filter: "drop-shadow(0 0 8px rgba(59,130,246,0.9))",
              transformOrigin: "12px 14px",
            }}
            animate={{
              scale: [0.9, 1.05, 0.85, 1.0, 0.9],
              rotate: [0, 5, -5, 3, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              ease: "easeInOut",
            }}
          />
        </g>

        {/* Electric sparks */}
        <motion.path
          d="M18,28 L20,24 L17,26 L19,22"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1"
          strokeLinecap="round"
          animate={{ opacity: [0, 1, 0], pathLength: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
        />
        <motion.path
          d="M82,28 L80,24 L83,26 L81,22"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1"
          strokeLinecap="round"
          animate={{ opacity: [0, 1, 0], pathLength: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }}
        />
        <motion.path
          d="M25,75 L22,72 L26,73 L23,69"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="0.8"
          strokeLinecap="round"
          animate={{ opacity: [0, 1, 0], pathLength: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.7, delay: 0.5 }}
        />
        <motion.path
          d="M75,75 L78,72 L74,73 L77,69"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="0.8"
          strokeLinecap="round"
          animate={{ opacity: [0, 1, 0], pathLength: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }}
        />
        <motion.path
          d="M50,90 L48,87 L52,88 L50,85"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="0.8"
          strokeLinecap="round"
          animate={{ opacity: [0, 1, 0], pathLength: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.9, delay: 0.4 }}
        />
      </motion.g>
    </motion.g>
  </svg>
),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    // Apply global 0.8 scale to match SVG wrapper
    ctx.translate(11, 10);
    ctx.scale(0.8, 0.8);

    const ox = 0;
    const oy = 0;

    // Blue fire aura
    ctx.save();
    ctx.strokeStyle = "rgba(59, 130, 246, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ox + 50, oy + 55, 42, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(59, 130, 246, 0.06)";
    ctx.beginPath();
    ctx.arc(ox + 50, oy + 55, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

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

    // Wild jagged wings — spread outward/upward
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";

    // Left wing
    ctx.beginPath();
    ctx.moveTo(ox + 15, oy + 52);
    ctx.quadraticCurveTo(ox + 4, oy + 42, ox + 0, oy + 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ox + 0, oy + 30);
    ctx.quadraticCurveTo(ox + 6, oy + 36, ox + 10, oy + 32);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ox + 10, oy + 32);
    ctx.quadraticCurveTo(ox + 5, oy + 22, ox + 2, oy + 12);
    ctx.stroke();

    // Right wing
    ctx.beginPath();
    ctx.moveTo(ox + 85, oy + 52);
    ctx.quadraticCurveTo(ox + 96, oy + 42, ox + 100, oy + 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ox + 100, oy + 30);
    ctx.quadraticCurveTo(ox + 94, oy + 36, ox + 90, oy + 32);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ox + 90, oy + 32);
    ctx.quadraticCurveTo(ox + 95, oy + 22, ox + 98, oy + 12);
    ctx.stroke();

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

    // Spiral pupils — left eye (Static hypnotic style)
    ctx.strokeStyle = "#1e1b4b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";

    // Three arcs to capture the 'motion' in static
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 8, -Math.PI / 2, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 8, Math.PI / 6, Math.PI / 6 + Math.PI / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 8, Math.PI, Math.PI + Math.PI / 2); ctx.stroke();

    // Spiral pupils — right eye
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 8, -Math.PI / 2, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 8, Math.PI / 6, Math.PI / 6 + Math.PI / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 8, Math.PI, Math.PI + Math.PI / 2); ctx.stroke();

    // Beak — wide open (upper and lower triangles)
    ctx.fillStyle = "#f97316";
    // Upper beak
    ctx.beginPath();
    ctx.moveTo(ox + 46, oy + 48);
    ctx.lineTo(ox + 54, oy + 48);
    ctx.lineTo(ox + 50, oy + 44);
    ctx.fill();

    // Lower beak
    ctx.beginPath();
    ctx.moveTo(ox + 46, oy + 51);
    ctx.lineTo(ox + 54, oy + 51);
    ctx.lineTo(ox + 50, oy + 58);
    ctx.fill();

    // Blue flame above head
    ctx.save();
    ctx.translate(ox + 38, oy - 4);
    ctx.scale(0.95, 0.95);
    ctx.shadowColor = "rgba(59, 130, 246, 0.9)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#3b82f6";
    const flamePath = new Path2D(
      "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
    );
    ctx.fill(flamePath);
    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 0.5;
    ctx.stroke(flamePath);
    ctx.restore();

    // Electric sparks
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(ox + 18, oy + 28);
    ctx.lineTo(ox + 20, oy + 24);
    ctx.lineTo(ox + 17, oy + 26);
    ctx.lineTo(ox + 19, oy + 22);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 82, oy + 28);
    ctx.lineTo(ox + 80, oy + 24);
    ctx.lineTo(ox + 83, oy + 26);
    ctx.lineTo(ox + 81, oy + 22);
    ctx.stroke();

    ctx.strokeStyle = "#93c5fd";
    ctx.lineWidth = 0.8;

    ctx.beginPath();
    ctx.moveTo(ox + 25, oy + 75);
    ctx.lineTo(ox + 22, oy + 72);
    ctx.lineTo(ox + 26, oy + 73);
    ctx.lineTo(ox + 23, oy + 69);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 75, oy + 75);
    ctx.lineTo(ox + 78, oy + 72);
    ctx.lineTo(ox + 74, oy + 73);
    ctx.lineTo(ox + 77, oy + 69);
    ctx.stroke();

    ctx.strokeStyle = "#60a5fa";
    ctx.beginPath();
    ctx.moveTo(ox + 50, oy + 90);
    ctx.lineTo(ox + 48, oy + 87);
    ctx.lineTo(ox + 52, oy + 88);
    ctx.lineTo(ox + 50, oy + 85);
    ctx.stroke();

    ctx.restore();
  },
};
