import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day365Milestone: StreakMilestone = {
  id: "day365",
  isMatch: (s) => s >= 365 && s < 500,
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
        {/* Fire aura particles — circle of flickering flame dots */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 50 + 42 * Math.cos(rad);
          const cy = 52 + 42 * Math.sin(rad);
          return (
            <motion.circle
              key={`aura-${i}`}
              cx={cx}
              cy={cy}
              r={2}
              fill={i % 2 === 0 ? "#f97316" : "#fbbf24"}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.6, 1.3, 0.6],
                r: [1.5, 2.5, 1.5],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5 + i * 0.15,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              style={{ filter: "drop-shadow(0 0 3px rgba(249,115,22,0.6))" }}
            />
          );
        })}

        {/* Additional inner aura ring */}
        {[22, 67, 112, 157, 202, 247, 292, 337].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 50 + 36 * Math.cos(rad);
          const cy = 52 + 36 * Math.sin(rad);
          return (
            <motion.circle
              key={`aura-inner-${i}`}
              cx={cx}
              cy={cy}
              r={1.5}
              fill={i % 2 === 0 ? "#fdba74" : "#f97316"}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.8 + i * 0.1,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Golden body outline glow (behind body) */}
        <rect
          x="12"
          y="19"
          width="76"
          height="71"
          rx="32"
          fill="#fbbf24"
          opacity={0.35}
          style={{ filter: "drop-shadow(0 0 8px rgba(251,191,36,0.6))" }}
        />

        {/* Massive flame wings — left wing (3 flame paths, rotated) */}
        <g transform="translate(-12, 30)">
          {/* Left flame 1 — outermost */}
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.4"
            transform="rotate(45, 12, 12) scale(1.8)"
            animate={{
              scale: [1.8, 1.9, 1.75, 1.8],
              rotate: [45, 48, 42, 45],
            }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{
              filter: "drop-shadow(0 0 8px rgba(249,115,22,0.8))",
              transformOrigin: "12px 12px",
            }}
          />
          {/* Left flame 2 — middle */}
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#fb923c"
            stroke="#fdba74"
            strokeWidth="0.3"
            transform="rotate(60, 12, 12) scale(1.4)"
            animate={{
              scale: [1.4, 1.5, 1.35, 1.4],
              rotate: [60, 64, 56, 60],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.3,
              ease: "easeInOut",
              delay: 0.2,
            }}
            style={{
              filter: "drop-shadow(0 0 5px rgba(249,115,22,0.7))",
              transformOrigin: "12px 12px",
            }}
          />
          {/* Left flame 3 — inner */}
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#fbbf24"
            stroke="#fde68a"
            strokeWidth="0.3"
            transform="rotate(35, 12, 12) scale(1.1)"
            animate={{
              scale: [1.1, 1.2, 1.05, 1.1],
              rotate: [35, 38, 32, 35],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: "easeInOut",
              delay: 0.4,
            }}
            style={{
              filter: "drop-shadow(0 0 4px rgba(251,191,36,0.6))",
              transformOrigin: "12px 12px",
            }}
          />
        </g>

        {/* Massive flame wings — right wing (3 flame paths, mirrored) */}
        <g transform="translate(74, 30) scale(-1, 1)">
          {/* Right flame 1 — outermost */}
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.4"
            transform="rotate(45, 12, 12) scale(1.8)"
            animate={{
              scale: [1.8, 1.9, 1.75, 1.8],
              rotate: [45, 48, 42, 45],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              delay: 0.1,
            }}
            style={{
              filter: "drop-shadow(0 0 8px rgba(249,115,22,0.8))",
              transformOrigin: "12px 12px",
            }}
          />
          {/* Right flame 2 — middle */}
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#fb923c"
            stroke="#fdba74"
            strokeWidth="0.3"
            transform="rotate(60, 12, 12) scale(1.4)"
            animate={{
              scale: [1.4, 1.5, 1.35, 1.4],
              rotate: [60, 64, 56, 60],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.3,
              ease: "easeInOut",
              delay: 0.3,
            }}
            style={{
              filter: "drop-shadow(0 0 5px rgba(249,115,22,0.7))",
              transformOrigin: "12px 12px",
            }}
          />
          {/* Right flame 3 — inner */}
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#fbbf24"
            stroke="#fde68a"
            strokeWidth="0.3"
            transform="rotate(35, 12, 12) scale(1.1)"
            animate={{
              scale: [1.1, 1.2, 1.05, 1.1],
              rotate: [35, 38, 32, 35],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: "easeInOut",
              delay: 0.5,
            }}
            style={{
              filter: "drop-shadow(0 0 4px rgba(251,191,36,0.6))",
              transformOrigin: "12px 12px",
            }}
          />
        </g>

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

        {/* Pupils — radiant orange glow */}
        <motion.circle
          cx="37"
          cy="42"
          r="6"
          fill="#f97316"
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 4,
            repeatDelay: 3,
          }}
          style={{ filter: "drop-shadow(0 0 3px rgba(249,115,22,0.6))" }}
        />
        <motion.circle
          cx="63"
          cy="42"
          r="6"
          fill="#f97316"
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 4,
            repeatDelay: 3,
          }}
          style={{ filter: "drop-shadow(0 0 3px rgba(249,115,22,0.6))" }}
        />

        {/* White center dot in orange pupils */}
        <circle cx="37" cy="42" r="2" fill="#ffffff" />
        <circle cx="63" cy="42" r="2" fill="#ffffff" />

        {/* Additional highlight sparkles */}
        <circle cx="40" cy="39" r="1" fill="#ffffff" opacity={0.8} />
        <circle cx="66" cy="39" r="1" fill="#ffffff" opacity={0.8} />

        {/* Beak */}
        <polygon points="47,49 53,49 50,55" fill="#f97316" />

        {/* Wings as curved flame-anchors (short stubs visible below flame wings) */}
        <path
          d="M15,55 Q8,45 5,38"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M85,55 Q92,45 95,38"
          fill="none"
          stroke="#4f46e5"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Halo flame — larger, floating above head */}
        <g transform="translate(38, -6)">
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            fill="#f97316"
            stroke="#fdba74"
            strokeWidth="0.5"
            style={{
              filter: "drop-shadow(0 0 10px rgba(249,115,22,0.9))",
              transformOrigin: "12px 14px",
            }}
            animate={{
              scale: [1.2, 1.3, 1.15, 1.2],
              rotate: [0, 4, -4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </g>

        {/* Golden radiance lines from body */}
        <motion.line
          x1="50"
          y1="10"
          x2="50"
          y2="4"
          stroke="#fbbf24"
          strokeWidth="1"
          strokeLinecap="round"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0 }}
        />
        <motion.line
          x1="30"
          y1="15"
          x2="26"
          y2="10"
          stroke="#fbbf24"
          strokeWidth="1"
          strokeLinecap="round"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
        />
        <motion.line
          x1="70"
          y1="15"
          x2="74"
          y2="10"
          stroke="#fbbf24"
          strokeWidth="1"
          strokeLinecap="round"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, delay: 1 }}
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

    const flamePd =
      "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z";

    // Fire aura particles — outer ring
    const auraAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    auraAngles.forEach((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const cx = ox + 50 + 42 * Math.cos(rad);
      const cy = oy + 52 + 42 * Math.sin(rad);
      ctx.fillStyle = i % 2 === 0 ? "#f97316" : "#fbbf24";
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Inner aura ring
    const innerAngles = [22, 67, 112, 157, 202, 247, 292, 337];
    innerAngles.forEach((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const cx = ox + 50 + 36 * Math.cos(rad);
      const cy = oy + 52 + 36 * Math.sin(rad);
      ctx.fillStyle = i % 2 === 0 ? "#fdba74" : "#f97316";
      ctx.beginPath();
      ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Golden body outline glow
    ctx.fillStyle = "rgba(251, 191, 36, 0.35)";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(ox + 12, oy + 19, 76, 71, 32);
    } else {
      ctx.rect(ox + 12, oy + 19, 76, 71);
    }
    ctx.fill();

    // Massive flame wings — left wing (3 flames)
    ctx.save();
    ctx.translate(ox - 12, oy + 30);

    // Left flame 1 — outermost
    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate((45 * Math.PI) / 180);
    ctx.scale(1.8, 1.8);
    ctx.translate(-12, -12);
    ctx.shadowColor = "rgba(249, 115, 22, 0.8)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#f97316";
    ctx.fill(new Path2D(flamePd));
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.4;
    ctx.stroke(new Path2D(flamePd));
    ctx.restore();

    // Left flame 2 — middle
    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate((60 * Math.PI) / 180);
    ctx.scale(1.4, 1.4);
    ctx.translate(-12, -12);
    ctx.shadowColor = "rgba(249, 115, 22, 0.7)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#fb923c";
    ctx.fill(new Path2D(flamePd));
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.3;
    ctx.stroke(new Path2D(flamePd));
    ctx.restore();

    // Left flame 3 — inner
    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate((35 * Math.PI) / 180);
    ctx.scale(1.1, 1.1);
    ctx.translate(-12, -12);
    ctx.shadowColor = "rgba(251, 191, 36, 0.6)";
    ctx.shadowBlur = 6;
    ctx.fillStyle = "#fbbf24";
    ctx.fill(new Path2D(flamePd));
    ctx.strokeStyle = "#fde68a";
    ctx.lineWidth = 0.3;
    ctx.stroke(new Path2D(flamePd));
    ctx.restore();

    ctx.restore(); // end left wing group

    // Massive flame wings — right wing (3 flames, mirrored)
    ctx.save();
    ctx.translate(ox + 74, oy + 30);
    ctx.scale(-1, 1);

    // Right flame 1 — outermost
    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate((45 * Math.PI) / 180);
    ctx.scale(1.8, 1.8);
    ctx.translate(-12, -12);
    ctx.shadowColor = "rgba(249, 115, 22, 0.8)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#f97316";
    ctx.fill(new Path2D(flamePd));
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.4;
    ctx.stroke(new Path2D(flamePd));
    ctx.restore();

    // Right flame 2 — middle
    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate((60 * Math.PI) / 180);
    ctx.scale(1.4, 1.4);
    ctx.translate(-12, -12);
    ctx.shadowColor = "rgba(249, 115, 22, 0.7)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#fb923c";
    ctx.fill(new Path2D(flamePd));
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.3;
    ctx.stroke(new Path2D(flamePd));
    ctx.restore();

    // Right flame 3 — inner
    ctx.save();
    ctx.translate(12, 12);
    ctx.rotate((35 * Math.PI) / 180);
    ctx.scale(1.1, 1.1);
    ctx.translate(-12, -12);
    ctx.shadowColor = "rgba(251, 191, 36, 0.6)";
    ctx.shadowBlur = 6;
    ctx.fillStyle = "#fbbf24";
    ctx.fill(new Path2D(flamePd));
    ctx.strokeStyle = "#fde68a";
    ctx.lineWidth = 0.3;
    ctx.stroke(new Path2D(flamePd));
    ctx.restore();

    ctx.restore(); // end right wing group

    ctx.shadowBlur = 0;

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

    // Pupils — radiant orange
    ctx.shadowColor = "rgba(249, 115, 22, 0.6)";
    ctx.shadowBlur = 5;
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 42, 6, 0, Math.PI * 2);
    ctx.arc(ox + 63, oy + 42, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // White center dot in pupils
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(ox + 37, oy + 42, 2, 0, Math.PI * 2);
    ctx.arc(ox + 63, oy + 42, 2, 0, Math.PI * 2);
    ctx.fill();

    // Highlight sparkles
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(ox + 40, oy + 39, 1, 0, Math.PI * 2);
    ctx.arc(ox + 66, oy + 39, 1, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(ox + 47, oy + 49);
    ctx.lineTo(ox + 53, oy + 49);
    ctx.lineTo(ox + 50, oy + 55);
    ctx.closePath();
    ctx.fill();

    // Wings (short stubs anchoring flame wings)
    ctx.strokeStyle = "#4f46e5";
    ctx.lineWidth = 9;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(ox + 15, oy + 55);
    ctx.quadraticCurveTo(ox + 8, oy + 45, ox + 5, oy + 38);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 85, oy + 55);
    ctx.quadraticCurveTo(ox + 92, oy + 45, ox + 95, oy + 38);
    ctx.stroke();

    // Halo flame — larger, above head
    ctx.save();
    ctx.translate(ox + 38, oy - 6);
    ctx.scale(1.2, 1.2);
    ctx.shadowColor = "rgba(249, 115, 22, 0.9)";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#f97316";
    const haloFlame = new Path2D(flamePd);
    ctx.fill(haloFlame);
    ctx.strokeStyle = "#fdba74";
    ctx.lineWidth = 0.5;
    ctx.stroke(haloFlame);
    ctx.restore();

    ctx.shadowBlur = 0;

    // Golden radiance lines
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.6;

    ctx.beginPath();
    ctx.moveTo(ox + 50, oy + 10);
    ctx.lineTo(ox + 50, oy + 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 30, oy + 15);
    ctx.lineTo(ox + 26, oy + 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ox + 70, oy + 15);
    ctx.lineTo(ox + 74, oy + 10);
    ctx.stroke();

    ctx.globalAlpha = 1;

    ctx.restore();
  },
};
