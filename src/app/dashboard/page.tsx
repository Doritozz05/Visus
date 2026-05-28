"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="bg-[#0b1326] text-[#dae2fd] font-sans min-h-screen flex flex-col md:flex-row antialiased selection:bg-[#8083ff]/30 selection:text-white">
      <Sidebar activePath="/dashboard" />

      {/* Mobile TopNav */}
      <nav className="md:hidden bg-[#0b1326] border-b border-[#464554]/30 flex justify-between items-center w-full px-6 py-4 z-50 sticky top-0">
        <div className="text-xl font-bold tracking-tight text-[#dae2fd]">Visus</div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#ffb95f]">local_fire_department</span>
          <div className="w-8 h-8 rounded-full bg-[#171f33] border border-[#464554]/30 overflow-hidden">
            <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-[#c0c1ff]">
              VP
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 pb-24 md:pb-12 max-w-5xl mx-auto w-full">
        {/* Diagnostics & Stats Header */}
        <header className="border-b border-[#464554]/20 pb-6 mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#c0c1ff] mb-2">System Diagnostics</h2>
            <h1 className="text-3xl font-extrabold font-heading text-[#dae2fd] tracking-tight">Telemetry &amp; Performance</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Global Rank</p>
              <p className="text-2xl font-bold font-heading text-[#ffb95f]">#4,092</p>
            </div>
            <div className="h-10 w-px bg-[#464554]/30"></div>
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Status</p>
              <p className="text-sm font-semibold text-[#c0c1ff] flex items-center justify-end gap-1">
                <span className="w-2 h-2 rounded-full bg-[#c0c1ff] animate-pulse inline-block"></span> 
                Optimal
              </p>
            </div>
          </div>
        </header>

        {/* Key Metrics Bento Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Average WPM */}
          <div className="bg-[#171f33]/60 backdrop-blur-xl border border-[#c0c1ff]/10 p-6 rounded-xl relative overflow-hidden group hover:border-[#c0c1ff]/30 transition-all shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl">speed</span>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">Average WPM</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold font-heading text-slate-100">640</span>
              <span className="text-xs font-mono text-[#c0c1ff] uppercase">WPM</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[#4edea3]">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+12% vs last week</span>
            </div>
          </div>

          {/* Card 2: Streak */}
          <div className="bg-[#171f33]/60 backdrop-blur-xl border border-[#c0c1ff]/10 p-6 rounded-xl relative overflow-hidden group hover:border-[#c0c1ff]/30 transition-all shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl">local_fire_department</span>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">Current Streak</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold font-heading text-slate-100">14</span>
              <span className="text-xs font-mono text-slate-400 uppercase">Days</span>
            </div>
            <div className="mt-4 w-full bg-[#131b2e] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#c0c1ff] h-full w-[80%] rounded-full"></div>
            </div>
          </div>

          {/* Card 3: Comprehension */}
          <div className="bg-[#171f33]/60 backdrop-blur-xl border border-[#c0c1ff]/10 p-6 rounded-xl relative overflow-hidden group hover:border-[#c0c1ff]/30 transition-all shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl">psychology</span>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">Comprehension</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold font-heading text-slate-100">92</span>
              <span className="text-xs font-mono text-slate-400">%</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Based on post-session quizzes</span>
            </div>
          </div>
        </section>

        {/* Detailed Session Logs */}
        <section className="bg-[#171f33] border border-[#464554]/20 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6 border-b border-[#464554]/20 pb-4">
            <span className="material-symbols-outlined text-[#c0c1ff]">bar_chart</span>
            <h3 className="text-lg font-bold font-heading text-slate-100">Recent Reading Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#464554]/30 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Document Title</th>
                  <th className="pb-3 font-semibold">Reading Mode</th>
                  <th className="pb-3 font-semibold">Speed</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#464554]/10 text-sm font-sans">
                {[
                  { title: "Neuromancer Excerpt", mode: "RSVP", speed: "650 WPM", duration: "14m 22s", accuracy: "95%" },
                  { title: "Clean Architecture Chapter 1", mode: "Cluster", speed: "480 WPM", duration: "25m 10s", accuracy: "90%" },
                  { title: "React Performance Tuning Guide", mode: "RSVP", speed: "700 WPM", duration: "8m 45s", accuracy: "92%" },
                  { title: "Clean Code Handbook", mode: "Cluster", speed: "500 WPM", duration: "18m 30s", accuracy: "94%" }
                ].map((log, index) => (
                  <tr key={index} className="hover:bg-[#222a3d]/20 transition-colors">
                    <td className="py-4 font-semibold text-slate-200">{log.title}</td>
                    <td className="py-4 font-mono text-xs">{log.mode}</td>
                    <td className="py-4 font-mono text-xs text-[#c0c1ff]">{log.speed}</td>
                    <td className="py-4 font-mono text-xs text-slate-400">{log.duration}</td>
                    <td className="py-4 font-mono text-xs text-[#4edea3] font-bold">{log.accuracy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
