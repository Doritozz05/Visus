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
      viewBox="0 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(79,70,229,0.15)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background stars */}
      <motion.circle
        cx="8"
        cy="12"
        r="1"
        fill="#fbbf24"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 2, delay: 0 }}
      />
      <motion.circle
        cx="100"
        cy="8"
        r="1.2"
        fill="#ffffff"
        animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.3, 0.7] }}
        transition={{ repeat: Infinity, duration: 2.5, delay: 0.4 }}
      />
      <motion.circle
        cx="15"
        cy="92"
        r="0.8"
        fill="#fbbf24"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ repeat: Infinity, duration: 1.8, delay: 0.8 }}
      />
      <motion.circle
        cx="95"
        cy="88"
        r="1"
        fill="#ffffff"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 2.2, delay: 1.2 }}
      />
      <motion.circle
        cx="5"
        cy="55"
        r="0.7"
        fill="#fbbf24"
        animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.2, 0.8] }}
        transition={{ repeat: Infinity, duration: 2.8, delay: 0.6 }}
      />
      <motion.circle
        cx="105"
        cy="50"
        r="0.9"
        fill="#ffffff"
        animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.3, 0.7] }}
        transition={{ repeat: Infinity, duration: 2, delay: 1 }}
      />

      {/* Small planet (Saturn) in corner */}
      <circle cx="96" cy="22" r="5" fill="#a78bfa" />
      <ellipse
        cx="96"
        cy="22"
        rx="9"
        ry="2"
        fill="none"
        stroke="#c4b5fd"
        strokeWidth="1"
        transform="rotate(-20 96 22)"
      />

      <motion.g
        animate={{ y: [0, -3, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "50px 50px" }}
      >
        {/* Jetpack flame exhaust — below feet */}
        <g transform="translate(37, 82)">
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.5"
            style={{
              filter: "drop-shadow(0 0 8px rgba(249,115,22,0.8))",
              transformOrigin: "12px 4px",
            }}
            animate={{
              scaleY: [1.1, 1.3, 1.0, 1.1],
              scaleX: [1, 1.05, 0.95, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              ease: "easeInOut",
            }}
          />
        </g>

        {/* Glow beneath feet from jetpack */}
        <circle cx="50" cy="92" r="10" fill="#f97316" opacity="0.12" />

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

        {/* Pupils — looking upward */}
        <motion.circle
          cx="37"
          cy="38"
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
          cy="38"
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
        <circle cx="39" cy="36" r="1.5" fill="#ffffff" />
        <circle cx="65" cy="36" r="1.5" fill="#ffffff" />

        {/* Beak */}
        <polygon points="47,49 53,49 50,55" fill="#f97316" />

        {/* Bubble helmet — transparent circle around head */}
        <circle
          cx="50"
          cy="38"
          r="28"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
        />
        {/* Glass reflection arc */}
        <path
          d="M30,22 Q38,14 55,18"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Second smaller reflection */}
        <path
          d="M32,26 Q36,22 42,24"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Wings — relaxed floating pose */}
        <path
          d="M15,55 Q6,50 3,40"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M85,55 Q94,50 97,40"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
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

    // Background stars
    const stars = [
      { x: 8, y: 12, r: 1, color: "#fbbf24" },
      { x: 100, y: 8, r: 1.2, color: "#ffffff" },
      { x: 15, y: 92, r: 0.8, color: "#fbbf24" },
      { x: 95, y: 88, r: 1, color: "#ffffff" },
      { x: 5, y: 55, r: 0.7, color: "#fbbf24" },
      { x: 105, y: 50, r: 0.9, color: "#ffffff" },
    ];
    for (const star of stars) {
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(ox + star.x, oy + star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Small planet (Saturn)
    ctx.fillStyle = "#a78bfa";
    ctx.beginPath();
    ctx.arc(ox + 96, oy + 22, 5, 0, Math.PI * 2);
    ctx.fill();

    // Saturn ring
    ctx.save();
    ctx.translate(ox + 96, oy + 22);
    ctx.rotate((-20 * Math.PI) / 180);
    ctx.strokeStyle = "#c4b5fd";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Jetpack flame exhaust — below feet
    ctx.save();
    ctx.translate(ox + 37, oy + 82);
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

    // Glow beneath feet from jetpack
    ctx.fillStyle = "rgba(249, 115, 22, 0.12)";
    ctx.beginPath();
    ctx.arc(ox + 50, oy + 92, 10, 0, Math.PI * 2);
    ctx.fill();

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

    // Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2);
    ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2);
    ctx.fill();

    // Pupils — looking upward
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 38, 5, 0, Math.PI * 2);
    ctx.arc(ox + 63, oy + 38, 5, 0, Math.PI * 2);
    ctx.fill();

    // Highlights
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 39, oy + 36, 1.5, 0, Math.PI * 2);
    ctx.arc(ox + 65, oy + 36, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(ox + 47, oy + 49);
    ctx.lineTo(ox + 53, oy + 49);
    ctx.lineTo(ox + 50, oy + 55);
    ctx.closePath();
    ctx.fill();

    // Bubble helmet — transparent circle around head
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ox + 50, oy + 38, 28, 0, Math.PI * 2);
    ctx.stroke();

    // Glass reflection arc
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ox + 30, oy + 22);
    ctx.quadraticCurveTo(ox + 38, oy + 14, ox + 55, oy + 18);
    ctx.stroke();

    // Second smaller reflection
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ox + 32, oy + 26);
    ctx.quadraticCurveTo(ox + 36, oy + 22, ox + 42, oy + 24);
    ctx.stroke();

    // Wings — relaxed floating pose
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(ox + 15, oy + 55);
    ctx.quadraticCurveTo(ox + 6, oy + 50, ox + 3, oy + 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 85, oy + 55);
    ctx.quadraticCurveTo(ox + 94, oy + 50, ox + 97, oy + 40);
    ctx.stroke();

    ctx.restore();
  },
};
