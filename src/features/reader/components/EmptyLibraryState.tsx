"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

interface EmptyLibraryStateProps {
  localFileInputRef: React.RefObject<HTMLInputElement | null>;
  handleLocalFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerLocalFileBrowser: () => void;
}

export function EmptyLibraryState({
  localFileInputRef,
  handleLocalFileChange,
  triggerLocalFileBrowser,
}: EmptyLibraryStateProps) {
  const router = useRouter();

  return (
    <div className="bg-background text-foreground font-sans h-screen flex flex-col md:flex-row antialiased transition-all duration-300 relative overflow-hidden">
      <Sidebar activePath="/reader" />
      <input
        type="file"
        ref={localFileInputRef}
        onChange={handleLocalFileChange}
        accept=".pdf,.epub,.txt"
        className="hidden"
      />

      <main className="flex-1 flex flex-col items-center justify-center p-8 md:pl-72 relative z-10">
        <div className="max-w-md w-full bg-card border border-border/30 rounded-2xl p-8 text-center shadow-2xl glass-panel relative overflow-hidden flex flex-col items-center justify-center gap-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-pulse relative z-10">
            <span className="material-symbols-outlined text-4xl">auto_stories</span>
          </div>

          <div className="relative z-10">
            <h2 className="text-xl font-bold font-heading text-foreground mb-2">Reading room</h2>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed max-w-xs mx-auto">
              Your speed reading center is ready, but your library is empty. Upload a PDF, EPUB, or TXT volume to begin calibrating foveal focus.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2 relative z-10">
            <button
              onClick={() => router.push("/library")}
              className="flex-1 py-2.5 border border-border/30 rounded-lg text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">library_books</span>
              Go to library
            </button>
            <button
              onClick={triggerLocalFileBrowser}
              className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-mono uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">upload_file</span>
              Browse book
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
