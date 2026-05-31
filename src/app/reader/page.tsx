"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { RsvpVisualBox } from "@/features/reader-rsvp/components/RsvpVisualBox";
import { ClusterVisualBox } from "@/features/reader-clusters/components/ClusterVisualBox";
import { ReaderPlayer } from "@/features/reader-controls/components/ReaderPlayer";
import { useSettings } from "@/context/settings-context";
import { useLibrary } from "@/context/library-context";
import { useRouter } from "next/navigation";

// Imported modular subcomponents
import { EmptyLibraryState } from "@/features/reader/components/EmptyLibraryState";
import { BookshelfSelector } from "@/features/reader/components/BookshelfSelector";
import { ReaderHeader } from "@/features/reader/components/ReaderHeader";
import { PagesVisualBox } from "@/features/reader/components/PagesVisualBox";
import { SettingsDrawer } from "@/features/reader/components/SettingsDrawer";
import { CompletionModal } from "@/features/reader/components/CompletionModal";

// Modular hooks
import { useBookIngestion } from "@/features/reader/hooks/useBookIngestion";
import { useReaderPlayback } from "@/features/reader/hooks/useReaderPlayback";

export default function ReaderPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const { books, activeBookId, setActiveBookId, updateBook } = useLibrary();

  const activeBooks = React.useMemo(() => {
    return books.filter((book) => book.status === "active");
  }, [books]);

  // Active book derivation
  const activeBook = React.useMemo(() => {
    if (!activeBookId) return null;
    return activeBooks.find((book) => book.id === activeBookId) || null;
  }, [activeBooks, activeBookId]);

  // Drawer / UI toggles
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drawerTab, setDrawerTab] = React.useState<"general" | "rsvp" | "cluster">("rsvp");
  const [isTocOpen, setIsTocOpen] = React.useState(false);



  // Consuming modular custom hooks
  const {
    localFileInputRef,
    handleLocalFileChange,
    triggerLocalFileBrowser
  } = useBookIngestion();

  // Font-adaptive visual words-per-page scaler to prevent any visual overflows/cuts
  const getSafeWordsPerPage = React.useCallback((fontSize: number, baseWords: number): number => {
    const scale = 16 / fontSize;
    // Apply a safety scaling factor (0.82) to guarantee text fits comfortably inside the 660px container under any font size
    return Math.max(100, Math.round(baseWords * scale * 0.82));
  }, []);

  const wordsPerPage = React.useMemo(() => {
    const baseWords = settings.general.readerWordsPerPage || 300;
    const fontSize = settings.general.readerFontSize || 16;
    return getSafeWordsPerPage(fontSize, baseWords);
  }, [settings.general.readerWordsPerPage, settings.general.readerFontSize, getSafeWordsPerPage]);

  // Consuming the core speed reading engine playback hook
  const {
    activeChapterIndex,
    wordIndex,
    isPlaying,
    wpm,
    mode,
    completedChapter,
    isCompletionModalOpen,
    sessionStats,
    setWordIndex,
    setIsPlaying,
    setWpm,
    setMode,
    setCompletedChapter,
    setIsCompletionModalOpen,
    chaptersData,
    allBookPages,
    setAllBookPages,
    activePage,
    currentChapter,
    words,
    rsvpSequence,
    clusterChunks,
    activeClusterIndex,
    progressPercentage,
    handleChapterChange,
    handlePageChange,
    handlePrevChapter,
    handleNextChapter,
    handleAddBookmark,
    handleRemoveBookmark,
    handleUpdateBookmarkName,
    handleGoToBookmark,
  } = useReaderPlayback({
    activeBook,
    updateBook,
    settings,
    wordsPerPage,
  });

  const openQuickSettings = () => {
    setIsPlaying(false);
    if (mode === "normal") {
      setDrawerTab("general");
    } else {
      setDrawerTab(mode);
    }
    setIsDrawerOpen(true);
  };

  // Calculations for current active RSVP word
  const currentWordObj = rsvpSequence[wordIndex] || { text: "Ready", orpIndex: 1, delayMultiplier: 1.0 };
  const currentWordText = currentWordObj.text;
  const orpIndex = currentWordObj.orpIndex;
  const leftPart = currentWordText.slice(0, orpIndex);
  const focusLetter = currentWordText.charAt(orpIndex);
  const rightPart = currentWordText.slice(orpIndex + 1);

  const readerFontClass = React.useMemo(() => {
    const ff = settings.general.readerFontFamily || "serif";
    switch (ff) {
      case "inter":
        return "font-sans antialiased text-justify";
      case "atkinson":
        return "font-sans antialiased text-justify tracking-wide font-medium";
      case "dyslexic":
        return "font-sans antialiased text-justify tracking-wide font-normal";
      case "serif":
      default:
        return "font-serif antialiased text-justify tracking-normal text-foreground/90";
    }
  }, [settings.general.readerFontFamily]);

  // --- RENDERING STATE 1: COMPLETELY EMPTY LIBRARY ---
  if (books.length === 0) {
    return (
      <EmptyLibraryState
        localFileInputRef={localFileInputRef}
        handleLocalFileChange={handleLocalFileChange}
        triggerLocalFileBrowser={triggerLocalFileBrowser}
      />
    );
  }

  // --- RENDERING STATE 2: BOOKSHELF CHOOSE LIST ---
  if (!activeBook) {
    return (
      <BookshelfSelector
        books={activeBooks}
        setActiveBookId={setActiveBookId}
      />
    );
  }

  // --- RENDERING STATE 3: SPEED READING ENGINE WORKSPACE ---
  return (
    <div className="bg-background text-foreground font-sans h-screen overflow-hidden overscroll-none flex flex-col md:flex-row antialiased transition-all duration-300 relative">
      <Sidebar activePath="/reader" />

      {/* Mobile TopNav */}
      <nav className="md:hidden bg-card border-b border-border/50 flex justify-between items-center w-full px-6 py-4 z-40 sticky top-0 transition-all duration-300">
        <div className="text-xl font-bold tracking-tight text-foreground">Visus</div>
        <div className="flex items-center gap-3">
          <button 
            onClick={openQuickSettings}
            className="w-9 h-9 rounded-full bg-accent flex items-center justify-center border border-border/30 hover:text-primary transition-all text-muted-foreground"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-accent border border-border/30 overflow-hidden">
            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              VP
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col items-center justify-between relative md:pl-64 h-[calc(100vh-80px)] md:h-screen p-6 pt-32 pb-8 overflow-hidden overscroll-none">

        {/* Modular Header Component */}
        <ReaderHeader
          activeBook={activeBook}
          currentChapter={currentChapter}
          activeChapterIndex={activeChapterIndex}
          setActiveChapterIndex={handleChapterChange}
          chaptersData={chaptersData}
          setWordIndex={setWordIndex}
          progressPercentage={progressPercentage}
          mode={mode}
          setMode={setMode}
          setIsPlaying={setIsPlaying}
          setCompletedChapter={setCompletedChapter}
          openQuickSettings={openQuickSettings}
          setActiveBookId={setActiveBookId}
          isTocOpen={isTocOpen}
          setIsTocOpen={setIsTocOpen}
          bookmarks={activeBook.bookmarks || []}
          onGoToBookmark={handleGoToBookmark}
          onDeleteBookmark={handleRemoveBookmark}
        />

        {/* Reading Canvas Container */}
        <div className={`w-full ${
          mode === "cluster" 
            ? "max-w-4xl" 
            : mode === "normal" 
              ? "max-w-5xl" 
              : "max-w-2xl"
        } px-6 md:px-0 flex-1 flex flex-col items-center justify-center relative z-10 transition-opacity duration-300`}>

          {/* Auto-pause Chapter completed overlay */}
          {completedChapter && (
            <div className="absolute inset-0 bg-background/85 dark:bg-background/90 backdrop-blur-md flex flex-col items-center justify-center p-6 z-30 rounded-2xl border border-border/20 transition-all duration-300">
              <div className="max-w-md w-full bg-card border border-border/30 rounded-2xl p-8 text-center shadow-2xl glass-panel relative overflow-hidden flex flex-col items-center justify-center gap-6">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-bounce relative z-10">
                  <span className="material-symbols-outlined text-3xl">auto_stories</span>
                </div>
                
                <div className="relative z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2 block font-bold">Section Completed</span>
                  <h2 className="text-xl font-bold font-heading text-foreground mb-3">{completedChapter}</h2>
                  <p className="text-xs text-muted-foreground font-sans max-w-xs leading-relaxed mx-auto">
                    Excellent comprehension pace! Your mind has successfully processed this chapter. Take a second to breathe and consolidate the information.
                  </p>
                </div>

                <div className="flex gap-3 w-full mt-2 relative z-10">
                  <button
                    onClick={() => {
                      setCompletedChapter(null);
                      setMode("normal");
                    }}
                    className="flex-1 px-4 py-2.5 border border-border/30 rounded text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                  >
                    Back to Pages
                  </button>
                  <button
                    onClick={() => {
                      setCompletedChapter(null);
                      setIsPlaying(true);
                    }}
                    className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded text-xs font-mono uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(var(--primary),0.15)] hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Next Chapter</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === "normal" ? (
            <PagesVisualBox
              currentChapter={currentChapter}
              chaptersData={chaptersData}
              activePage={activePage}
              allBookPages={allBookPages}
              onPagesComputed={setAllBookPages}
              wordIndex={wordIndex}
              setWordIndex={setWordIndex}
              readerFontClass={readerFontClass}
              fontSize={settings.general.readerFontSize || 16}
              onPrevChapter={handlePrevChapter}
              onNextChapter={handleNextChapter}
              setActiveChapterIndex={handleChapterChange}
              bookmarks={activeBook.bookmarks || []}
              onAddBookmark={handleAddBookmark}
              onRemoveBookmark={handleRemoveBookmark}
              onUpdateBookmarkName={handleUpdateBookmarkName}
            />
          ) : mode === "rsvp" ? (
            <RsvpVisualBox
              leftPart={leftPart}
              focusLetter={focusLetter}
              rightPart={rightPart}
              settings={settings.rsvp}
            />
          ) : (
            <ClusterVisualBox
              clusterChunks={clusterChunks}
              activeClusterIndex={activeClusterIndex}
              settings={settings.cluster}
            />
          )}
        </div>

        {/* Player Bar (Hidden in standard page mode) */}
        {mode !== "normal" && (
          <ReaderPlayer
            isPlaying={isPlaying}
            onPlayPauseToggle={() => setIsPlaying(!isPlaying)}
            wpm={wpm}
            onWpmChange={setWpm}
            onRewind={() => setWordIndex((prev) => Math.max(0, prev - 10))}
            onSkip={() => setWordIndex((prev) => Math.min(words.length - 1, prev + 10))}
            mode={mode}
            onPrevPage={() => handlePageChange("prev")}
            onNextPage={() => handlePageChange("next")}
            hasPrevPage={activeChapterIndex > 0}
            hasNextPage={activeChapterIndex < chaptersData.length - 1}
          />
        )}
      </main>

      {/* QUICK SETTINGS DRAWER OVERLAY */}
      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        initialTab={drawerTab}
      />

      {/* BOOK COMPLETION CELEBRATION MODAL */}
      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        bookTitle={activeBook.title}
        stats={sessionStats}
        onNavigateToLibrary={() => router.push("/library")}
        onNavigateToDashboard={() => router.push("/dashboard")}
      />
    </div>
  );
}
