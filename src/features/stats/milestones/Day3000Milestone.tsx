import * as React from "react";
import { motion } from "framer-motion";
import { StreakMilestone } from "./types";

export const Day3000Milestone: StreakMilestone = {
  id: "day3000",
  isMatch: (s) => s >= 3000 && s < 5000,
  canvasWidth: 308,
  canvasHeight: 280,
  gap: 20,
  renderPreview: () => (
    <svg
      viewBox="-5 0 110 100"
      className="w-full h-full drop-shadow-[0_4px_16px_rgba(22,163,74,0.4)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* Ancient runes circle background */}
        <motion.circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="3 6 9" opacity="0.4" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />
        <motion.circle cx="50" cy="50" r="35" fill="none" stroke="#16a34a" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} style={{ transformOrigin: "50px 50px" }} />

        {/* Tentacle Wings (Back) */}
        <motion.path
          d="M25,50 Q-10,10 0,30 Q10,50 25,60" fill="none" stroke="#064e3b" strokeWidth="8" strokeLinecap="round"
          animate={{ d: ["M25,50 Q-10,10 0,30 Q10,50 25,60", "M25,50 Q0,20 -5,40 Q5,60 25,60", "M25,50 Q-10,10 0,30 Q10,50 25,60"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
        <motion.path
          d="M75,50 Q110,10 100,30 Q90,50 75,60" fill="none" stroke="#064e3b" strokeWidth="8" strokeLinecap="round"
          animate={{ d: ["M75,50 Q110,10 100,30 Q90,50 75,60", "M75,50 Q100,20 105,40 Q95,60 75,60", "M75,50 Q110,10 100,30 Q90,50 75,60"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Ears */}
        <polygon points="20,35 50,35 25,18" fill="#022c22" />
        <polygon points="50,35 80,35 75,18" fill="#022c22" />

        {/* Feet (Shadowy wisps) */}
        <path d="M32,86 Q25,95 35,100 Q40,95 32,86" fill="#064e3b" />
        <path d="M68,86 Q75,95 65,100 Q60,95 68,86" fill="#064e3b" />

        {/* Body (Eldritch Dark Green) */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#022c22" />

        {/* Belly (Swirling Void) */}
        <ellipse cx="50" cy="62" rx="22" ry="18" fill="#064e3b" />
        <motion.circle cx="50" cy="62" r="10" fill="none" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" animate={{ rotate: 360, scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} style={{ transformOrigin: "50px 62px" }} />

        {/* Eyes outer white (Corrupted/Glowing Green) */}
        <circle cx="37" cy="42" r="12" fill="#14532d" />
        <circle cx="63" cy="42" r="12" fill="#14532d" />

        {/* Pupils (Multiple Slits / Many Eyes effect) */}
        {/* Main Left */}
        <circle cx="37" cy="42" r="6" fill="#22c55e" />
        <ellipse cx="37" cy="42" rx="1.5" ry="6" fill="#020617" />
        {/* Main Right */}
        <circle cx="63" cy="42" r="6" fill="#22c55e" />
        <ellipse cx="63" cy="42" rx="1.5" ry="6" fill="#020617" />
        
        {/* Extra Eyes on Forehead */}
        <circle cx="50" cy="25" r="4" fill="#14532d" />
        <circle cx="50" cy="25" r="2" fill="#22c55e" />
        <ellipse cx="50" cy="25" rx="0.5" ry="2" fill="#020617" />

        <circle cx="35" cy="22" r="3" fill="#14532d" />
        <circle cx="35" cy="22" r="1.5" fill="#22c55e" />
        <ellipse cx="35" cy="22" rx="0.5" ry="1.5" fill="#020617" />

        <circle cx="65" cy="22" r="3" fill="#14532d" />
        <circle cx="65" cy="22" r="1.5" fill="#22c55e" />
        <ellipse cx="65" cy="22" rx="0.5" ry="1.5" fill="#020617" />

        {/* Beak (Dark) */}
        <polygon points="47,49 53,49 50,55" fill="#064e3b" />

        {/* Front Tentacle Wings */}
        <motion.path
          d="M15,55 Q5,80 25,90 Q35,80 20,65" fill="none" stroke="#047857" strokeWidth="6" strokeLinecap="round"
          animate={{ d: ["M15,55 Q5,80 25,90 Q35,80 20,65", "M15,55 Q0,70 20,80 Q30,70 20,65", "M15,55 Q5,80 25,90 Q35,80 20,65"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
        <motion.path
          d="M85,55 Q95,80 75,90 Q65,80 80,65" fill="none" stroke="#047857" strokeWidth="6" strokeLinecap="round"
          animate={{ d: ["M85,55 Q95,80 75,90 Q65,80 80,65", "M85,55 Q100,70 80,80 Q70,70 80,65", "M85,55 Q95,80 75,90 Q65,80 80,65"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Floating Eldritch Magic */}
        <motion.path d="M10,20 L15,25 L10,30" fill="none" stroke="#4ade80" strokeWidth="1.5" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2 }} />
        <motion.path d="M90,20 L85,25 L90,30" fill="none" stroke="#4ade80" strokeWidth="1.5" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} />
        
        {/* Glow Effects */}
        <circle cx="37" cy="42" r="2" fill="#86efac" opacity="0.8" />
        <circle cx="63" cy="42" r="2" fill="#86efac" opacity="0.8" />

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

    // Runes Circle
    ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 1; ctx.globalAlpha = 0.4; ctx.setLineDash([3, 6, 9]);
    ctx.beginPath(); ctx.arc(ox+50, oy+50, 45, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = "#16a34a"; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.3; ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.arc(ox+50, oy+50, 35, 0, Math.PI*2); ctx.stroke();
    ctx.globalAlpha = 1.0; ctx.setLineDash([]);

    // Back Tentacles
    ctx.strokeStyle = "#064e3b"; ctx.lineWidth = 8; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+25, oy+50); ctx.quadraticCurveTo(ox-10, oy+10, ox+0, oy+30); ctx.quadraticCurveTo(ox+10, oy+50, ox+25, oy+60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+75, oy+50); ctx.quadraticCurveTo(ox+110, oy+10, ox+100, oy+30); ctx.quadraticCurveTo(ox+90, oy+50, ox+75, oy+60); ctx.stroke();

    // Ears
    ctx.fillStyle = "#022c22";
    ctx.beginPath(); ctx.moveTo(ox + 20, oy + 35); ctx.lineTo(ox + 50, oy + 35); ctx.lineTo(ox + 25, oy + 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox + 50, oy + 35); ctx.lineTo(ox + 80, oy + 35); ctx.lineTo(ox + 75, oy + 18); ctx.fill();

    // Wisp Feet
    ctx.fillStyle = "#064e3b";
    ctx.beginPath(); ctx.moveTo(ox+32, oy+86); ctx.quadraticCurveTo(ox+25, oy+95, ox+35, oy+100); ctx.quadraticCurveTo(ox+40, oy+95, ox+32, oy+86); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+68, oy+86); ctx.quadraticCurveTo(ox+75, oy+95, ox+65, oy+100); ctx.quadraticCurveTo(ox+60, oy+95, ox+68, oy+86); ctx.fill();

    // Body
    ctx.fillStyle = "#022c22";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    else ctx.rect(ox + 15, oy + 22, 70, 65);
    ctx.fill();

    // Belly
    ctx.fillStyle = "#064e3b";
    ctx.beginPath(); ctx.ellipse(ox + 50, oy + 62, 22, 18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.arc(ox+50, oy+62, 10, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(ox+50, oy+62, 14, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);

    // Eyes outer
    ctx.fillStyle = "#14532d";
    ctx.beginPath(); ctx.arc(ox + 37, oy + 42, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 63, oy + 42, 12, 0, Math.PI * 2); ctx.fill();

    // Main Eyes
    ctx.fillStyle = "#22c55e";
    ctx.beginPath(); ctx.arc(ox+37, oy+42, 6, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+63, oy+42, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#020617";
    ctx.beginPath(); ctx.ellipse(ox+37, oy+42, 1.5, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ox+63, oy+42, 1.5, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "#86efac"; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(ox+37, oy+42, 2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox+63, oy+42, 2, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Extra Eyes
    const drawExtraEye = (cx: number, cy: number, r: number) => {
      ctx.fillStyle = "#14532d"; ctx.beginPath(); ctx.arc(ox+cx, oy+cy, r, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#22c55e"; ctx.beginPath(); ctx.arc(ox+cx, oy+cy, r*0.5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#020617"; ctx.beginPath(); ctx.ellipse(ox+cx, oy+cy, r*0.125, r*0.5, 0, 0, Math.PI*2); ctx.fill();
    };
    drawExtraEye(50, 25, 4);
    drawExtraEye(35, 22, 3);
    drawExtraEye(65, 22, 3);

    // Beak
    ctx.fillStyle = "#064e3b";
    ctx.beginPath(); ctx.moveTo(ox + 47, oy + 49); ctx.lineTo(ox + 53, oy + 49); ctx.lineTo(ox + 50, oy + 55); ctx.fill();

    // Front Tentacles
    ctx.strokeStyle = "#047857"; ctx.lineWidth = 6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox+15, oy+55); ctx.quadraticCurveTo(ox+5, oy+80, ox+25, oy+90); ctx.quadraticCurveTo(ox+35, oy+80, ox+20, oy+65); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+85, oy+55); ctx.quadraticCurveTo(ox+95, oy+80, ox+75, oy+90); ctx.quadraticCurveTo(ox+65, oy+80, ox+80, oy+65); ctx.stroke();

    // Floating Magic
    ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 1.5; ctx.lineJoin = "miter";
    ctx.beginPath(); ctx.moveTo(ox+10, oy+20); ctx.lineTo(ox+15, oy+25); ctx.lineTo(ox+10, oy+30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox+90, oy+20); ctx.lineTo(ox+85, oy+25); ctx.lineTo(ox+90, oy+30); ctx.stroke();

    ctx.restore();
  },
};