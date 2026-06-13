"use client";

import * as React from "react";
import { Library, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { VisiMascot } from "@/components/ui/VisiMascot";

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
    <div className="h-screen flex flex-col items-center justify-center p-8 relative z-10 overflow-hidden">
      <input
        type="file"
        ref={localFileInputRef}
        onChange={handleLocalFileChange}
        accept=".pdf,.epub,.txt"
        className="hidden"
      />

      <div className="max-w-md w-full bg-card border border-border/30 rounded-2xl p-8 text-center shadow-2xl liquid-glass relative overflow-hidden flex flex-col items-center justify-center gap-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <VisiMascot variant="empty" size={100} className="-mb-2" />
        </div>

        <div className="relative z-10">
          <h2 className="text-xl font-bold font-heading text-foreground mb-2">Reading room</h2>
          <p className="text-xs text-muted-foreground font-sans leading-relaxed max-w-xs mx-auto">
            Your speed reading center is ready, but your library is empty. Upload a PDF, EPUB, or TXT volume to begin reading.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2 relative z-10">
          <button
            onClick={() => router.push("/library")}
            className="flex-1 py-2.5 border border-border/30 rounded-lg text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all flex items-center justify-center gap-1.5"
          >
            <Library className="h-3.5 w-3.5" />
            Go to library
          </button>
          <button
            onClick={triggerLocalFileBrowser}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-xs font-mono uppercase tracking-wider font-bold shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Browse book
          </button>
        </div>
      </div>
    </div>
  );
}
