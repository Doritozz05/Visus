"use client";

import * as React from "react";
import { Bookmark } from "@/core/entities/book";
import { BookmarkCorner } from "./BookmarkCorner";

interface VisualPage {
  pageIndex: number;
  chapterIndex: number;
  absolutePageIndex: number;
  startWordIndex: number;
  endWordIndex: number;
  content: string;
  leftColumn: string;
  rightColumn: string;
}

interface ChapterData {
  title: string;
  content: string;
  htmlContent?: string;
  index: number;
  words?: string[];
}

interface PagesVisualBoxProps {
  currentChapter: ChapterData;
  activePage: VisualPage | null;
  allBookPages: VisualPage[];
  wordIndex: number;
  setWordIndex: (w: number) => void;
  readerFontClass: string;
  fontSize: number;
  handlePageChange: (direction: "prev" | "next") => void;
  bookmarks: Bookmark[];
  onAddBookmark: (name: string, chapterIndex: number, wordIndex: number) => void;
  onRemoveBookmark: (id: string) => void;
  onUpdateBookmarkName: (id: string, name: string) => void;
}

export function PagesVisualBox({
  currentChapter,
  activePage,
  allBookPages,
  wordIndex,
  setWordIndex,
  readerFontClass,
  fontSize,
  handlePageChange,
  bookmarks,
  onAddBookmark,
  onRemoveBookmark,
  onUpdateBookmarkName,
}: PagesVisualBoxProps) {
  // Bookmark positions relative to active page
  const pageStartWordIndex = React.useMemo(() => {
    return activePage?.startWordIndex ?? 0;
  }, [activePage]);

  const pageEndWordIndex = React.useMemo(() => {
    return activePage?.endWordIndex ?? 0;
  }, [activePage]);

  const activeBookmark = React.useMemo(() => {
    if (!bookmarks || !activePage) return null;
    return (
      bookmarks.find((b) => {
        return (
          b.chapterIndex === currentChapter.index &&
          b.wordIndex >= pageStartWordIndex &&
          b.wordIndex <= pageEndWordIndex
        );
      }) || null
    );
  }, [bookmarks, currentChapter.index, pageStartWordIndex, pageEndWordIndex, activePage]);

  const defaultBookmarkName = React.useMemo(() => {
    const pageNum = activePage ? activePage.absolutePageIndex * 2 + 1 : 1;
    return `Section ${currentChapter.index + 1}, page ${pageNum}`;
  }, [currentChapter.index, activePage]);

  // Premium parser to style headings in primary theme color, and clean premature word-wrapping newlines inside text bodies
  const formatParagraphs = React.useCallback((text: string) => {
    if (!text) return "";
    return text
      .split(/\n\n+/)
      .map((p: string) => {
        const clean = p.trim();
        if (clean.length === 0) return "";
        
        // Matches exact chapter title or generic section markers
        const isHeading = 
          clean.toLowerCase() === currentChapter.title.toLowerCase() ||
          /^(chapter|capítulo|section|sección|capitulo|seccion)\s+\d+/i.test(clean) ||
          /^(chapter|capítulo|section|sección|capitulo|seccion)\s+[ivxlcdm]+/i.test(clean) ||
          (clean.length < 60 && clean === clean.toUpperCase() && /[A-Z]/.test(clean));
          
        if (isHeading) {
          return `<h2 class="text-base md:text-lg font-bold font-heading text-primary mb-4 mt-2 tracking-tight leading-tight uppercase select-none">${clean}</h2>`;
        }
        
        // Clean single internal newlines (\n) within a paragraph to allow seamless justified wrapping
        const sentenceFlow = clean.replace(/\n+/g, " ");
        return `<p class="mb-4 text-justify leading-relaxed text-foreground/90">${sentenceFlow}</p>`;
      })
      .join("");
  }, [currentChapter.title]);

  // Checks if the text starts with a paragraph formatted as a heading
  const startsWithHeading = React.useCallback((text: string) => {
    if (!text) return false;
    const firstParagraph = text.split(/\n\n+/)[0]?.trim();
    if (!firstParagraph) return false;
    return (
      firstParagraph.toLowerCase() === currentChapter.title.toLowerCase() ||
      /^(chapter|capítulo|section|sección|capitulo|seccion)\s+\d+/i.test(firstParagraph) ||
      /^(chapter|capítulo|section|sección|capitulo|seccion)\s+[ivxlcdm]+/i.test(firstParagraph) ||
      (firstParagraph.length < 60 && firstParagraph === firstParagraph.toUpperCase() && /[A-Z]/.test(firstParagraph))
    );
  }, [currentChapter.title]);

  return (
    <div className="w-full bg-card/65 dark:bg-card/45 border border-border/20 rounded-2xl px-5 pb-4 pt-8 md:px-8 md:pt-11 md:pb-6 shadow-2xl glass-panel relative overflow-hidden transition-opacity duration-300 flex flex-col h-[660px] min-h-[660px] max-h-[660px]">
      
      {/* Ribbon Bookmark Corner */}
      <BookmarkCorner
        bookmarks={bookmarks}
        currentChapterIndex={currentChapter.index}
        currentWordIndex={pageStartWordIndex}
        chapterTitle={currentChapter.title}
        defaultName={defaultBookmarkName}
        activeBookmark={activeBookmark}
        onAddBookmark={(name) => onAddBookmark(name, currentChapter.index, pageStartWordIndex)}
        onRemoveBookmark={onRemoveBookmark}
        onUpdateBookmarkName={onUpdateBookmarkName}
      />

      {/* Book spine simulation (Desktop only) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/20 to-transparent z-10"></div>
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 bg-gradient-to-r from-black/5 via-transparent to-black/5 dark:from-black/15 dark:via-transparent dark:to-black/15 -ml-4 pointer-events-none z-10"></div>

      {/* Header */}
      <div className="flex justify-between items-start gap-4 text-[10px] font-mono tracking-widest text-muted-foreground uppercase pb-4 border-b border-border/10 mb-4 shrink-0">
        <span className="shrink-0">Visus Reader &bull; Pro</span>
        <span className="text-primary font-bold text-right break-words whitespace-normal max-w-[70%] leading-normal tracking-wide">
          {currentChapter.title}
        </span>
      </div>

      {/* Static Kindle-Level Canvas */}
      <div className="flex-1 w-full overflow-hidden relative my-2 flex flex-col justify-start">
        {activePage ? (
          <div
            className={`${readerFontClass} h-full w-full select-none grid grid-cols-1 md:grid-cols-2 gap-16`}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: "1.75",
            }}
          >
            {/* Mobile View: Shows full page content in one column */}
            <div className="md:hidden text-justify text-foreground/90 whitespace-normal break-words leading-relaxed">
              {activePage.pageIndex === 0 && !startsWithHeading(activePage.content) && (
                <h2 className="text-lg md:text-xl font-bold font-heading text-primary mb-4 mt-2 tracking-tight leading-tight uppercase select-none">
                  {currentChapter.title}
                </h2>
              )}
              <div dangerouslySetInnerHTML={{
                __html: formatParagraphs(activePage.content)
              }} />
            </div>

            {/* Desktop Left Column */}
            <div className="hidden md:block text-justify text-foreground/90 whitespace-normal break-words leading-relaxed">
              {activePage.pageIndex === 0 && !startsWithHeading(activePage.leftColumn) && (
                <h2 className="text-lg md:text-xl font-bold font-heading text-primary mb-4 mt-2 tracking-tight leading-tight uppercase select-none">
                  {currentChapter.title}
                </h2>
              )}
              <div dangerouslySetInnerHTML={{
                __html: formatParagraphs(activePage.leftColumn)
              }} />
            </div>
            {/* Desktop Right Column */}
            <div className="hidden md:block text-justify text-foreground/90 whitespace-normal break-words leading-relaxed">
              <div dangerouslySetInnerHTML={{
                __html: formatParagraphs(activePage.rightColumn)
              }} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground font-mono text-xs">
            Loading page...
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-3 border-t border-border/10 mt-3 text-xs font-mono text-muted-foreground relative shrink-0">
        <button
          onClick={() => handlePageChange("prev")}
          disabled={activePage ? activePage.absolutePageIndex === 0 : true}
          className="flex items-center gap-1.5 hover:text-primary transition-colors disabled:opacity-30 disabled:pointer-events-none z-20"
        >
          <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
          Previous
        </button>

        {/* Left Page Number absolute (Desktop only) */}
        <div className="absolute left-[20%] -translate-x-1/2 hidden lg:block text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/60">
          Page {activePage ? activePage.absolutePageIndex * 2 + 1 : 1}
        </div>

        {/* Right Page Number absolute (Desktop only) */}
        <div className="absolute left-[80%] -translate-x-1/2 hidden lg:block text-[10px] tracking-wider uppercase font-semibold text-muted-foreground/60">
          {activePage && activePage.absolutePageIndex * 2 + 2 <= allBookPages.length * 2 ? `Page ${activePage.absolutePageIndex * 2 + 2}` : ""}
        </div>

        <button
          onClick={() => handlePageChange("next")}
          className={`flex items-center gap-1.5 transition-all z-20 hover:text-primary ${
            activePage && activePage.absolutePageIndex === allBookPages.length - 1
              ? "text-primary font-extrabold bg-primary/10 border border-primary/20 px-3 py-1 rounded hover:bg-primary hover:text-primary-foreground shadow-sm animate-pulse"
              : ""
          }`}
        >
          {activePage && activePage.absolutePageIndex === allBookPages.length - 1 ? (
            <>
              Complete Book
              <span className="material-symbols-outlined text-base">task_alt</span>
            </>
          ) : (
            <>
              Next
              <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
