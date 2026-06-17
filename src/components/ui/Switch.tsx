"use client";

import * as React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ checked, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${
        checked ? "bg-primary" : "bg-accent"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-background transition-transform duration-300 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
