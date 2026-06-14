"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

interface FancyTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  layoutId: string;
  variant?: "line" | "pill";
  className?: string;
}

export function FancyTabs({
  tabs,
  activeTab,
  onChange,
  layoutId,
  variant = "pill",
  className = "",
}: FancyTabsProps) {
  return (
    <div className={`flex items-center ${variant === "pill" ? "bg-background/20 border border-border/30 p-1 rounded-lg shadow-sm" : "border-b border-border/10"} ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center justify-center gap-2 px-4 py-2 transition-all relative z-10 shrink-0 ${
              isActive
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            } ${variant === "line" ? "px-6 py-3 text-xs uppercase tracking-wider font-sans" : "rounded-md text-[10px] font-mono uppercase tracking-wider"}`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span className="relative z-20 whitespace-nowrap">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className={`absolute ${variant === "pill" ? "inset-0 bg-accent rounded-md shadow-sm" : "bottom-0 left-0 right-0 h-0.5 bg-primary"} z-10`}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
