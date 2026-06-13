import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day300Milestone: StreakMilestone = {
  id: "day300",
  isMatch: (s) => s >= 300 && s < 365,
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
        animate={{ y: [0, -1.5, 0, -1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1.0,
          ease: "easeInOut",
        }}
      >
        {/* Lightning bolt behind Visi */}
        <motion.polygon
          points="52,0 42,22 50,22 38,42 48,42 32,62 60,34 50,34 62,14 52,14"
          fill="#fbbf24"
          opacity={0.85}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 4px rgba(251,191,36,0.6))" }}
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

        {/* Pupils — confident, slightly narrowed */}
        <motion.circle
          cx="37"
          cy="42"
          r="5"
          fill="#1e1b4b"
          animate={{ scaleY: [0.85, 0.85, 0.1, 0.85] }}
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
          animate={{ scaleY: [0.85, 0.85, 0.1, 0.85] }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            repeatDelay: 2,
          }}
        />

        {/* Highlights */}
        <circle cx="39" cy="40" r="1.5" fill="#ffffff" />
        <circle cx="65" cy="40" r="1.5" fill="#ffffff" />

        {/* Star sunglasses — left star */}
        <polygon
          points="37,34 39,38 43,38 40,41 41,45 37,43 33,45 34,41 31,38 35,38"
          fill="#eab308"
          opacity={0.92}
          style={{ filter: "drop-shadow(0 0 2px rgba(234,179,8,0.5))" }}
        />
        {/* Star sunglasses — right star */}
        <polygon
          points="63,34 65,38 69,38 66,41 67,45 63,43 59,45 60,41 57,38 61,38"
          fill="#eab308"
          opacity={0.92}
          style={{ filter: "drop-shadow(0 0 2px rgba(234,179,8,0.5))" }}
        />
        {/* Sunglasses bridge */}
        <line x1="41" y1="38" x2="59" y2="38" stroke="#eab308" strokeWidth="1.5" />
        {/* Glare on stars */}
        <circle cx="35" cy="37" r="0.8" fill="#ffffff" opacity={0.7} />
        <circle cx="61" cy="37" r="0.8" fill="#ffffff" opacity={0.7} />

        {/* Beak — confident smirk (asymmetric) */}
        <polygon points="47,49 53,49 50,55" fill="#f97316" />
        <path
          d="M48,53 Q50,56 54,52"
          fill="none"
          stroke="#ea580c"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Left wing — rock horns pose (fork shape pointing up) */}
        <motion.g
          animate={{ rotate: [0, -8, 0, 5, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.0,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "15px 55px" }}
        >
          <path
            d="M15,55 Q6,40 2,24"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Fork prongs */}
          <path
            d="M2,24 Q0,18 -2,12"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M2,24 Q6,18 8,12"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Right wing — holding guitar */}
        <path
          d="M85,55 Q92,50 95,44"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Electric guitar — flame-filled body at right side */}
        <g transform="translate(88, 38)">
          {/* Guitar neck */}
          <rect x="4" y="-18" width="3" height="20" rx="1" fill="#92400e" />
          {/* Guitar headstock */}
          <rect x="2.5" y="-22" width="6" height="5" rx="1.5" fill="#78350f" />
          {/* Tuning pegs */}
          <circle cx="3.5" cy="-20" r="0.8" fill="#d4d4d8" />
          <circle cx="7.5" cy="-20" r="0.8" fill="#d4d4d8" />
          <circle cx="3.5" cy="-18" r="0.8" fill="#d4d4d8" />
          <circle cx="7.5" cy="-18" r="0.8" fill="#d4d4d8" />
          {/* Guitar body — flame shape */}
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.5"
            animate={{
              scale: [1, 1.06, 0.96, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
            }}
            style={{
              filter: "drop-shadow(0 0 6px rgba(249,115,22,0.8))",
              transformOrigin: "12px 14px",
            }}
          />
          {/* Guitar strings on body */}
          <line x1="5" y1="-2" x2="5" y2="8" stroke="#fef3c7" strokeWidth="0.3" opacity={0.6} />
          <line x1="6" y1="-2" x2="6" y2="8" stroke="#fef3c7" strokeWidth="0.3" opacity={0.6} />
        </g>

        {/* Musical notes floating above */}
        <motion.text
          x="18"
          y="16"
          fontSize="8"
          fill="#f97316"
          animate={{ y: [16, 10, 16], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          ♪
        </motion.text>
        <motion.text
          x="72"
          y="12"
          fontSize="7"
          fill="#eab308"
          animate={{ y: [12, 6, 12], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.6 }}
        >
          ♫
        </motion.text>
        <motion.text
          x="28"
          y="8"
          fontSize="6"
          fill="#fbbf24"
          animate={{ y: [8, 3, 8], opacity: [0.3, 0.9, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 1.2 }}
        >
          ♪
        </motion.text>
      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    const ox = 0;
    const oy = 0;

    // Lightning bolt behind Visi
    ctx.fillStyle = "rgba(251, 191, 36, 0.85)";
    ctx.beginPath();
    ctx.moveTo(ox + 52, oy + 0);
    ctx.lineTo(ox + 42, oy + 22);
    ctx.lineTo(ox + 50, oy + 22);
    ctx.lineTo(ox + 38, oy + 42);
    ctx.lineTo(ox + 48, oy + 42);
    ctx.lineTo(ox + 32, oy + 62);
    ctx.lineTo(ox + 60, oy + 34);
    ctx.lineTo(ox + 50, oy + 34);
    ctx.lineTo(ox + 62, oy + 14);
    ctx.lineTo(ox + 52, oy + 14);
    ctx.closePath();
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

    // Pupils — confident, slightly squished
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.save();
    ctx.translate(ox + 37, oy + 42);
    ctx.scale(1, 0.85);
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.restore();
    ctx.save();
    ctx.translate(ox + 63, oy + 42);
    ctx.scale(1, 0.85);
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.restore();
    ctx.fill();

    // Highlights
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 39, oy + 40, 1.5, 0, Math.PI * 2);
    ctx.arc(ox + 65, oy + 40, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Star sunglasses — helper to draw a 5-point star
    const drawStar = (cx: number, cy: number, outerR: number, innerR: number) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const sx = cx + r * Math.cos(angle);
        const sy = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
    };

    // Left star
    ctx.fillStyle = "#eab308";
    drawStar(ox + 37, oy + 40, 7, 3.5);
    ctx.fill();

    // Right star
    drawStar(ox + 63, oy + 40, 7, 3.5);
    ctx.fill();

    // Bridge
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox + 41, oy + 38);
    ctx.lineTo(ox + 59, oy + 38);
    ctx.stroke();

    // Glare on stars
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.beginPath();
    ctx.arc(ox + 35, oy + 37, 0.8, 0, Math.PI * 2);
    ctx.arc(ox + 61, oy + 37, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Beak — confident smirk
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(ox + 47, oy + 49);
    ctx.lineTo(ox + 53, oy + 49);
    ctx.lineTo(ox + 50, oy + 55);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#ea580c";
    ctx.lineWidth = 0.8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ox + 48, oy + 53);
    ctx.quadraticCurveTo(ox + 50, oy + 56, ox + 54, oy + 52);
    ctx.stroke();

    // Left wing — rock horns
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(ox + 15, oy + 55);
    ctx.quadraticCurveTo(ox + 6, oy + 40, ox + 2, oy + 24);
    ctx.stroke();

    // Fork prongs
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(ox + 2, oy + 24);
    ctx.quadraticCurveTo(ox + 0, oy + 18, ox - 2, oy + 12);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 2, oy + 24);
    ctx.quadraticCurveTo(ox + 6, oy + 18, ox + 8, oy + 12);
    ctx.stroke();

    // Right wing — holding guitar
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(ox + 85, oy + 55);
    ctx.quadraticCurveTo(ox + 92, oy + 50, ox + 95, oy + 44);
    ctx.stroke();

    // Electric guitar at right side
    ctx.save();
    ctx.translate(ox + 88, oy + 38);

    // Guitar neck
    ctx.fillStyle = "#92400e";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(4, -18, 3, 20, 1);
    } else {
      ctx.rect(4, -18, 3, 20);
    }
    ctx.fill();

    // Guitar headstock
    ctx.fillStyle = "#78350f";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(2.5, -22, 6, 5, 1.5);
    } else {
      ctx.rect(2.5, -22, 6, 5);
    }
    ctx.fill();

    // Tuning pegs
    ctx.fillStyle = "#d4d4d8";
    ctx.beginPath();
    ctx.arc(3.5, -20, 0.8, 0, Math.PI * 2);
    ctx.arc(7.5, -20, 0.8, 0, Math.PI * 2);
    ctx.arc(3.5, -18, 0.8, 0, Math.PI * 2);
    ctx.arc(7.5, -18, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Guitar body — flame shape
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
    ctx.shadowBlur = 0;

    // Guitar strings on body
    ctx.strokeStyle = "rgba(254, 243, 199, 0.6)";
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(5, -2);
    ctx.lineTo(5, 8);
    ctx.moveTo(6, -2);
    ctx.lineTo(6, 8);
    ctx.stroke();

    ctx.restore();

    // Musical notes
    ctx.font = "8px serif";
    ctx.fillStyle = "#f97316";
    ctx.fillText("♪", ox + 18, oy + 16);

    ctx.font = "7px serif";
    ctx.fillStyle = "#eab308";
    ctx.fillText("♫", ox + 72, oy + 12);

    ctx.font = "6px serif";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("♪", ox + 28, oy + 8);

    ctx.restore();
  },
};
