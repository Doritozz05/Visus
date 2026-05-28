"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";

export default function SettingsPage() {
  const [typeface, setTypeface] = React.useState("inter");
  const [fontSize, setFontSize] = React.useState(18);
  const [sensitivity, setSensitivity] = React.useState(85);
  const [glowEnabled, setGlowEnabled] = React.useState(true);
  const [colorMode, setColorMode] = React.useState("dark");
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] font-sans min-h-screen flex flex-col md:flex-row antialiased selection:bg-[#8083ff]/30 selection:text-white">
      <Sidebar activePath="/settings" />

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
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold font-heading text-[#dae2fd] tracking-tight">Configuration</h2>
          <p className="text-[#c7c4d7] text-xs font-mono uppercase tracking-wider mt-2 max-w-2xl">
            Adjust visual parameters for optimal cognitive consumption. Changes are applied in real-time to the reading canvas.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Typography & Display */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Typography Module */}
            <section className="bg-[#171f33]/60 backdrop-blur-xl border border-[#c0c1ff]/10 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6 border-b border-[#464554]/20 pb-4">
                <span className="material-symbols-outlined text-[#c0c1ff]">text_format</span>
                <h3 className="text-lg font-bold font-heading text-slate-100">Typography Engine</h3>
              </div>

              {/* Typeface Selection */}
              <div className="mb-8">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#c7c4d7] mb-3">Primary Typeface</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button 
                    onClick={() => setTypeface("inter")}
                    className={`px-4 py-3 border rounded text-center transition-all ${
                      typeface === "inter"
                        ? "border-[#c0c1ff] bg-[#222a3d] text-[#c0c1ff] font-bold"
                        : "border-[#464554]/30 bg-[#131b2e] text-[#c7c4d7] hover:border-[#464554]/50"
                    }`}
                  >
                    <span className="block text-sm mb-1 font-sans">Inter</span>
                    <span className="block text-[9px] font-mono opacity-50 uppercase tracking-widest">Standard</span>
                  </button>
                  <button 
                    onClick={() => setTypeface("atkinson")}
                    className={`px-4 py-3 border rounded text-center transition-all ${
                      typeface === "atkinson"
                        ? "border-[#c0c1ff] bg-[#222a3d] text-[#c0c1ff] font-bold"
                        : "border-[#464554]/30 bg-[#131b2e] text-[#c7c4d7] hover:border-[#464554]/50"
                    }`}
                  >
                    <span className="block text-sm mb-1 font-sans">Atkinson</span>
                    <span className="block text-[9px] font-mono opacity-50 uppercase tracking-widest">Hyperlegible</span>
                  </button>
                  <button 
                    onClick={() => setTypeface("dyslexic")}
                    className={`px-4 py-3 border rounded text-center transition-all ${
                      typeface === "dyslexic"
                        ? "border-[#c0c1ff] bg-[#222a3d] text-[#c0c1ff] font-bold"
                        : "border-[#464554]/30 bg-[#131b2e] text-[#c7c4d7] hover:border-[#464554]/50"
                    }`}
                  >
                    <span className="block text-sm mb-1 font-sans">Dyslexic</span>
                    <span className="block text-[9px] font-mono opacity-50 uppercase tracking-widest">Accessibility</span>
                  </button>
                </div>
              </div>

              {/* Font Size Control */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#c7c4d7]">Base Optical Size</label>
                  <span className="text-xs font-mono text-[#c0c1ff] font-bold bg-[#222a3d] px-2 py-1 rounded">{fontSize}px</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#c7c4d7] text-sm">A</span>
                  <input 
                    className="flex-1 accent-[#c0c1ff] h-1 bg-[#464554] rounded-lg appearance-none cursor-pointer"
                    max="32" 
                    min="14" 
                    type="range" 
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                  />
                  <span className="text-[#c7c4d7] text-xl font-bold">A</span>
                </div>
                <p className="text-[10px] font-mono text-slate-500 mt-2">Applies to body text in Cluster and Standard modes.</p>
              </div>
            </section>

            {/* RSVP Specifics */}
            <section className="bg-[#171f33]/60 backdrop-blur-xl border border-[#c0c1ff]/10 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6 border-b border-[#464554]/20 pb-4">
                <span className="material-symbols-outlined text-[#ffb690]">visibility</span>
                <h3 className="text-lg font-bold font-heading text-slate-100">RSVP Calibration</h3>
              </div>

              {/* Blink Sensitivity */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-3">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#c7c4d7]">Eye Closure Timeout</label>
                  <span className="text-xs font-mono text-[#ffb690] font-bold bg-[#222a3d] px-2 py-1 rounded">{sensitivity}ms</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-slate-500 text-sm">low_priority</span>
                  <input 
                    className="flex-1 accent-[#ffb690] h-1 bg-[#464554] rounded-lg appearance-none cursor-pointer"
                    max="200" 
                    min="50" 
                    type="range" 
                    value={sensitivity}
                    onChange={(e) => setSensitivity(Number(e.target.value))}
                  />
                  <span className="material-symbols-outlined text-slate-500 text-sm">priority_high</span>
                </div>
                <p className="text-[10px] font-mono text-slate-500 mt-2">Time in milliseconds the reader will pause when eyes are closed or looking away.</p>
              </div>

              {/* ORP Contrast */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#c7c4d7]">ORP Glow Highlight</label>
                  <p className="text-[10px] text-slate-500 mt-1">Adds dynamic visual glow to the Optimal Recognition Point character.</p>
                </div>
                <button 
                  onClick={() => setGlowEnabled(!glowEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${glowEnabled ? "bg-[#c0c1ff]" : "bg-[#222a3d]"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-[#0b1326] transition-transform duration-300 ${glowEnabled ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Environment & System */}
          <div className="lg:col-span-5 space-y-6">
            {/* Color Mode */}
            <section className="bg-[#171f33] border border-[#464554]/20 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6 border-b border-[#464554]/20 pb-4">
                <span className="material-symbols-outlined text-[#4edea3]">palette</span>
                <h3 className="text-lg font-bold font-heading text-slate-100">Environment</h3>
              </div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#c7c4d7] mb-3">Color Mode</label>
              <div className="flex flex-col gap-2">
                {[
                  { id: "auto", name: "System Auto", icon: "brightness_auto" },
                  { id: "dark", name: "Dark (Clinical)", icon: "dark_mode" },
                  { id: "light", name: "Light (Paper)", icon: "light_mode" }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setColorMode(mode.id)}
                    className={`flex items-center justify-between p-3 border rounded text-left transition-all ${
                      colorMode === mode.id
                        ? "border-[#c0c1ff] bg-[#222a3d] text-[#c0c1ff]"
                        : "border-[#464554]/30 bg-[#0b1326] text-[#c7c4d7] hover:border-[#464554]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">{mode.icon}</span>
                      <span className="text-sm font-semibold">{mode.name}</span>
                    </div>
                    {colorMode === mode.id && <span className="material-symbols-outlined text-[#c0c1ff]">check_circle</span>}
                  </button>
                ))}
              </div>
            </section>

            {/* Data Sync */}
            <section className="bg-[#171f33] border border-[#464554]/20 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-6 border-b border-[#464554]/20 pb-4">
                <span className="material-symbols-outlined text-slate-400">cloud_sync</span>
                <h3 className="text-lg font-bold font-heading text-slate-100">Data Sync</h3>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[#c7c4d7]">Status</span>
                <span className="text-xs font-mono text-[#4edea3] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3] inline-block animate-pulse"></span>
                  Synced
                </span>
              </div>
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full py-2.5 border border-[#464554]/30 text-[#dae2fd] rounded font-mono text-xs uppercase tracking-wider hover:bg-[#222a3d] hover:border-[#c0c1ff] transition-all disabled:opacity-50"
              >
                {isSyncing ? "Syncing..." : "Force Manual Sync"}
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
