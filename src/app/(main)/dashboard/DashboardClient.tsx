/**
 * @file DashboardClient.tsx
 * @description Premium glassmorphic Bento Box dashboard client with integrated SVG charts and telemetry analytics.
 */

"use client";

import * as React from "react";
import { useLibrary } from "@/features/library/context/library-context";
import { useSettings } from "@/features/settings/context/settings-context";
import { useAuth } from "@/features/auth/context/auth-context";
import { StatsService } from "@/core/services/stats-service";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ReadingSessionLog, LibraryStatsSummary } from "@/core/entities/stats";
import { Flame, Gauge, TrendingUp, Brain, CheckCircle, BarChart, Download, Trash2, ShieldCheck, BookOpen, Pencil } from "lucide-react";
import { toast } from "sonner";

// Custom premium visual components
import { RadarChart } from "@/features/stats/components/RadarChart";
import { Heatmap } from "@/features/stats/components/Heatmap";
import { WpmChart } from "@/features/stats/components/WpmChart";
import { MethodComparison } from "@/features/stats/components/MethodComparison";
import { AchievementsShowcase } from "@/features/stats/components/AchievementsShowcase";
import { ShareCard } from "@/features/stats/components/ShareCard";
import { PredictiveWidget } from "@/features/stats/components/PredictiveWidget";

// Export utilities
import { exportToJSON, exportToCSV } from "@/features/stats/utils/export";

