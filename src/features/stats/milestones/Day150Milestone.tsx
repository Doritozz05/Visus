import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day150Milestone: StreakMilestone = {
  id: "day150",
  isMatch: (s) => s >= 150 && s < 200,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="0 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(79,70,229,0.15)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Speed lines in background */}
      <motion.line
        x1="0" y1="30" x2="20" y2="30"
        stroke="#c7d2fe" strokeWidth="0.8" strokeDasharray="3 2"
        animate={{ opacity: [0.3, 0.8, 0.3], x1: [-5, 0, -5], x2: [15, 20, 15] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      />
      <motion.line
        x1="0" y1="45" x2="15" y2="45"
        stroke="#c7d2fe" strokeWidth="0.6" strokeDasharray="4 2"
        animate={{ opacity: [0.2, 0.7, 0.2], x1: [-3, 2, -3], x2: [12, 17, 12] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.line
        x1="0" y1="60" x2="18" y2="60"
        stroke="#c7d2fe" strokeWidth="0.7" strokeDasharray="3 3"
        animate={{ opacity: [0.3, 0.6, 0.3], x1: [-4, 1, -4], x2: [14, 19, 14] }}
        transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut", delay: 0.4 }}
      />
      <motion.line
        x1="0" y1="75" x2="12" y2="75"
        stroke="#c7d2fe" strokeWidth="0.5" strokeDasharray="2 2"
        animate={{ opacity: [0.2, 0.5, 0.2], x1: [-2, 3, -2], x2: [10, 15, 10] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.line
        x1="0" y1="52" x2="10" y2="52"
        stroke="#a5b4fc" strokeWidth="0.5" strokeDasharray="2 3"
        animate={{ opacity: [0.15, 0.5, 0.15], x1: [-6, -1, -6], x2: [8, 13, 8] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut", delay: 0.8 }}
      />

      <motion.g
        animate={{ y: [0, -1.5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut",
        }}
      >
        {/* Main body group — tilted ~5° for action pose */}
        <g transform="rotate(5, 50, 55)">
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

          {/* Star-shaped pupils — left eye */}
          <motion.path
            d="M37,37 L38.5,40.5 L42,42 L38.5,43.5 L37,47 L35.5,43.5 L32,42 L35.5,40.5 Z"
            fill="#1e1b4b"
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ repeat: Infinity, duration: 4, repeatDelay: 2.5 }}
            style={{ transformOrigin: "37px 42px" }}
          />
          {/* Star-shaped pupils — right eye */}
          <motion.path
            d="M63,37 L64.5,40.5 L68,42 L64.5,43.5 L63,47 L61.5,43.5 L58,42 L61.5,40.5 Z"
            fill="#1e1b4b"
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ repeat: Infinity, duration: 4, repeatDelay: 2.5 }}
            style={{ transformOrigin: "63px 42px" }}
          />

          {/* Highlights */}
          <circle cx="39" cy="40" r="1.5" fill="#ffffff" />
          <circle cx="65" cy="40" r="1.5" fill="#ffffff" />

          {/* Beak */}
          <polygon points="47,49 53,49 50,55" fill="#f97316" />

          {/* Ninja Headband */}
          <rect x="18" y="30" width="64" height="5" rx="1" fill="#1e1b4b" />
          {/* Headband knot */}
          <circle cx="82" cy="32" r="3" fill="#1e1b4b" />

          {/* Headband tails — animated waving */}
          <motion.path
            d="M84,30 Q92,28 98,25"
            fill="none"
            stroke="#1e1b4b"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ d: [
              "M84,30 Q92,28 98,25",
              "M84,30 Q93,26 100,28",
              "M84,30 Q91,30 97,24",
              "M84,30 Q92,28 98,25",
            ] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          />
          <motion.path
            d="M84,34 Q90,36 96,33"
            fill="none"
            stroke="#1e1b4b"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{ d: [
              "M84,34 Q90,36 96,33",
              "M84,34 Q91,34 98,36",
              "M84,34 Q89,38 95,32",
              "M84,34 Q90,36 96,33",
            ] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Left Wing — defensive pose (raised, guarding) */}
          <path
            d="M15,55 Q4,42 10,28"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Right Wing — extended throwing pose */}
          <motion.path
            d="M85,55 Q98,40 105,35"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="9"
            strokeLinecap="round"
            animate={{ d: [
              "M85,55 Q98,40 105,35",
              "M85,55 Q100,38 108,32",
              "M85,55 Q98,40 105,35",
            ] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </g>

        {/* Flame Shuriken — thrown from right wing, rotating */}
        <g transform="translate(96, 18)">
          <motion.g
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            style={{ transformOrigin: "8px 10px" }}
          >
            <motion.path
              d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
              fill="#f97316"
              stroke="#fdba74"
              strokeWidth="0.5"
              style={{ filter: "drop-shadow(0 0 5px rgba(249,115,22,0.8))" }}
              animate={{ scale: [0.55, 0.6, 0.55] }}
              transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            />
          </motion.g>
        </g>

        {/* Shuriken trail sparks */}
        <motion.circle
          cx="92" cy="24" r="1.5"
          fill="#fbbf24"
          animate={{ opacity: [0.8, 0.2, 0.8], scale: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
        />
        <motion.circle
          cx="88" cy="28" r="1"
          fill="#f97316"
          animate={{ opacity: [0.6, 0.1, 0.6], scale: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.circle
          cx="94" cy="30" r="1"
          fill="#fdba74"
          animate={{ opacity: [0.5, 0.1, 0.5], scale: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut", delay: 0.4 }}
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

    // Speed lines in background
    ctx.strokeStyle = "#c7d2fe";
    ctx.setLineDash([3, 2]);
    ctx.globalAlpha = 0.6;

    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(ox + 0, oy + 30); ctx.lineTo(ox + 20, oy + 30);
    ctx.stroke();

    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(ox + 0, oy + 45); ctx.lineTo(ox + 15, oy + 45);
    ctx.stroke();

    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(ox + 0, oy + 60); ctx.lineTo(ox + 18, oy + 60);
    ctx.stroke();

    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(ox + 0, oy + 75); ctx.lineTo(ox + 12, oy + 75);
    ctx.stroke();

    ctx.strokeStyle = "#a5b4fc";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(ox + 0, oy + 52); ctx.lineTo(ox + 10, oy + 52);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // Apply ~5° tilt for the main body group
    ctx.save();
    ctx.translate(ox + 50, oy + 55);
    ctx.rotate((5 * Math.PI) / 180);
    ctx.translate(-(ox + 50), -(oy + 55));

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

    // Star-shaped pupils — left eye
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.moveTo(ox + 37, oy + 37);
    ctx.lineTo(ox + 38.5, oy + 40.5);
    ctx.lineTo(ox + 42, oy + 42);
    ctx.lineTo(ox + 38.5, oy + 43.5);
    ctx.lineTo(ox + 37, oy + 47);
    ctx.lineTo(ox + 35.5, oy + 43.5);
    ctx.lineTo(ox + 32, oy + 42);
    ctx.lineTo(ox + 35.5, oy + 40.5);
    ctx.closePath();
    ctx.fill();

    // Star-shaped pupils — right eye
    ctx.beginPath();
    ctx.moveTo(ox + 63, oy + 37);
    ctx.lineTo(ox + 64.5, oy + 40.5);
    ctx.lineTo(ox + 68, oy + 42);
    ctx.lineTo(ox + 64.5, oy + 43.5);
    ctx.lineTo(ox + 63, oy + 47);
    ctx.lineTo(ox + 61.5, oy + 43.5);
    ctx.lineTo(ox + 58, oy + 42);
    ctx.lineTo(ox + 61.5, oy + 40.5);
    ctx.closePath();
    ctx.fill();

    // Highlights
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 39, oy + 40, 1.5, 0, Math.PI * 2);
    ctx.arc(ox + 65, oy + 40, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(ox + 47, oy + 49); ctx.lineTo(ox + 53, oy + 49); ctx.lineTo(ox + 50, oy + 55); ctx.closePath(); ctx.fill();

    // Ninja Headband
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(ox + 18, oy + 30, 64, 5, 1); } else { ctx.rect(ox + 18, oy + 30, 64, 5); }
    ctx.fill();

    // Headband knot
    ctx.beginPath();
    ctx.arc(ox + 82, oy + 32, 3, 0, Math.PI * 2);
    ctx.fill();

    // Headband tails (static pose)
    ctx.strokeStyle = "#1e1b4b";
    ctx.lineCap = "round";

    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ox + 84, oy + 30);
    ctx.quadraticCurveTo(ox + 92, oy + 28, ox + 98, oy + 25);
    ctx.stroke();

    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ox + 84, oy + 34);
    ctx.quadraticCurveTo(ox + 90, oy + 36, ox + 96, oy + 33);
    ctx.stroke();

    // Left Wing — defensive pose
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(ox + 15, oy + 55);
    ctx.quadraticCurveTo(ox + 4, oy + 42, ox + 10, oy + 28);
    ctx.stroke();

    // Right Wing — extended throwing pose
    ctx.beginPath();
    ctx.moveTo(ox + 85, oy + 55);
    ctx.quadraticCurveTo(ox + 98, oy + 40, ox + 105, oy + 35);
    ctx.stroke();

    ctx.restore(); // End of rotated body group

    // Flame Shuriken (static, at thrown position)
    ctx.save();
    ctx.translate(ox + 96, oy + 18);
    ctx.scale(0.55, 0.55);
    ctx.shadowColor = "rgba(249, 115, 22, 0.8)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#f97316";
    const flamePath = new Path2D(
      "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
    );
    ctx.fill(flamePath);
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.5;
    ctx.stroke(flamePath);
    ctx.restore();

    // Shuriken trail sparks
    ctx.fillStyle = "#fbbf24";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(ox + 92, oy + 24, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f97316";
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(ox + 88, oy + 28, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fdba74";
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(ox + 94, oy + 30, 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;

    ctx.restore();
  },
};
