"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";

export default function LibraryPage() {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    alert("Prototype File Added successfully (scaffold action)!");
  };

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] font-sans min-h-screen flex flex-col md:flex-row antialiased selection:bg-[#8083ff]/30 selection:text-white">
      <Sidebar activePath="/library" />

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

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header area */}
        <header className="hidden md:flex justify-between items-center px-8 py-6 border-b border-[#464554]/20">
          <h1 className="text-3xl font-extrabold font-heading text-slate-100">Library</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="material-symbols-outlined text-[#ffb95f] text-sm">local_fire_department</span>
              <span>Streak: 12 Days</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-[#c0c1ff]/30 flex items-center justify-center text-xs font-bold text-[#c0c1ff]">
              VP
            </div>
          </div>
        </header>

        <div className="p-6 md:p-12 flex-1 max-w-5xl mx-auto w-full">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Upload Zone & Storage */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[#171f33]/60 backdrop-blur-xl border border-[#464554]/20 rounded-xl p-6 flex flex-col h-full relative overflow-hidden group shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2d3449]/20 to-transparent opacity-50"></div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4 relative z-10">Ingestion</h2>
                
                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border border-dashed border-[#464554]/50 rounded-xl flex-1 flex flex-col items-center justify-center p-8 text-center transition-all duration-300 relative z-10 cursor-pointer ${
                    isDragOver 
                      ? "border-[#c0c1ff] bg-[#222a3d] shadow-[inset_0_0_15px_rgba(173,198,255,0.1)]" 
                      : "bg-[#0b1326] hover:bg-[#131b2e] hover:border-[#c0c1ff]/50"
                  }`}
                  id="drop-zone"
                >
                  <span className="material-symbols-outlined text-4xl text-[#c7c4d7] mb-4 group-hover:text-[#c0c1ff] transition-colors">upload_file</span>
                  <p className="text-sm font-semibold text-slate-200 mb-1">Drop files here</p>
                  <p className="text-[10px] font-mono text-slate-500">PDF, EPUB, TXT</p>
                  <button className="mt-6 px-4 py-2 border border-[#464554]/40 text-xs font-mono uppercase tracking-wider text-[#c7c4d7] hover:text-[#c0c1ff] hover:border-[#c0c1ff] transition-colors rounded">
                    Browse Files
                  </button>
                </div>
              </div>

              {/* Storage Stats */}
              <div className="bg-[#171f33] rounded-xl border border-[#464554]/20 p-6 shadow-xl">
                <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">System Capacity</h2>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold font-heading text-slate-200">1.2<span className="text-sm text-slate-500">GB</span></span>
                  <span className="text-[10px] font-mono text-slate-500">of 5GB Used</span>
                </div>
                <div className="w-full h-1.5 bg-[#0b1326] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4edea3]" style={{ width: "24%" }}></div>
                </div>
              </div>
            </div>

            {/* Current Reading List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#171f33] rounded-xl border border-[#464554]/20 p-2 shadow-xl">
                <div className="flex-1 flex items-center px-4 gap-2 w-full">
                  <span className="material-symbols-outlined text-slate-500">search</span>
                  <input 
                    className="w-full bg-transparent border-none text-sm text-slate-200 focus:outline-none focus:ring-0 placeholder-slate-500 h-10" 
                    placeholder="Search library..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto px-2 pb-2 sm:pb-0 hide-scrollbar">
                  <button className="px-3 py-1.5 rounded bg-[#222a3d] text-[#c0c1ff] border border-[#c0c1ff]/30 text-xs font-mono uppercase tracking-wider">Active</button>
                  <button className="px-3 py-1.5 rounded bg-transparent text-slate-400 border border-transparent hover:border-[#464554]/30 text-xs font-mono uppercase tracking-wider">Completed</button>
                  <button className="px-3 py-1.5 rounded bg-transparent text-slate-400 border border-transparent hover:border-[#464554]/30 text-xs font-mono uppercase tracking-wider">Archived</button>
                </div>
              </div>

              {/* Book List */}
              <div className="flex flex-col gap-4">
                {[
                  { title: "Neuromancer", author: "William Gibson", format: "EPUB", progress: 64, est: "2h 15m remaining at 450 WPM" },
                  { title: "The Design of Everyday Things", author: "Don Norman", format: "PDF", progress: 12, est: "8h 30m remaining at 380 WPM" },
                  { title: "Research Notes - Q3", author: "Internal Document", format: "TXT", progress: 0, est: "Not started" }
                ].filter(book => book.title.toLowerCase().includes(searchQuery.toLowerCase())).map((book, index) => (
                  <div 
                    key={index}
                    className="bg-[#171f33]/60 backdrop-blur-xl border border-[#464554]/20 rounded-xl p-5 flex flex-col sm:flex-row gap-6 relative overflow-hidden group hover:border-[#c0c1ff] transition-all cursor-pointer shadow-md"
                  >
                    {/* Progress visual background */}
                    <div 
                      className="absolute top-0 left-0 bottom-0 bg-[#c0c1ff] opacity-[0.03] transition-all group-hover:opacity-[0.05]" 
                      style={{ width: `${book.progress}%` }}
                    />
                    
                    <div className="w-16 h-20 bg-[#0b1326] border border-[#464554]/30 rounded-lg flex items-center justify-center shrink-0 relative z-10 shadow-sm">
                      <span className="material-symbols-outlined text-slate-500 text-3xl">menu_book</span>
                      <div className="absolute bottom-1 right-1 bg-[#222a3d] px-1 rounded text-[8px] font-mono text-slate-400">{book.format}</div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between relative z-10">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-base font-bold font-heading text-slate-200 group-hover:text-[#c0c1ff] transition-colors">{book.title}</h3>
                          <button className="text-slate-500 hover:text-[#c0c1ff] transition-colors">
                            <span className="material-symbols-outlined text-xl">more_vert</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">{book.author}</p>
                      </div>
                      
                      <div className="mt-4 flex flex-col gap-2">
                        <div className="flex justify-between items-end text-[10px] font-mono">
                          <span className="text-[#c0c1ff] font-bold">{book.progress}% Complete</span>
                          <span className="text-slate-500">{book.est}</span>
                        </div>
                        <div className="w-full h-1 bg-[#0b1326] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#c0c1ff] transition-all duration-300" 
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