export default function DashboardClient() {
  const { books } = useLibrary();
  const { settings, updateGeneralSettings } = useSettings();
  const { yearlyReadingGoal } = settings.general;
  const { user } = useAuth();
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [isEditingGoal, setIsEditingGoal] = React.useState(false);
  const [tempGoal, setTempGoal] = React.useState(yearlyReadingGoal);
  const [logs, setLogs] = React.useState<ReadingSessionLog[]>([]);
  const [summary, setSummary] = React.useState<LibraryStatsSummary>({
    totalBooksRead: 0,
    averageWpm: 450,
    currentStreakDays: 0,
    completionRatePercent: 0,
    totalReadingTimeMinutes: 0
  });

  const fetchStats = React.useCallback(async () => {
    const completedBooksCount = books.filter((b) => b.status === "completed").length;
    const sessionLogs = await StatsService.getSessionLogs();
    const statsSummary = await StatsService.getStatsSummary(completedBooksCount);
    
    // Sort logs descending by date
    const sortedLogs = [...sessionLogs].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    setLogs(sortedLogs);
    setSummary(statsSummary);
    setIsHydrated(true);
  }, [books]);

  React.useEffect(() => {
    fetchStats();

    // Listen for real-time telemetry updates
    const handleUpdate = () => {
      fetchStats();
    };
    window.addEventListener("stats-updated", handleUpdate);

    return () => {
      window.removeEventListener("stats-updated", handleUpdate);
    };
  }, [fetchStats]);

  // Sync tempGoal with yearlyReadingGoal from settings
  React.useEffect(() => {
    setTempGoal(yearlyReadingGoal);
  }, [yearlyReadingGoal]);

  // Derived average accuracy
  const averageAccuracy = React.useMemo(() => {
    const logsWithAccuracy = logs.filter((l) => l.accuracy != null);
    if (logsWithAccuracy.length === 0) return null;
    const totalAccuracy = logsWithAccuracy.reduce((sum, log) => sum + log.accuracy!, 0);
    return Math.round(totalAccuracy / logsWithAccuracy.length);
  }, [logs]);

  const goalProgressPercentage = React.useMemo(() => {
    return Math.min(Math.round((summary.totalBooksRead / yearlyReadingGoal) * 100), 100);
  }, [summary.totalBooksRead, yearlyReadingGoal]);

  const handleUpdateGoal = () => {
    updateGeneralSettings({ yearlyReadingGoal: tempGoal });
    setIsEditingGoal(false);
    toast.success("Yearly reading goal updated.");
  };

  const handleResetStats = async () => {
    if (window.confirm("Are you sure you want to reset all your stats history? This action is irreversible.")) {
      await StatsService.resetStats();
      toast.success("Telemetry history successfully reset.");
      fetchStats();
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Loading system diagnostics..." />
      </div>
    );
  }

  const userId = user?.id || "local-user";

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-12 max-w-7xl mx-auto w-full transition-all duration-300">
      {/* Bento Header */}
      <header className="border-b border-border/20 pb-6 mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-primary mb-2">System Diagnostics</h2>
          <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">Telemetry & Performance</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Profile Id</p>
            <p className="text-xl font-bold font-heading text-primary truncate max-w-[120px]">
              {userId.slice(0, 8)}
            </p>
          </div>
          <div className="h-10 w-px bg-border/30"></div>
          <div className="text-right">
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Status</p>
            <p className="text-sm font-semibold text-primary flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block"></span> 
              OPTIMAL
            </p>
          </div>
        </div>
      </header>

      {/* Top Row: Core Metrics (Horizontal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card A: WPM */}
          <div className="bg-card border border-border/20 p-5 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-all shadow-md glass-panel flex flex-col justify-between min-h-[140px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Gauge className="w-14 h-14 text-foreground" />
            </div>
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Average Speed</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-extrabold font-heading text-foreground">{summary.averageWpm}</span>
                <span className="text-xs font-mono text-primary uppercase font-bold">WPM</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-emerald-500 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Total time: {summary.totalReadingTimeMinutes} mins</span>
            </div>
          </div>

          {/* Card B: Racha */}
          <div className="bg-card border border-border/20 p-5 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-all shadow-md glass-panel flex flex-col justify-between min-h-[140px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Flame className="w-14 h-14 text-foreground" />
            </div>

            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Active Streak</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-extrabold font-heading text-foreground">{summary.currentStreakDays}</span>
                <span className="text-xs font-mono text-muted-foreground uppercase">{summary.currentStreakDays === 1 ? 'Day' : 'Days'}</span>
              </div>
            </div>

            <div 
              className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors cursor-help w-fit"
              title="Streak Shields: Protects your streak if you miss a day. Earned every 30 days of reading."
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Streak Shields: <span className="font-bold text-foreground group-hover:text-primary">{Math.min(3, Math.floor((summary.currentStreakDays || 0) / 30))}/3</span></span>
            </div>
          </div>

          {/* Card C: Comprensión */}
          <div className="bg-card border border-border/20 p-5 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-all shadow-md glass-panel flex flex-col justify-between min-h-[140px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Brain className="w-14 h-14 text-foreground" />
            </div>
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Reading Retention</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-extrabold font-heading text-foreground">
                  {averageAccuracy !== null ? `${averageAccuracy}%` : "-"}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Self-assessment quizzes</span>
            </div>
          </div>

          {/* Card D: Books Read Progress */}
          <div className="bg-card border border-border/20 p-5 rounded-xl relative overflow-hidden group hover:border-primary/50 transition-all shadow-md glass-panel flex flex-col justify-between min-h-[140px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none">
              <BookOpen className="w-14 h-14 text-foreground" />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Yearly Goal</h3>
                  <button 
                    onClick={() => setIsEditingGoal(!isEditingGoal)}
                    className="p-1 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-primary"
                    title="Edit yearly goal"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {isEditingGoal ? (
                <div className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(parseInt(e.target.value) || 1)}
                    className="w-16 bg-background border border-border/50 rounded px-2 py-1 text-xl font-bold font-heading focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateGoal()}
                  />
                  <button 
                    onClick={handleUpdateGoal}
                    className="bg-primary text-primary-foreground px-2 py-1 rounded text-[10px] font-mono font-bold hover:brightness-110 transition-all"
                  >
                    SAVE
                  </button>
                </div>
              ) : (
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-extrabold font-heading text-foreground">{summary.totalBooksRead}</span>
                  <span className="text-xs text-muted-foreground/80 font-normal">/ {yearlyReadingGoal}</span>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-auto">
              <div className="w-full bg-accent h-1.5 rounded-full overflow-hidden border border-border/10">
                <div 
                  className="bg-gradient-to-r from-primary to-emerald-500 h-full rounded-full transition-all duration-500 group-hover:brightness-110" 
                  style={{ width: `${goalProgressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
      </div>

      {/* Main Bento Box Grid (Visuals) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Box 1: Radar Chart */}
        <div className="lg:col-span-5 h-full">
          <RadarChart logs={logs} books={books} />
        </div>

        {/* Box 2: Heatmap Chart */}
        <div className="lg:col-span-7 h-full">
          <Heatmap logs={logs} />
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* ROW 2 */}
        {/* Box 4: WPM fluctuation Chart */}
        <div className="md:col-span-2 h-full">
          <WpmChart logs={logs} />
        </div>

        {/* Box 5: Share Card */}
        <div className="h-full">
          <ShareCard summary={summary} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* ROW 3 */}
        {/* Box 6: Achievements showcase */}
        <div className="md:col-span-2 h-full">
          <AchievementsShowcase userId={userId} />
        </div>

        {/* Box 7: Predictive Widget */}
        <div className="h-full">
          <PredictiveWidget books={books} summary={summary} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* ROW 4 */}
        {/* Box 8: Method Comparison */}
        <div className="h-full">
          <MethodComparison logs={logs} />
        </div>

        {/* Box 9: Session Log Table & Export Actions */}
        <div className="md:col-span-2 bg-card border border-border/20 rounded-xl p-5 shadow-md glass-panel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4 border-b border-border/20 pb-4">
              <div className="flex items-center gap-2">
                <BarChart className="text-primary w-5 h-5" />
                <h3 className="text-base font-bold font-heading text-foreground">Recent Telemetry Log</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportToJSON(logs)}
                  disabled={logs.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1.5 border border-border/30 rounded text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                  title="Export as JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={() => exportToCSV(logs)}
                  disabled={logs.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1.5 border border-border/30 rounded text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                  title="Export as CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
                <button
                  onClick={handleResetStats}
                  disabled={logs.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1.5 border border-destructive/30 hover:border-destructive/60 hover:bg-destructive/10 rounded text-[10px] font-mono uppercase tracking-wider text-destructive transition-all"
                  title="Reset all stats history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/30 text-muted-foreground font-mono text-[9px] uppercase tracking-wider">
                    <th className="pb-2 font-semibold">Document Title</th>
                    <th className="pb-2 font-semibold">Mode</th>
                    <th className="pb-2 font-semibold">Speed</th>
                    <th className="pb-2 font-semibold">Duration</th>
                    <th className="pb-2 font-semibold">Comprehension</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10 text-xs font-sans">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground text-xs font-mono">
                        No reading logs saved in the local database.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-accent/30 transition-colors">
                        <td className="py-3 font-semibold text-foreground truncate max-w-[180px]" title={log.bookTitle}>
                          {log.bookTitle}
                        </td>
                        <td className="py-3 font-mono text-[10px] uppercase text-muted-foreground">
                          {log.mode}
                        </td>
                        <td className="py-3 font-mono text-[10px] text-primary font-semibold">
                          {log.speedWpm} WPM
                        </td>
                        <td className="py-3 font-mono text-[10px] text-muted-foreground">
                          {log.durationSeconds >= 60 
                            ? `${Math.floor(log.durationSeconds / 60)}m ${log.durationSeconds % 60}s` 
                            : `${log.durationSeconds}s`
                          }
                        </td>
                        <td className="py-3 font-mono text-[10px] text-emerald-500 dark:text-emerald-400 font-bold">
                          {log.accuracy != null ? `${log.accuracy}%` : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
