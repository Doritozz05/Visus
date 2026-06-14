"use client";

import * as React from "react";
import { motion } from "framer-motion";

interface VisiMascotProps {
  variant?: "empty" | "error" | "default";
  className?: string;
  size?: number;
}

export function VisiMascot({ variant = "default", className = "", size = 120 }: VisiMascotProps) {
  // Generic animated Visi SVG
  const renderVisi = () => {
    switch (variant) {
      case "error":
        return (
          <svg
            viewBox="-5 0 110 100"
            className={`drop-shadow-[0_8px_24px_rgba(79,70,229,0.15)] ${className}`}
            style={{ width: size, height: size }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.g
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Visi looking at the question mark */}
              <motion.g
                style={{ scale: 0.8, transformOrigin: "40px 50px" }}
                animate={{ y: [1, -1, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
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

                {/* Eyes - Normal White bases */}
                <circle cx="37" cy="42" r="11" fill="#ffffff" />
                <circle cx="63" cy="42" r="11" fill="#ffffff" />
                
                {/* Pupils (Shifted to the right to look at the '?') */}
                <circle cx="41" cy="42" r="4.5" fill="#1e1b4b" />
                <circle cx="67" cy="42" r="4.5" fill="#1e1b4b" />
                
                {/* Highlights */}
                <circle cx="43" cy="40" r="1.5" fill="#ffffff" />
                <circle cx="69" cy="40" r="1.5" fill="#ffffff" />

                {/* Beak */}
                <polygon points="49,50 55,50 52,56" fill="#f97316" />

                {/* Left wing scratching head/chin */}
                <motion.path 
                  d="M15,55 Q5,40 25,35" 
                  fill="none" stroke="#4f46e5" strokeWidth="8" strokeLinecap="round" 
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ transformOrigin: "15px 55px" }}
                />

                {/* Right wing normal */}
                <path d="M85,55 Q95,60 90,72" fill="none" stroke="#4f46e5" strokeWidth="8" strokeLinecap="round" />
              </motion.g>

              {/* Big Animated Question Mark (Rendered after Visi so it's on top if they touch, and positioned to the right) */}
              <motion.g
                animate={{ 
                  y: [-3, 3, -3],
                  rotate: [-2, 2, -2]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                style={{ transformOrigin: "85px 40px" }}
              >
                <text x="75" y="45" fontFamily="sans-serif" fontSize="52" fontWeight="bold" fill="#f59e0b" className="drop-shadow-md">
                  ?
                </text>
                <motion.circle 
                  cx="88" cy="55" r="15" 
                  fill="#f59e0b" opacity="0.1" 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0, 0.1] }} 
                  transition={{ repeat: Infinity, duration: 2 }} 
                />
              </motion.g>
            </motion.g>
          </svg>
        );



      case "empty":
        return (
          <svg
            viewBox="-5 0 110 100"
            className={`drop-shadow-[0_4px_12px_rgba(79,70,229,0.15)] ${className}`}
            style={{ width: size, height: size }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.g
              style={{ scale: 0.8, transformOrigin: "center center" }}
              animate={{ y: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
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

              {/* Eyes */}
              <circle cx="37" cy="45" r="10" fill="#ffffff" />
              <circle cx="63" cy="45" r="10" fill="#ffffff" />
              <motion.circle cx="37" cy="45" r="4" fill="#1e1b4b" animate={{ x: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2.5 }} />
              <motion.circle cx="63" cy="45" r="4" fill="#1e1b4b" animate={{ x: [-2, 2, -2] }} transition={{ repeat: Infinity, duration: 2.5 }} />

              {/* Beak */}
              <polygon points="47,51 53,51 50,56" fill="#f97316" />

              {/* Detective Hat */}
              <path d="M25,25 Q50,15 75,25 L85,25 Q50,0 15,25 Z" fill="#64748b" />
              <rect x="30" y="10" width="40" height="15" rx="5" fill="#475569" />
              <rect x="30" y="20" width="40" height="3" fill="#1e293b" />

              {/* Magnifying Glass (Right Wing holding it) */}
              <motion.g
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{ transformOrigin: "88px 65px" }}
              >
                {/* Arm/Wing */}
                <path d="M78,55 Q98,60 88,75" fill="none" stroke="#4f46e5" strokeWidth="8" strokeLinecap="round" />
                {/* Handle */}
                <line x1="88" y1="75" x2="98" y2="85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                {/* Glass */}
                <circle cx="101" cy="88" r="8" fill="#e0f2fe" opacity="0.6" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="97" y1="84" x2="99" y2="86" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              </motion.g>

              {/* Left Wing */}
              <path d="M25,55 Q5,60 15,75" fill="none" stroke="#4f46e5" strokeWidth="8" strokeLinecap="round" />
            </motion.g>
          </svg>
        );

      default:
        return (
          <svg
            viewBox="-5 0 110 100"
            className={`drop-shadow-[0_4px_12px_rgba(79,70,229,0.15)] ${className}`}
            style={{ width: size, height: size }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.g
              style={{ scale: 0.8, transformOrigin: "center center" }}
              animate={{ y: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
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

              {/* Eyes */}
              <circle cx="37" cy="45" r="10" fill="#ffffff" />
              <circle cx="63" cy="45" r="10" fill="#ffffff" />
              <circle cx="37" cy="45" r="4" fill="#1e1b4b" />
              <circle cx="63" cy="45" r="4" fill="#1e1b4b" />

              {/* Beak */}
              <polygon points="47,51 53,51 50,56" fill="#f97316" />

              {/* Wings */}
              <path d="M15,55 Q5,60 10,75" fill="none" stroke="#4f46e5" strokeWidth="8" strokeLinecap="round" />
              <path d="M85,55 Q95,60 90,75" fill="none" stroke="#4f46e5" strokeWidth="8" strokeLinecap="round" />
            </motion.g>
          </svg>
        );
    }
  };

  return <div className="flex items-center justify-center">{renderVisi()}</div>;
}
