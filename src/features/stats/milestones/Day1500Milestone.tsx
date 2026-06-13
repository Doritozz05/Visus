import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

const steps = (n: number) => (t: number) => Math.floor(t * n) / n;

export const Day1500Milestone: StreakMilestone = {
  id: "day1500",
  isMatch: (s) => s >= 1500 && s < 2000,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="-5 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_12px_rgba(236,72,153,0.3)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
      >
        {/* RGB Split Back Layer (Cyan) */}
        <motion.g
          animate={{ x: [-3, 3, -1, 4, -2], opacity: [0.5, 0.8, 0.3, 0.9, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.3, ease: steps(5) }}
        >
          <rect x="13" y="22" width="70" height="65" rx="30" fill="#06b6d4" />
          <polygon points="18,35 48,35 23,18" fill="#06b6d4" />
          <polygon points="48,35 78,35 73,18" fill="#06b6d4" />
        </motion.g>

        {/* RGB Split Back Layer (Magenta) */}
        <motion.g
          animate={{ x: [3, -2, 4, -1, 2], opacity: [0.5, 0.9, 0.4, 0.8, 0.6] }}
          transition={{ repeat: Infinity, duration: 0.25, ease: steps(4) }}
        >
          <rect x="17" y="22" width="70" height="65" rx="30" fill="#ec4899" />
          <polygon points="22,35 52,35 27,18" fill="#ec4899" />
          <polygon points="52,35 82,35 77,18" fill="#ec4899" />
        </motion.g>

        {/* Main Body (Dark Glitch) */}
        <motion.g
          animate={{ x: [-1, 1, 0, -1, 1] }}
          transition={{ repeat: Infinity, duration: 0.4, ease: steps(3) }}
        >
          <polygon points="20,35 50,35 25,18" fill="#0f172a" />
          <polygon points="50,35 80,35 75,18" fill="#0f172a" />
          
          <rect x="15" y="22" width="70" height="65" rx="30" fill="#1e1b4b" />
          
          {/* Missingno/Glitch blocks cutting into body */}
          <rect x="10" y="30" width="20" height="8" fill="#0f172a" />
          <rect x="70" y="60" width="20" height="12" fill="#0f172a" />
          <rect x="30" y="75" width="40" height="5" fill="#0f172a" />

          {/* Feet (Pixelated) */}
          <rect x="28" y="86" width="8" height="6" fill="#f43f5e" />
          <rect x="64" y="86" width="8" height="6" fill="#f43f5e" />

          {/* Belly (Wireframe/Static) */}
          <ellipse cx="50" cy="62" rx="22" ry="18" fill="#020617" stroke="#ec4899" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="30" y1="62" x2="70" y2="62" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50" y1="44" x2="50" y2="80" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" />

          {/* Eyes outer white (Corrupted shapes) */}
          <rect x="25" y="30" width="24" height="24" fill="#ffffff" />
          <rect x="51" y="30" width="24" height="24" fill="#ffffff" />

          {/* Pupils (Error Symbols) */}
          <text x="37" y="48" fontFamily="monospace" fontSize="16" fontWeight="bold" fill="#f43f5e" textAnchor="middle">X</text>
          <text x="63" y="48" fontFamily="monospace" fontSize="16" fontWeight="bold" fill="#f43f5e" textAnchor="middle">X</text>

          {/* Beak (Jagged) */}
          <polygon points="45,49 55,49 55,55 45,55" fill="#eab308" />

          {/* Glitch Wings */}
          <path d="M15,55 L5,55 L5,65 L10,65 L10,75 L15,75" fill="none" stroke="#06b6d4" strokeWidth="4" />
          <path d="M85,55 L95,55 L95,65 L90,65 L90,75 L85,75" fill="none" stroke="#ec4899" strokeWidth="4" />
        </motion.g>

        {/* Floating Static Lines */}
        <motion.rect x="0" y="20" width="110" height="2" fill="#ffffff" opacity="0.8" animate={{ y: [0, 80, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
        <motion.rect x="0" y="60" width="110" height="4" fill="#06b6d4" opacity="0.4" animate={{ y: [0, -60, 0] }} transition={{ repeat: Infinity, duration: 0.8, ease: steps(10) }} />
        <motion.rect x="20" y="40" width="70" height="1" fill="#ec4899" opacity="0.9" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.1 }} />

      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);
    ctx.translate(18.75, 10);
    ctx.scale(0.8, 0.8);

    const ox = 0; const oy = 0;

    // Static RGB Split Simulation
    // Cyan Layer
    ctx.fillStyle = "#06b6d4"; ctx.globalAlpha = 0.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox+12, oy+22, 70, 65, 30); else ctx.rect(ox+12, oy+22, 70, 65);
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+17, oy+35); ctx.lineTo(ox+47, oy+35); ctx.lineTo(ox+22, oy+18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+47, oy+35); ctx.lineTo(ox+77, oy+35); ctx.lineTo(ox+72, oy+18); ctx.fill();

    // Magenta Layer
    ctx.fillStyle = "#ec4899"; ctx.globalAlpha = 0.5;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox+18, oy+22, 70, 65, 30); else ctx.rect(ox+18, oy+22, 70, 65);
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+23, oy+35); ctx.lineTo(ox+53, oy+35); ctx.lineTo(ox+28, oy+18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+53, oy+35); ctx.lineTo(ox+83, oy+35); ctx.lineTo(ox+78, oy+18); ctx.fill();

    ctx.globalAlpha = 1.0;

    // Main Body
    ctx.fillStyle = "#0f172a";
    ctx.beginPath(); ctx.moveTo(ox+20, oy+35); ctx.lineTo(ox+50, oy+35); ctx.lineTo(ox+25, oy+18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+50, oy+35); ctx.lineTo(ox+80, oy+35); ctx.lineTo(ox+75, oy+18); ctx.fill();

    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox+15, oy+22, 70, 65, 30); else ctx.rect(ox+15, oy+22, 70, 65);
    ctx.fill();

    // Glitch Blocks
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(ox+10, oy+30, 20, 8);
    ctx.fillRect(ox+70, oy+60, 20, 12);
    ctx.fillRect(ox+30, oy+75, 40, 5);

    // Pixel Feet
    ctx.fillStyle = "#f43f5e";
    ctx.fillRect(ox+28, oy+86, 8, 6);
    ctx.fillRect(ox+64, oy+86, 8, 6);

    // Wireframe Belly
    ctx.fillStyle = "#020617"; ctx.strokeStyle = "#ec4899"; ctx.lineWidth = 1; ctx.setLineDash([2, 2]);
    ctx.beginPath(); ctx.ellipse(ox+50, oy+62, 22, 18, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#06b6d4"; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(ox+30, oy+62); ctx.lineTo(ox+70, oy+62); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+50, oy+44); ctx.lineTo(ox+50, oy+80); ctx.stroke();
    ctx.setLineDash([]);

    // Glitch Eyes
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(ox+25, oy+30, 24, 24);
    ctx.fillRect(ox+51, oy+30, 24, 24);

    ctx.fillStyle = "#f43f5e";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("X", ox+37, oy+48);
    ctx.fillText("X", ox+63, oy+48);

    // Beak
    ctx.fillStyle = "#eab308";
    ctx.fillRect(ox+45, oy+49, 10, 6);

    // Glitch Wings
    ctx.strokeStyle = "#06b6d4"; ctx.lineWidth = 4; ctx.lineJoin = "miter";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+55); ctx.lineTo(ox+5, oy+55); ctx.lineTo(ox+5, oy+65); ctx.lineTo(ox+10, oy+65); ctx.lineTo(ox+10, oy+75); ctx.lineTo(ox+15, oy+75); ctx.stroke();
    
    ctx.strokeStyle = "#ec4899";
    ctx.beginPath(); ctx.moveTo(ox+85, oy+55); ctx.lineTo(ox+95, oy+55); ctx.lineTo(ox+95, oy+65); ctx.lineTo(ox+90, oy+65); ctx.lineTo(ox+90, oy+75); ctx.lineTo(ox+85, oy+75); ctx.stroke();

    // Static Scanlines
    ctx.fillStyle = "#ffffff"; ctx.globalAlpha = 0.8;
    ctx.fillRect(ox+0, oy+40, 110, 2);
    ctx.fillStyle = "#06b6d4"; ctx.globalAlpha = 0.4;
    ctx.fillRect(ox+0, oy+60, 110, 4);

    ctx.restore();
  },
};