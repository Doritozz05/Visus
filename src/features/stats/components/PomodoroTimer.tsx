/**
 * @file PomodoroTimer.tsx
 * @description Sleek glassmorphic Pomodoro Timer widget for the reader sidebar.
 */

"use client";

import * as React from "react";
import { Play, Pause, RotateCcw, Timer, Award, FastForward } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function PomodoroTimer() {
  const [mode, setMode] = React.useState<"focus" | "break">("focus");
  const [isActive, setIsActive] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(25 * 60); // 25 minutes default
  const [completedCycles, setCompletedCycles] = React.useState(0);

  const totalDuration = mode === "focus" ? 25 * 60 : 5 * 60;
  const progress = (timeLeft / totalDuration) * 100;
  const circumference = 2 * Math.PI * 54;

  const handleCycleComplete = React.useCallback(() => {
    setIsActive(false);
    if (mode === "focus") {
      const nextCycles = completedCycles + 1;
      setCompletedCycles(nextCycles);
      
      toast.success("🍅 Pomodoro session completed! Take a 5-minute break.", {
        duration: 8000,
      });

      if (nextCycles === 4) {
        toast.success("🏆 Pomodoro Master! You completed 4 focus cycles today.", {
          icon: "👑",
          duration: 10000,
        });
      }

      setMode("break");
      setTimeLeft(5 * 60);
    } else {
      toast.success("💪 Break over! Time to dive back into reading.", {
        duration: 8000,
      });
      setMode("focus");
      setTimeLeft(25 * 60);
    }
  }, [completedCycles, mode]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleCycleComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleCycleComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode("focus");
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      className="bg-card/40 border border-border/20 p-4 rounded-xl shadow-md glass-panel flex flex-col items-center gap-4 w-full cursor-move"
    >
      <div className="flex items-center gap-2 border-b border-border/10 pb-2 w-full justify-between">
        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
          <Timer className="w-4 h-4 text-primary" />
          <span>Pomodoro</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          <Award className="w-3.5 h-3.5" />
          <span>{completedCycles} {completedCycles === 1 ? 'Cycle' : 'Cycles'}</span>
        </div>
      </div>

      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* SVG Circular Progress */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="54"
            stroke="currentColor"
            strokeWidth="4"
            className="text-border/20"
            fill="transparent"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="54"
            stroke="currentColor"
            strokeWidth="4"
            className="text-primary"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference * (1 - progress / 100) }}
            animate={{ strokeDashoffset: circumference * (1 - progress / 100) }}
            transition={{ ease: "linear", duration: 0.5 }}
          />
        </svg>

        {/* Timer Text */}
        <div className="flex flex-col items-center z-10">
          <span className="text-2xl font-black font-mono text-foreground tracking-tight">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">
            {mode === "focus" ? "Focus" : "Break"}
          </span>
        </div>
      </div>

      <div className="relative flex items-center justify-center w-full mt-2">
        <div className="absolute left-0 flex items-center gap-1.5">
          <button
            onClick={handleCycleComplete}
            title="Skip timer (Debug)"
            className="p-1.5 border border-border/30 hover:bg-accent text-muted-foreground hover:text-foreground rounded transition-all shrink-0"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={toggleTimer}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-6 rounded text-xs font-mono uppercase tracking-wider transition-all font-bold ${
            isActive
              ? "bg-amber-600/20 hover:bg-amber-600/30 text-amber-500 border border-amber-500/30"
              : "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_15px_rgba(var(--primary),0.15)]"
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Start</span>
            </>
          )}
        </button>

        <div className="absolute right-0 flex items-center gap-1.5">
          <button
            onClick={resetTimer}
            title="Reset Pomodoro"
            className="p-1.5 border border-border/30 hover:bg-accent text-muted-foreground hover:text-foreground rounded transition-all shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
