"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { TraditionalDemo } from "./TraditionalDemo";

interface HeroClientProps {
  title: React.ReactNode;
  description: string;
  cta: React.ReactNode;
}

export function HeroClient({ title, description, cta }: HeroClientProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center w-full"
    >
      <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8 backdrop-blur-sm">
        <Zap className="w-4 h-4" />
        <span>The next generation of reading</span>
      </motion.div>

      <div className="mb-6">
        {title}
      </div>

      <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
        {description}
      </motion.p>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full justify-center">
        {cta}
      </motion.div>

      {/* Traditional eye-movement demo player */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-2xl relative"
      >
        {/* Decorative glow behind the player */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          <TraditionalDemo />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
