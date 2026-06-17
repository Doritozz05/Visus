"use client";

import * as React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
}

export function Switch({ checked, onChange, activeColor, inactiveColor, thumbColor }: SwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0"
      style={{
        backgroundColor: checked
          ? (activeColor || "hsl(var(--primary))")
          : (inactiveColor || "hsl(var(--accent))"),
      }}
    >
      <div
        className="w-4 h-4 rounded-full transition-transform duration-300"
        style={{
          backgroundColor: thumbColor || "hsl(var(--background))",
          transform: checked ? "translateX(1.25rem)" : "translateX(0)",
        }}
      />
    </button>
  );
}
