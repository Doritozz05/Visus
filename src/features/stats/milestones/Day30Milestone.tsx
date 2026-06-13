import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day30Milestone: StreakMilestone = {
  id: "day30",
  isMatch: (s) => s >= 30 && s < 50,
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
        animate={{ y: [-13, -16, -13] }}
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

        {/* Eyes Outer White */}
        <circle cx="37" cy="42" r="12" fill="#ffffff" />
        <circle cx="63" cy="42" r="12" fill="#ffffff" />

        {/* Pupils — excited, looking down at book */}
        <motion.circle
          cx="37"
          cy="45"
          r="6"
          fill="#1e1b4b"
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 4,
            repeatDelay: 3,
          }}
        />
        <motion.circle
          cx="63"
          cy="45"
          r="6"
          fill="#1e1b4b"
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 4,
            repeatDelay: 3,
          }}
        />

        {/* Sparkle in eyes — excitement */}
        <circle cx="40" cy="43" r="2" fill="#ffffff" />
        <circle cx="66" cy="43" r="2" fill="#ffffff" />
        <circle cx="35" cy="40" r="1" fill="#ffffff" />
        <circle cx="61" cy="40" r="1" fill="#ffffff" />

        {/* Beak — slightly open, happy */}
        <polygon points="47,49 53,49 50,54" fill="#f97316" />

        {/* Wings: holding the book */}
        <path
          d="M15,55 Q24,65 35,66"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M85,55 Q76,65 65,66"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Book — open, resting on belly */}
        <rect x="33" y="62" width="34" height="22" rx="2" fill="#fef3c7" />
        {/* Book spine */}
        <line x1="50" y1="62" x2="50" y2="84" stroke="#d97706" strokeWidth="1.5" />
        {/* Book pages left */}
        <line x1="37" y1="67" x2="48" y2="67" stroke="#d4d4d8" strokeWidth="0.6" />
        <line x1="37" y1="70" x2="48" y2="70" stroke="#d4d4d8" strokeWidth="0.6" />
        <line x1="37" y1="73" x2="48" y2="73" stroke="#d4d4d8" strokeWidth="0.6" />
        <line x1="37" y1="76" x2="46" y2="76" stroke="#d4d4d8" strokeWidth="0.6" />
        {/* Book pages right */}
        <line x1="52" y1="67" x2="63" y2="67" stroke="#d4d4d8" strokeWidth="0.6" />
        <line x1="52" y1="70" x2="63" y2="70" stroke="#d4d4d8" strokeWidth="0.6" />
        <line x1="52" y1="73" x2="63" y2="73" stroke="#d4d4d8" strokeWidth="0.6" />
        <line x1="52" y1="76" x2="61" y2="76" stroke="#d4d4d8" strokeWidth="0.6" />
        {/* Book cover edges */}
        <rect x="33" y="62" width="34" height="22" rx="2" fill="none" stroke="#b45309" strokeWidth="1" />

        {/* Floating paper confetti bits */}
        <motion.rect
          x="22"
          y="15"
          width="4"
          height="3"
          rx="0.5"
          fill="#fef3c7"
          animate={{ y: [50, 44, 50], rotate: [0, 20, -10, 0], opacity: [0.8, 1, 0.5, 0.8] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />
        <motion.rect
          x="78"
          y="10"
          width="3"
          height="4"
          rx="0.5"
          fill="#fde68a"
          animate={{ y: [46, 40, 46], rotate: [0, -15, 20, 0], opacity: [0.6, 1, 0.4, 0.6] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.rect
          x="14"
          y="5"
          width="3"
          height="2.5"
          rx="0.5"
          fill="#fef9c3"
          animate={{ y: [40, 34, 40], rotate: [0, 30, -5, 0], opacity: [0.5, 1, 0.3, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 1 }}
        />
        <motion.rect
          x="86"
          y="20"
          width="3.5"
          height="2.5"
          rx="0.5"
          fill="#fef3c7"
          animate={{ y: [54, 48, 54], rotate: [0, -25, 10, 0], opacity: [0.7, 1, 0.4, 0.7] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.8 }}
        />

        {/* Flame sitting on the book like a reading lamp */}
        <g transform="translate(38, 60)">
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.5"
            style={{
              filter: "drop-shadow(0 0 6px rgba(249,115,22,0.7))",
              transformOrigin: "12px 18px",
            }}
            animate={{
              scale: [0.85, 0.9, 0.82, 0.85],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
          />
        </g>

        {/* Warm glow on book from flame */}
        <circle cx="50" cy="65" r="8" fill="#f97316" opacity="0.08" />
      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    // Apply global 0.8 scale to fit accessories
    ctx.translate(11, 10);
    ctx.scale(0.8, 0.8);

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

    // Draw Pupils — looking down, bigger (excited)
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 45, 6, 0, Math.PI * 2);
    ctx.arc(ox + 63, oy + 45, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw Highlights — sparkle of excitement
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 40, oy + 43, 2, 0, Math.PI * 2);
    ctx.arc(ox + 66, oy + 43, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ox + 35, oy + 40, 1, 0, Math.PI * 2);
    ctx.arc(ox + 61, oy + 40, 1, 0, Math.PI * 2);
    ctx.fill();

    // Draw Beak (slightly open)
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(ox + 47, oy + 49);
    ctx.lineTo(ox + 53, oy + 49);
    ctx.lineTo(ox + 50, oy + 54);
    ctx.closePath();
    ctx.fill();

    // Draw Wings (holding book)
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(ox + 15, oy + 55);
    ctx.quadraticCurveTo(ox + 24, oy + 65, ox + 35, oy + 66);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 85, oy + 55);
    ctx.quadraticCurveTo(ox + 76, oy + 65, ox + 65, oy + 66);
    ctx.stroke();

    // Draw Book
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 33, oy + 62, 34, 22, 2);
    } else {
      ctx.rect(ox + 33, oy + 62, 34, 22);
    }
    ctx.fill();

    // Book spine
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox + 50, oy + 62);
    ctx.lineTo(ox + 50, oy + 84);
    ctx.stroke();

    // Book text lines (left)
    ctx.strokeStyle = "#d4d4d8";
    ctx.lineWidth = 0.6;
    [67, 70, 73].forEach((ly) => {
      ctx.beginPath();
      ctx.moveTo(ox + 37, oy + ly);
      ctx.lineTo(ox + 48, oy + ly);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(ox + 37, oy + 76);
    ctx.lineTo(ox + 46, oy + 76);
    ctx.stroke();

    // Book text lines (right)
    [67, 70, 73].forEach((ly) => {
      ctx.beginPath();
      ctx.moveTo(ox + 52, oy + ly);
      ctx.lineTo(ox + 63, oy + ly);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(ox + 52, oy + 76);
    ctx.lineTo(ox + 61, oy + 76);
    ctx.stroke();

    // Book cover border
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 33, oy + 62, 34, 22, 2);
    } else {
      ctx.rect(ox + 33, oy + 62, 34, 22);
    }
    ctx.stroke();

    // Floating paper confetti
    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(ox + 22, oy + 48, 4, 3);

    ctx.fillStyle = "#fde68a";
    ctx.fillRect(ox + 78, oy + 44, 3, 4);

    ctx.fillStyle = "#fef9c3";
    ctx.fillRect(ox + 14, oy + 38, 3, 2.5);

    ctx.fillStyle = "#fef3c7";
    ctx.fillRect(ox + 86, oy + 52, 3.5, 2.5);

    // Warm glow on book
    ctx.fillStyle = "rgba(249, 115, 22, 0.08)";
    ctx.beginPath();
    ctx.arc(ox + 50, oy + 65, 8, 0, Math.PI * 2);
    ctx.fill();

    // Flame on book
    ctx.save();
    ctx.translate(ox + 38, oy + 60);
    ctx.scale(0.85, 0.85);
    ctx.shadowColor = "rgba(249, 115, 22, 0.7)";
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

    ctx.restore();
  },
};
