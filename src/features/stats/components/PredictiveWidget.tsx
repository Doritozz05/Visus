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

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col justify-between h-full group hover:border-primary/40 transition-all shadow-md glass-panel">
      <div className="w-full border-b border-border/10 pb-2 mb-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Predictive Habits</h3>
        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Smart estimates for your active book</p>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Predictive finish card */}
        {activeBook && prediction ? (
          <div className="bg-background/40 border border-border/10 p-3 rounded-lg flex items-start gap-3 h-full">
            <BookOpen className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1 flex flex-col justify-between h-full">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Active Reading</span>
                <h4 className="text-xs font-bold text-foreground truncate mt-0.5">{activeBook.title}</h4>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  At your current speed ({summary.averageWpm || 450} WPM) reading {prediction.avgDailyMins} mins/day, you will finish the remaining <span className="text-foreground font-semibold font-mono">{prediction.remainingPages} pages</span> in:
                </p>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-primary font-bold">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="font-heading tracking-tight">{prediction.daysRemaining} {prediction.daysRemaining === 1 ? 'day' : 'days'} ({prediction.formattedEstDate})</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-background/40 border border-border/10 p-4 rounded-lg text-center flex flex-col justify-center items-center h-full text-xs text-muted-foreground font-mono">
            <BookOpen className="w-8 h-8 text-muted-foreground/30 mb-2" />
            No active readings. Open a book from your library to calculate predictions.
          </div>
        )}
      </div>
    </div>
  );
}
