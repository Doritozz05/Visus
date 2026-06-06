"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { useLibrary } from "@/context/library-context";
import { StatsService } from "@/core/services/stats-service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const { books } = useLibrary();
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [logs, setLogs] = React.useState<any[]>([]);
  const [summary, setSummary] = React.useState<any>({
    totalBooksRead: 0,
    averageWpm: 550,
    currentStreakDays: 12,
    completionRatePercent: 75,
    totalReadingTimeMinutes: 45
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      const completedBooksCount = books.filter((b) => b.status === "completed").length;
      const sessionLogs = await StatsService.getSessionLogs();
      const statsSummary = await StatsService.getStatsSummary(completedBooksCount);
      
      setLogs(sessionLogs);
      setSummary(statsSummary);
      setIsHydrated(true);
    };

    fetchStats();
  }, [books]);

  // Derived average accuracy
  const averageAccuracy = React.useMemo(() => {
    if (logs.length === 0) return 92;
    const totalAccuracy = logs.reduce((sum, log) => sum + (log.accuracy || 90), 0);
    return Math.round(totalAccuracy / logs.length);
  }, [logs]);

  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col md:flex-row antialiased transition-all duration-300">
      <Sidebar activePath="/dashboard" />

      {/* Mobile TopNav */}
      <nav className="md:hidden bg-card border-b border-border/30 flex justify-between items-center w-full px-6 py-4 z-50 sticky top-0 transition-all duration-300">
        <div className="text-xl font-bold tracking-tight text-foreground">Visus</div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary">local_fire_department</span>
          <div className="w-8 h-8 rounded-full bg-accent border border-border/30 overflow-hidden">
            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              VP
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 pb-24 md:pb-12 max-w-5xl mx-auto w-full transition-all duration-300">
        {/* Diagnostics & Stats Header */}
        <header className="border-b border-border/20 pb-6 mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-primary mb-2">System diagnostics</h2>
            <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">Telemetry &amp; performance</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Global rank</p>
              <p className="text-2xl font-bold font-heading text-primary">#4,092</p>
            </div>
            <div className="h-10 w-px bg-border/30"></div>
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Status</p>
              <p className="text-sm font-semibold text-primary flex items-center justify-end gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block"></span> 
                Optimal
              </p>
            </div>
          </div>
        </header>

        {/* Key Metrics Bento Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Average WPM */}
          <div className="bg-card border border-border/20 p-6 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-all shadow-md glass-panel">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl">speed</span>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">Average WPM</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold font-heading text-foreground">
                {isHydrated ? summary.averageWpm : 640}
              </span>
              <span className="text-xs font-mono text-primary uppercase">WPM</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-500 dark:text-emerald-400">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>{isHydrated ? `Total time: ${summary.totalReadingTimeMinutes} mins` : "+12% vs last week"}</span>
            </div>
          </div>

          {/* Card 2: Streak */}
          <div className="bg-card border border-border/20 p-6 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-all shadow-md glass-panel">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl">local_fire_department</span>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">Current streak</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold font-heading text-foreground">
                {isHydrated ? summary.currentStreakDays : 14}
              </span>
              <span className="text-xs font-mono text-muted-foreground uppercase">Days</span>
            </div>
            <div className="mt-4 w-full bg-accent h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500" 
                style={{ width: isHydrated ? `${Math.min(100, summary.currentStreakDays * 7)}%` : "80%" }}
              ></div>
            </div>
          </div>

          {/* Card 3: Comprehension */}
          <div className="bg-card border border-border/20 p-6 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-all shadow-md glass-panel">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl">psychology</span>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">Comprehension</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold font-heading text-foreground">
                {isHydrated ? averageAccuracy : 92}
              </span>
              <span className="text-xs font-mono text-muted-foreground">%</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Based on reading telemetry logs</span>
            </div>
          </div>
        </section>

        {/* Detailed Session Logs */}
        <section className="bg-card border border-border/20 rounded-xl p-6 shadow-md glass-panel">
          <div className="flex items-center gap-2 mb-6 border-b border-border/20 pb-4">
            <span className="material-symbols-outlined text-primary">bar_chart</span>
            <h3 className="text-lg font-bold font-heading text-foreground">Recent reading activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/30 text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Document title</th>
                  <th className="pb-3 font-semibold">Reading mode</th>
                  <th className="pb-3 font-semibold">Speed</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10 text-sm font-sans">
                {isHydrated ? (
                  logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground text-xs font-mono">
                        No reading activity logged yet. Finish a book to see telemetries!
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-accent/40 transition-colors">
                        <td className="py-4 font-semibold text-foreground">{log.bookTitle}</td>
                        <td className="py-4 font-mono text-xs uppercase">{log.mode}</td>
                        <td className="py-4 font-mono text-xs text-primary">{log.speedWpm} WPM</td>
                        <td className="py-4 font-mono text-xs text-muted-foreground">
                          {log.durationSeconds >= 60 
                            ? `${Math.floor(log.durationSeconds / 60)}m ${log.durationSeconds % 60}s` 
                            : `${log.durationSeconds}s`
                          }
                        </td>
                        <td className="py-4 font-mono text-xs text-emerald-500 dark:text-emerald-400 font-bold">{log.accuracy}%</td>
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8">
                      <LoadingSpinner message="Loading telemetry logs..." className="min-h-[150px] p-0" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
