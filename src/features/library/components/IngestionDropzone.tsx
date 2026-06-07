"use client";

import * as React from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface IngestionDropzoneProps {
  isDragOver: boolean;
  isIngesting: boolean;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  triggerFileBrowser: () => void;
}

export function IngestionDropzone({
  isDragOver,
  isIngesting,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  triggerFileBrowser,
}: IngestionDropzoneProps) {
  return (
    <div className="bg-card border border-border/20 rounded-xl p-6 flex flex-col flex-1 relative overflow-hidden group shadow-xl glass-panel min-h-[360px] lg:min-h-[calc(58vh-4rem)]">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-50"></div>
      <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4 relative z-10">Ingestion</h2>
      
      {/* Drag and Drop Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileBrowser}
        className={`border border-dashed border-border/50 rounded-xl flex-1 flex flex-col items-center justify-center p-8 text-center transition-all duration-300 relative z-10 cursor-pointer ${
          isDragOver 
            ? "border-primary bg-accent/65 shadow-[inset_0_0_15px_rgba(var(--primary),0.1)] scale-[0.98]" 
            : "bg-background/80 hover:bg-accent/40 hover:border-primary/50"
        }`}
        id="drop-zone"
      >
        {isIngesting ? (
          <LoadingSpinner 
            message="Extracting text..." 
            className="min-h-[160px] p-0" 
          />
        ) : (
          <>
            <span className="material-symbols-outlined text-4xl text-muted-foreground mb-3 group-hover:text-primary transition-colors animate-pulse">upload_file</span>
            <p className="text-sm font-semibold text-foreground mb-1">Drag & drop files here</p>
            <p className="text-[10px] font-mono text-muted-foreground/80">PDF, EPUB, TXT formats supported</p>
            <button 
              onClick={(e) => { e.stopPropagation(); triggerFileBrowser(); }}
              className="mt-6 px-4 py-2 border border-border/40 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-primary hover:border-primary transition-all rounded bg-card/90"
            >
              Browse files
            </button>
          </>
        )}
      </div>
    </div>
  );
}
