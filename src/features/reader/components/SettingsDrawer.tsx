"use client";

import * as React from "react";
import { GeneralSettingsForm } from "@/features/settings/components/GeneralSettingsForm";
import { RsvpSettingsForm } from "@/features/settings/components/RsvpSettingsForm";
import { ClusterSettingsForm } from "@/features/settings/components/ClusterSettingsForm";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "general" | "rsvp" | "cluster";
}

export function SettingsDrawer({
  isOpen,
  onClose,
  initialTab = "general",
}: SettingsDrawerProps) {
  const [drawerTab, setDrawerTab] = React.useState<"general" | "rsvp" | "cluster">(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setDrawerTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[90] transition-opacity duration-300"
      />

      <div className="fixed right-0 top-0 bottom-0 z-[100] w-full sm:w-[400px] bg-card border-l border-border/40 shadow-2xl glass-panel p-6 flex flex-col transition-all duration-300 animate-slide-in">
        
        <div className="flex items-center justify-between pb-4 border-b border-border/30 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">settings_applications</span>
            <h3 className="font-heading font-bold text-base">Quick Calibration</h3>
          </div>
          <button 
            data-testid="settings-close-button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/20 transition-all"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="flex gap-1 border-b border-border/10 pb-3 mb-6 overflow-x-auto scrollbar-none">
          {[
            { id: "general", label: "General", icon: "settings" },
            { id: "rsvp", label: "RSVP", icon: "bolt" },
            { id: "cluster", label: "Cluster", icon: "splitscreen" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setDrawerTab(t.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border font-mono text-[10px] uppercase tracking-wider transition-all shrink-0 ${
                drawerTab === t.id
                  ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                  : "border-border/30 bg-card hover:bg-accent/65 text-muted-foreground hover:text-foreground shadow-sm"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div 
          className="flex-1 overflow-y-auto scrollbar-none py-2 -my-2"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 24px), transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 24px), transparent 100%)",
          }}
        >
          <div className="pt-2 pb-12">
            {drawerTab === "general" && <GeneralSettingsForm />}
            {drawerTab === "rsvp" && <RsvpSettingsForm />}
            {drawerTab === "cluster" && <ClusterSettingsForm />}
          </div>
        </div>

      </div>
    </>
  );
}
