"use client";

import React, { MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  radius?: number;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(var(--primary), 0.15)",
  radius = 350,
  ...props
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightBackground = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`;

  const borderMask = useMotionTemplate`radial-gradient(${radius * 0.75}px circle at ${mouseX}px ${mouseY}px, black, transparent 100%)`;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative rounded-3xl border border-border/30 bg-card shadow-xl transition-colors",
        className
      )}
      {...props}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background: spotlightBackground }}
      />

      <motion.div
        className="pointer-events-none absolute -inset-px z-0 rounded-3xl border border-primary/20 opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-50"
        style={{
          maskImage: borderMask,
          WebkitMaskImage: borderMask,
        }}
      />

      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
