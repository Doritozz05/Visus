"use client";

import * as React from "react";

interface ChapterItem {
  title: string;
}

interface TableOfContentsProps {
  isTocOpen: boolean;
  setIsTocOpen: (open: boolean) => void;
  chaptersData: ChapterItem[];
  activeChapterIndex: number;
  setActiveChapterIndex: (index: number) => void;
  setWordIndex: (index: number) => void;
  /** Horizontal center of the trigger button, in viewport pixels */
  anchorX?: number;
  /** Bottom edge of the trigger button, in viewport pixels */
  anchorY?: number;
}

const DROPDOWN_WIDTH = 288; // sm:w-72 = 18rem = 288px
const MARGIN = 8; // gap between button and dropdown

export function TableOfContents({
  isTocOpen,
  setIsTocOpen,
  chaptersData,
  activeChapterIndex,
  setActiveChapterIndex,
  setWordIndex,
  anchorX,
  anchorY,
}: TableOfContentsProps) {
  if (!isTocOpen) return null;

  // Center the dropdown on the button, but clamp so it never overflows the viewport
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 800;
  const sidebarOffset = typeof window !== "undefined" && window.innerWidth >= 768 ? 256 : 0;
  const rawLeft = (anchorX ?? viewportWidth / 2) - DROPDOWN_WIDTH / 2 - sidebarOffset;
  const clampedLeft = Math.max(8, Math.min(rawLeft, viewportWidth - DROPDOWN_WIDTH - 8));
  const top = (anchorY ?? 120) + MARGIN;

  return (
    <>
      {/* Click-outside backdrop */}
      <div
        onClick={() => setIsTocOpen(false)}
        className="fixed inset-0 z-[35] bg-transparent"
      />
      <div
        style={{ position: "fixed", top, left: clampedLeft }}
        className="w-72 max-h-60 overflow-y-auto z-[40] bg-card border border-border/40 shadow-2xl rounded-xl p-2 animate-fade-in scrollbar-none flex flex-col gap-1"
      >
        <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground px-2 py-1 border-b border-border/10 mb-1 font-bold flex justify-between items-center shrink-0 select-none">
          <span>Chapters Index</span>
          <span>{chaptersData.length} sections</span>
        </div>
        {chaptersData.map((ch, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveChapterIndex(idx);
              setWordIndex(0);
              setIsTocOpen(false);
            }}
            className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] font-sans transition-all flex items-start gap-2 ${activeChapterIndex === idx
              ? "bg-primary/15 border border-primary/20 text-primary font-semibold shadow-sm"
              : "hover:bg-accent hover:text-foreground text-muted-foreground border border-transparent"
              }`}
          >
            <span className="font-mono text-[8px] bg-muted dark:bg-accent/40 px-1 rounded font-bold shrink-0 mt-0.5">
              {idx + 1}
            </span>
            <span className="truncate">{ch.title}</span>
          </button>
        ))}
      </div>
    </>
  );
}
