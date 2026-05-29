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
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col md:flex-row antialiased transition-all duration-300">
      <Sidebar activePath="/library" />

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

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header area */}
        <header className="hidden md:flex justify-between items-center px-8 py-6 border-b border-border/20">
          <h1 className="text-3xl font-extrabold font-heading text-foreground">Library</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span className="material-symbols-outlined text-primary text-sm">local_fire_department</span>
              <span>Streak: 12 Days</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
              VP
            </div>
          </div>
        </header>

        <div className="p-6 md:p-12 flex-1 max-w-5xl mx-auto w-full">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Upload Zone & Storage */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-card border border-border/20 rounded-xl p-6 flex flex-col h-full relative overflow-hidden group shadow-xl glass-panel">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-50"></div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 relative z-10">Ingestion</h2>
                
                {/* Drag and Drop Zone */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border border-dashed border-border/50 rounded-xl flex-1 flex flex-col items-center justify-center p-8 text-center transition-all duration-300 relative z-10 cursor-pointer ${
                    isDragOver 
                      ? "border-primary bg-accent shadow-[inset_0_0_15px_rgba(var(--primary),0.1)]" 
                      : "bg-background hover:bg-accent/40 hover:border-primary/50"
                  }`}
                  id="drop-zone"
                >
                  <span className="material-symbols-outlined text-4xl text-muted-foreground mb-4 group-hover:text-primary transition-colors">upload_file</span>
                  <p className="text-sm font-semibold text-foreground mb-1">Drop files here</p>
                  <p className="text-[10px] font-mono text-muted-foreground/80">PDF, EPUB, TXT</p>
                  <button className="mt-6 px-4 py-2 border border-border/40 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary transition-colors rounded bg-card">
                    Browse files
                  </button>
                </div>
              </div>

              {/* Reading Stats - Books Read */}
              <div className="bg-card rounded-xl border border-border/20 p-6 shadow-xl glass-panel relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 relative z-10">Books read</h2>
                <div className="flex justify-between items-end mb-2 relative z-10">
                  <span className="text-3xl font-extrabold font-heading text-foreground">
                    12
                    <span className="text-sm text-muted-foreground/80 font-normal ml-1">/ 15</span>
                  </span>
                  <span className="text-[10px] font-mono text-primary font-bold">80% Yearly Goal</span>
                </div>
                <div className="w-full h-2 bg-background rounded-full overflow-hidden relative z-10 border border-border/10">
                  <div className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500 group-hover:brightness-110" style={{ width: "80%" }}></div>
                </div>
                <p className="text-[9px] font-mono text-muted-foreground mt-3 relative z-10">
                  Doing great! Next milestone is just 3 books away.
                </p>
              </div>
            </div>

            {/* Current Reading List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-card rounded-xl border border-border/20 p-2 shadow-xl glass-panel">
                <div className="flex-1 flex items-center px-4 gap-2 w-full">
                  <span className="material-symbols-outlined text-muted-foreground">search</span>
                  <input 
                    className="w-full bg-transparent border-none text-sm text-foreground focus:outline-none focus:ring-0 placeholder-muted-foreground/60 h-10" 
                    placeholder="Search library..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto px-2 pb-2 sm:pb-0 hide-scrollbar">
                  <button className="px-3 py-1.5 rounded bg-accent text-primary border border-primary/30 text-xs font-mono uppercase tracking-wider">Active</button>
                  <button className="px-3 py-1.5 rounded bg-transparent text-muted-foreground border border-transparent hover:border-border/30 text-xs font-mono uppercase tracking-wider">Completed</button>
                  <button className="px-3 py-1.5 rounded bg-transparent text-muted-foreground border border-transparent hover:border-border/30 text-xs font-mono uppercase tracking-wider">Archived</button>
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
                    className="bg-card border border-border/20 rounded-xl p-5 flex flex-col sm:flex-row gap-6 relative overflow-hidden group hover:border-primary transition-all cursor-pointer shadow-md glass-panel"
                  >
                    {/* Progress visual background */}
                    <div 
                      className="absolute top-0 left-0 bottom-0 bg-primary opacity-[0.03] transition-all group-hover:opacity-[0.05]" 
                      style={{ width: `${book.progress}%` }}
                    />
                    
                    <div className="w-16 h-20 bg-background border border-border/30 rounded-lg flex items-center justify-center shrink-0 relative z-10 shadow-sm">
                      <span className="material-symbols-outlined text-muted-foreground text-3xl">menu_book</span>
                      <div className="absolute bottom-1 right-1 bg-accent px-1 rounded text-[8px] font-mono text-muted-foreground">{book.format}</div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between relative z-10">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-base font-bold font-heading text-foreground group-hover:text-primary transition-colors">{book.title}</h3>
                          <button className="text-muted-foreground hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">more_vert</span>
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono">{book.author}</p>
                      </div>
                      
                      <div className="mt-4 flex flex-col gap-2">
                        <div className="flex justify-between items-end text-[10px] font-mono">
                          <span className="text-primary font-bold">{book.progress}% Complete</span>
                          <span className="text-muted-foreground">{book.est}</span>
                        </div>
                        <div className="w-full h-1 bg-background rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300" 
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
