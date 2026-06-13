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
            className={`drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] grayscale ${className}`}
            style={{ width: size, height: size, opacity: 0.8 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.g
              style={{ scale: 0.8, transformOrigin: "center center" }}
              animate={{ x: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              {/* Drooping Ears */}
              <polygon points="20,40 45,35 15,25" fill="#4f46e5" />
              <polygon points="55,35 80,40 85,25" fill="#4f46e5" />
              
              {/* Feet */}
              <ellipse cx="32" cy="86" rx="6" ry="4" fill="#f97316" />
              <ellipse cx="68" cy="86" rx="6" ry="4" fill="#f97316" />
              
              {/* Body */}
              <rect x="15" y="22" width="70" height="65" rx="30" fill="#4f46e5" />
              
              {/* Belly */}
              <ellipse cx="50" cy="62" rx="22" ry="18" fill="#c7d2fe" />
              
              {/* Sad Eyes (Confused/Error) */}
              <circle cx="37" cy="45" r="10" fill="#ffffff" />
              <circle cx="63" cy="45" r="10" fill="#ffffff" />
              <motion.circle cx="37" cy="47" r="4" fill="#1e1b4b" animate={{ x: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 1 }} />
              <motion.circle cx="63" cy="47" r="4" fill="#1e1b4b" animate={{ x: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 1 }} />
              
              <path d="M25,35 L49,43 L49,30 Z" fill="#4f46e5" />
              <path d="M51,43 L75,35 L75,30 Z" fill="#4f46e5" />
              
              {/* Beak */}
              <polygon points="47,53 53,53 50,56" fill="#f97316" />
              
              {/* Drooping Wings holding broken book pages */}
              <path d="M15,55 Q5,70 15,80" fill="none" stroke="#4f46e5" strokeWidth="9" strokeLinecap="round" />
              <path d="M85,55 Q95,70 85,80" fill="none" stroke="#4f46e5" strokeWidth="9" strokeLinecap="round" />
              
              {/* Scattered Pages/Books */}
              <rect x="10" y="82" width="20" height="15" fill="#f8fafc" transform="rotate(-15 20 85)" />
              <line x1="12" y1="86" x2="26" y2="84" stroke="#cbd5e1" strokeWidth="1" transform="rotate(-15 20 85)" />
              <line x1="12" y1="90" x2="24" y2="88" stroke="#cbd5e1" strokeWidth="1" transform="rotate(-15 20 85)" />
              
              <rect x="70" y="80" width="18" height="14" fill="#f8fafc" transform="rotate(25 80 85)" />
              <line x1="72" y1="84" x2="84" y2="86" stroke="#cbd5e1" strokeWidth="1" transform="rotate(25 80 85)" />

              {/* Oops Text */}
              <text x="50" y="5" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="middle" letterSpacing="1px">404 - OOPS!</text>
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
