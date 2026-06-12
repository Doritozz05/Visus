/**
 * @file PredictiveWidget.tsx
 * @description Predictive end-date widget estimating completion based on reading history, plus Grace Days counter.
 */

"use client";

import * as React from "react";
import { Book } from "@/core/entities/book";
import { LibraryStatsSummary } from "@/core/entities/stats";
import { BookOpen, Calendar, ShieldCheck } from "lucide-react";

interface PredictiveWidgetProps {
  books: Book[];
  summary: LibraryStatsSummary;
}

export function PredictiveWidget({ books, summary }: PredictiveWidgetProps) {
  // Find current active reading book
  const activeBook = React.useMemo(() => {
    const active = books.find((b) => b.status === "active");
    if (active) return active;
    const inProgress = books.find((b) => b.progress > 0 && b.progress < 100);
    return inProgress || null;
  }, [books]);

  // Calculations
  const prediction = React.useMemo(() => {
    if (!activeBook) return null;

    const totalPages = activeBook.totalPages || 100;
    const currentPage = activeBook.currentPage || 0;
    const remainingPages = Math.max(0, totalPages - currentPage);

    // Approximate 300 words per page
    const remainingWords = remainingPages * 300;
    
    // User pacing
    const userWpm = summary.averageWpm || 450;
    
    // Average daily reading time (min 15 mins default)
    const daysActive = Math.max(1, summary.currentStreakDays);
    const avgDailyMins = Math.max(15, Math.round(summary.totalReadingTimeMinutes / daysActive));

    const totalMinutesNeeded = remainingWords / userWpm;
    const daysRemaining = Math.max(1, Math.ceil(totalMinutesNeeded / avgDailyMins));

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + daysRemaining);

    const formattedEstDate = estDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      weekday: "short"
    });

    return {
      remainingPages,
      remainingWords,
      daysRemaining,
      formattedEstDate,
      avgDailyMins,
      percentage: activeBook.progress || Math.round((currentPage / totalPages) * 100)
    };
  }, [activeBook, summary]);

  // Grace Days calculator (1 earned per 30 active reading days, max 3)
  const graceDays = React.useMemo(() => {
    // Total reading sessions count is approximated by logs.length,
    // let's assume we can fetch active reading days from the summary
    const daysRead = summary.currentStreakDays || 0;
    const earned = Math.min(3, Math.floor(daysRead / 30));
    return {
      earned,
      nextIn: 30 - (daysRead % 30)
    };
  }, [summary]);

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col justify-between h-full group hover:border-primary/40 transition-all shadow-md glass-panel">
      <div className="w-full border-b border-border/10 pb-2 mb-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Predictive Habits</h3>
        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Smart predictions and streak shield</p>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Predictive finish card */}
        {activeBook && prediction ? (
          <div className="bg-background/40 border border-border/10 p-3 rounded-lg flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Active Reading</span>
              <h4 className="text-xs font-bold text-foreground truncate mt-0.5">{activeBook.title}</h4>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                At your current speed ({summary.averageWpm || 450} WPM) reading {prediction.avgDailyMins} mins/day, you will finish the remaining <span className="text-foreground font-semibold font-mono">{prediction.remainingPages} pages</span> in:
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-primary font-bold">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="font-heading tracking-tight">{prediction.daysRemaining} {prediction.daysRemaining === 1 ? 'day' : 'days'} ({prediction.formattedEstDate})</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-background/40 border border-border/10 p-4 rounded-lg text-center text-xs text-muted-foreground font-mono">
            No active readings. Open a book from your library to calculate predictions!
          </div>
        )}

        {/* Grace Days panel */}
        <div className="bg-background/40 border border-border/10 p-3 rounded-lg flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="flex-1">
            <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Available Grace Days</span>
            <div className="flex items-center gap-1.5 mt-1.5">
              {[1, 2, 3].map((slot) => {
                const filled = slot <= graceDays.earned;
                return (
                  <div
                    key={slot}
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                      filled
                        ? "bg-primary border-primary text-[8px] text-primary-foreground shadow-[0_0_8px_rgba(var(--primary),0.3)] animate-pulse"
                        : "bg-transparent border-border/50"
                    }`}
                    title={filled ? "Grace day available" : "Grace day locked"}
                  >
                    {filled && "✓"}
                  </div>
                );
              })}
              <span className="text-[10px] font-mono font-bold text-foreground ml-1">{graceDays.earned} / 3 in stock</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed font-sans">
              You earn 1 grace day every 30 reading days. Protects your daily streak if you forget to read. Next in: <span className="text-foreground font-semibold font-mono">{graceDays.nextIn} {graceDays.nextIn === 1 ? 'day' : 'days'}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
