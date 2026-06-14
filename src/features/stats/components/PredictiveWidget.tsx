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
  // Find all active or in-progress books
  const activeBooks = React.useMemo(() => {
    return books.filter((b) => b.status === "active" || (b.progress > 0 && b.progress < 100));
  }, [books]);

  // Calculations for a single book
  const calculatePrediction = React.useCallback((book: Book) => {
    const totalPages = book.totalPages || 100;
    const currentPage = book.currentPage || 0;
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
    });

    return {
      remainingPages,
      daysRemaining,
      formattedEstDate,
      percentage: book.progress || Math.round((currentPage / totalPages) * 100)
    };
  }, [summary]);

  return (
    <div className="bg-card border border-border/20 p-5 rounded-xl flex flex-col h-full group hover:border-primary/40 transition-all shadow-md liquid-glass">
      <div className="w-full border-b border-border/10 pb-2 mb-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Smart Forecast</h3>
        <p className="text-[10px] font-mono text-muted-foreground mt-0.5">Estimated completion dates</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1">
        {activeBooks.length > 0 ? (
          <div className="flex flex-col gap-3">
            {activeBooks.map((book) => {
              const pred = calculatePrediction(book);
              return (
                <div key={book.id} className="bg-background/40 border border-border/10 p-3 rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="text-xs font-bold text-foreground truncate flex-1">{book.title}</h4>
                    <span className="text-[10px] font-mono font-bold text-primary shrink-0">{pred.percentage}%</span>
                  </div>
                  
                  <div className="w-full bg-accent/50 h-1 rounded-lg overflow-hidden mb-3">
                    <div
                      className="bg-primary h-full rounded-lg transition-all duration-500"
                      style={{ width: `${pred.percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{pred.formattedEstDate}</span>
                    </div>
                    <div className="font-bold text-foreground bg-primary/10 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-tighter">
                      {pred.daysRemaining} {pred.daysRemaining === 1 ? 'day' : 'days'} left
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-center py-4 text-xs text-muted-foreground font-mono opacity-60">
            <BookOpen className="w-8 h-8 mb-2 opacity-20" />
            <span>No active books found in your local library.</span>
          </div>
        )}
      </div>
    </div>
  );
}
