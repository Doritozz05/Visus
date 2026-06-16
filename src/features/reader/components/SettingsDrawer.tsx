"use client";

import * as React from "react";
import { Settings, Sliders, X, Zap, Columns, BookOpen, Maximize, Minimize, EyeOff, Timer } from "lucide-react";
import { GeneralSettingsForm } from "@/features/settings/components/GeneralSettingsForm";
import { RsvpSettingsForm } from "@/features/settings/components/RsvpSettingsForm";
import { ClusterSettingsForm } from "@/features/settings/components/ClusterSettingsForm";
import { ReaderSettingsForm } from "@/features/settings/components/ReaderSettingsForm";
import { useReadingStore } from "@/features/reader/stores/reading-store";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "general" | "rsvp" | "cluster" | "normal";
  isPomodoroOpen?: boolean;
  setIsPomodoroOpen?: (open: boolean) => void;
}

const drawerVariants = {
  hidden: { x: "100%", opacity: 0.8 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 32 }
  },
  exit: { 
    x: "100%", 
    opacity: 0.8,
    transition: { type: "spring", stiffness: 300, damping: 32 }
  }
};

export function SettingsDrawer({
  isOpen,
  onClose,
  initialTab = "general",
  isPomodoroOpen = false,
  setIsPomodoroOpen,
}: SettingsDrawerProps) {
  const [drawerTab, setDrawerTab] = React.useState<"general" | "rsvp" | "cluster" | "normal">(initialTab);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const setIsFocusMode = useReadingStore((state) => state.setIsFocusMode);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setDrawerTab(initialTab);
    }
  }, [isOpen, initialTab]);

  React.useEffect(() => {
    if (isOpen) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[90]"
          />
          <motion.div 
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 bottom-0 z-[100] w-full sm:w-[400px] bg-card border-l border-border/40 shadow-2xl liquid-glass p-6 flex flex-col"
          >

            <div className="flex items-center justify-between pb-4 border-b border-border/30 mb-6">
              <div className="flex items-center gap-2">
                <Sliders className="text-primary h-5 w-5" />
                <h3 className="font-heading font-bold text-base">Quick settings</h3>
              </div>
              <button
                data-testid="settings-close-button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/20 transition-all"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            {/* Mobile-only Quick Actions (Fullscreen, Focus Mode, Pomodoro) */}
            <div className="sm:hidden grid grid-cols-3 gap-2 border-b border-border/10 pb-4 mb-6">
              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className={`flex flex-col items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer select-none ${
                  isFullscreen
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-[0_0_10px_rgba(var(--primary),0.1)]"
                    : "border-border/30 bg-card/50 hover:bg-accent/65 text-muted-foreground hover:text-foreground"
                }`}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                <span className="text-[9px] truncate w-full text-center">Screen</span>
              </button>

              {/* Focus Mode Toggle */}
              <button
                onClick={() => {
                  setIsFocusMode(true);
                  onClose();
                }}
                className="flex flex-col items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-border/30 bg-card/50 hover:bg-accent/65 text-muted-foreground hover:text-foreground text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer select-none"
              >
                <EyeOff className="h-4 w-4" />
                <span className="text-[9px] truncate w-full text-center">Focus</span>
              </button>

              {/* Pomodoro Timer Toggle */}
              <button
                onClick={() => setIsPomodoroOpen?.(!isPomodoroOpen)}
                className={`flex flex-col items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer select-none ${
                  isPomodoroOpen
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-[0_0_10px_rgba(var(--primary),0.1)]"
                    : "border-border/30 bg-card/50 hover:bg-accent/65 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Timer className="h-4 w-4" />
                <span className="text-[9px] truncate w-full text-center">Pomodoro</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 border-b border-border/10 pb-4 mb-6">
              {[
                { id: "general", label: "General", icon: Settings },
                { id: "normal", label: "Reader", icon: BookOpen },
                { id: "rsvp", label: "RSVP", icon: Zap },
                { id: "cluster", label: "Cluster", icon: Columns },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setDrawerTab(t.id as any)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border font-mono text-[9px] uppercase tracking-widest transition-all ${drawerTab === t.id
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-[0_0_15px_rgba(var(--primary),0.1)] scale-[1.02]"
                        : "border-border/30 bg-card/50 hover:bg-accent/65 text-muted-foreground hover:text-foreground hover:border-border/60"
                      }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${drawerTab === t.id ? "animate-pulse" : ""}`} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div
              className="flex-1 overflow-y-auto scrollbar-none py-2 -my-2 px-4 -mx-4"
              style={{
                maskImage: "linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 24px), transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 16px, black calc(100% - 24px), transparent 100%)",
              }}
            >
              <div className="pt-2 pb-12">
                {drawerTab === "general" && <GeneralSettingsForm />}
                {drawerTab === "normal" && <ReaderSettingsForm />}
                {drawerTab === "rsvp" && <RsvpSettingsForm />}
                {drawerTab === "cluster" && <ClusterSettingsForm />}
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

