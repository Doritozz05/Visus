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
      <motion.g
        style={{ scale: 0.8, transformOrigin: "center center" }}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        {/* Ninja Smoke Background */}
        <motion.circle cx="30" cy="80" r="15" fill="#94a3b8" opacity="0.3" filter="blur(4px)" animate={{ x: [-5, 5, -5], opacity: [0.2, 0.4, 0.2] }} transition={{ repeat: Infinity, duration: 3 }} />
        <motion.circle cx="80" cy="75" r="20" fill="#64748b" opacity="0.3" filter="blur(4px)" animate={{ x: [5, -5, 5], opacity: [0.2, 0.4, 0.2] }} transition={{ repeat: Infinity, duration: 4 }} />

        {/* Ears */}
        <polygon points="20,35 50,35 25,18" fill="#1e1b4b" />
        <polygon points="50,35 80,35 75,18" fill="#1e1b4b" />

        {/* Feet (Stealth dark) */}
        <ellipse cx="32" cy="86" rx="6" ry="4" fill="#1e293b" />
        <ellipse cx="68" cy="86" rx="6" ry="4" fill="#1e293b" />

        {/* Body (Ninja Suit) */}
        <rect x="15" y="22" width="70" height="65" rx="30" fill="#312e81" />
        
        {/* Belt */}
        <rect x="15" y="60" width="70" height="6" fill="#ef4444" />
        <path d="M45,60 L50,66 L55,60 Z" fill="#b91c1c" />

        {/* Ninja Headband (Hachimaki) - Front */}
        <rect x="15" y="26" width="70" height="12" fill="#ef4444" />
        {/* Headband Tails blowing in wind */}
        <motion.path
          d="M85,32 Q95,30 105,40"
          fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round"
          animate={{ d: ["M85,32 Q95,30 105,40", "M85,32 Q95,40 105,35", "M85,32 Q95,30 105,40"] }}
          transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M85,34 Q90,40 98,48"
          fill="none" stroke="#b91c1c" strokeWidth="5" strokeLinecap="round"
          animate={{ d: ["M85,34 Q90,40 98,48", "M85,34 Q95,45 100,40", "M85,34 Q90,40 98,48"] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        />

        {/* Mask covering lower face */}
        <path d="M15,48 Q50,42 85,48 L85,80 Q50,90 15,80 Z" fill="#1e1b4b" />

        {/* Eyes (Fierce) */}
        <path d="M25,44 L49,46 L49,38 L25,40 Z" fill="#ffffff" />
        <path d="M51,46 L75,44 L75,40 L51,38 Z" fill="#ffffff" />

        <circle cx="39" cy="42" r="3" fill="#ef4444" />
        <circle cx="61" cy="42" r="3" fill="#ef4444" />
        <circle cx="40" cy="41" r="1" fill="#ffffff" />
        <circle cx="62" cy="41" r="1" fill="#ffffff" />

        {/* Katana on Back */}
        <line x1="10" y1="20" x2="30" y2="40" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
        <line x1="8" y1="25" x2="15" y2="18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />

        {/* Right Wing (Throwing Shuriken) */}
        <motion.path
          d="M85,55 Q95,45 105,40"
          fill="none" stroke="#312e81" strokeWidth="9" strokeLinecap="round"
          animate={{ rotate: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 0.3, repeatDelay: 2 }}
          style={{ transformOrigin: "85px 55px" }}
        />

        {/* Left Wing (Stealth) */}
        <path d="M15,55 Q5,65 10,75" fill="none" stroke="#312e81" strokeWidth="9" strokeLinecap="round" />

        {/* Shurikens flying */}
        <motion.g
          animate={{ x: [0, 40], y: [0, -20], rotate: [0, 360], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5, repeatDelay: 1.8 }}
          style={{ transformOrigin: "90px 40px" }}
        >
          <path d="M88,40 L90,36 L92,40 L96,42 L92,44 L90,48 L88,44 L84,42 Z" fill="#94a3b8" />
        </motion.g>
        <motion.g
          animate={{ x: [0, 30], y: [0, -10], rotate: [0, 360], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, repeatDelay: 1.7, delay: 0.1 }}
          style={{ transformOrigin: "80px 30px" }}
        >
          <path d="M78,30 L80,26 L82,30 L86,32 L82,34 L80,38 L78,34 L74,32 Z" fill="#cbd5e1" />
        </motion.g>
      </motion.g>
    </svg>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(2.8, 2.8);

    ctx.translate(11, 10);
    ctx.scale(0.8, 0.8);

    const ox = 0;
    const oy = 0;

    // Smoke
    ctx.fillStyle = "#94a3b8"; ctx.globalAlpha = 0.3; ctx.shadowColor = "#94a3b8"; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(ox + 30, oy + 80, 15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#64748b";
    ctx.beginPath(); ctx.arc(ox + 80, oy + 75, 20, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1.0;

    // Katana Back
    ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox + 10, oy + 20); ctx.lineTo(ox + 30, oy + 40); ctx.stroke();
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox + 8, oy + 25); ctx.lineTo(ox + 15, oy + 18); ctx.stroke();

    // Ears
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.moveTo(ox + 20, oy + 35); ctx.lineTo(ox + 50, oy + 35); ctx.lineTo(ox + 25, oy + 18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox + 50, oy + 35); ctx.lineTo(ox + 80, oy + 35); ctx.lineTo(ox + 75, oy + 18); ctx.fill();

    // Feet
    ctx.fillStyle = "#1e293b";
    ctx.beginPath(); ctx.ellipse(ox + 32, oy + 86, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(ox + 68, oy + 86, 6, 4, 0, 0, Math.PI * 2); ctx.fill();

    // Body
    ctx.fillStyle = "#312e81";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(ox + 15, oy + 22, 70, 65, 30);
    else ctx.rect(ox + 15, oy + 22, 70, 65);
    ctx.fill();

    // Belt
    ctx.fillStyle = "#ef4444"; ctx.fillRect(ox + 15, oy + 60, 70, 6);
    ctx.fillStyle = "#b91c1c"; ctx.beginPath(); ctx.moveTo(ox + 45, oy + 60); ctx.lineTo(ox + 50, oy + 66); ctx.lineTo(ox + 55, oy + 60); ctx.fill();

    // Mask
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.moveTo(ox + 15, oy + 48); ctx.quadraticCurveTo(ox + 50, oy + 42, ox + 85, oy + 48); ctx.lineTo(ox + 85, oy + 80); ctx.quadraticCurveTo(ox + 50, oy + 90, ox + 15, oy + 80); ctx.closePath(); ctx.fill();

    // Headband
    ctx.fillStyle = "#ef4444"; ctx.fillRect(ox + 15, oy + 26, 70, 12);
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox + 85, oy + 32); ctx.quadraticCurveTo(ox + 95, oy + 30, ox + 105, oy + 40); ctx.stroke();
    ctx.strokeStyle = "#b91c1c"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(ox + 85, oy + 34); ctx.quadraticCurveTo(ox + 90, oy + 40, ox + 98, oy + 48); ctx.stroke();

    // Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.moveTo(ox+25, oy+44); ctx.lineTo(ox+49, oy+46); ctx.lineTo(ox+49, oy+38); ctx.lineTo(ox+25, oy+40); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ox+51, oy+46); ctx.lineTo(ox+75, oy+44); ctx.lineTo(ox+75, oy+40); ctx.lineTo(ox+51, oy+38); ctx.fill();

    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(ox + 39, oy + 42, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 61, oy + 42, 3, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(ox + 40, oy + 41, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox + 62, oy + 41, 1, 0, Math.PI * 2); ctx.fill();

    // Wings
    ctx.strokeStyle = "#312e81"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox + 15, oy + 55); ctx.quadraticCurveTo(ox + 5, oy + 65, ox + 10, oy + 75); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox + 85, oy + 55); ctx.quadraticCurveTo(ox + 95, oy + 45, ox + 105, oy + 40); ctx.stroke();

    // Static Shuriken (frozen mid-air)
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath(); ctx.moveTo(ox+98, oy+30); ctx.lineTo(ox+100, oy+26); ctx.lineTo(ox+102, oy+30); ctx.lineTo(ox+106, oy+32); ctx.lineTo(ox+102, oy+34); ctx.lineTo(ox+100, oy+38); ctx.lineTo(ox+98, oy+34); ctx.lineTo(ox+94, oy+32); ctx.closePath(); ctx.fill();

    ctx.restore();
  },
};