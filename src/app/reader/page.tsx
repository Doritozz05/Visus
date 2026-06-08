"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { RsvpVisualBox } from "@/features/reader/modes/rsvp/RsvpVisualBox";
import { ClusterVisualBox } from "@/features/reader/modes/cluster/ClusterVisualBox";
import { ReaderPlayer } from "@/features/reader/components/ReaderPlayer";
import { useSettings } from "@/features/settings/context/settings-context";
import { useLibrary } from "@/features/library/context/library-context";
import { useRouter } from "next/navigation";

// Imported modular subcomponents
import { EmptyLibraryState } from "@/features/reader/components/EmptyLibraryState";
import { BookshelfSelector } from "@/features/reader/components/BookshelfSelector";
import { ReaderHeader } from "@/features/reader/components/ReaderHeader";
import { PagesVisualBox } from "@/features/reader/components/PagesVisualBox";
import { SettingsDrawer } from "@/features/reader/components/SettingsDrawer";
import { CompletionModal } from "@/features/reader/components/CompletionModal";
import { ComprehensionQuiz } from "@/features/reader/components/ComprehensionQuiz";
import { generateQuizForChapter, Quiz } from "@/core/algorithms/quiz-generator";

// Modular hooks
import { useBookIngestion } from "@/features/reader/hooks/useBookIngestion";
import { useReaderPlayback } from "@/features/reader/hooks/useReaderPlayback";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useReadingStore } from "@/features/reader/stores/reading-store";
import { READER_FONT_CLASSES } from "@/features/reader/utils/reader-fonts";

export default function ReaderPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const { books, activeBookId, setActiveBookId, updateBook, isHydrated } = useLibrary();

  // Active book derivation
  const activeBook = React.useMemo(() => {
    if (!activeBookId) return null;
    return books.find((book) => book.id === activeBookId) || null;
  }, [books, activeBookId]);

  // Drawer / UI toggles
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drawerTab, setDrawerTab] = React.useState<"general" | "rsvp" | "cluster">("rsvp");
  const [isTocOpen, setIsTocOpen] = React.useState(false);
  const [activeQuiz, setActiveQuiz] = React.useState<Quiz | null>(null);

  const completedChapter = useReadingStore((state) => state.completedChapter);

  React.useEffect(() => {
    setActiveQuiz(null);
  }, [activeBookId, completedChapter]);

  // Consuming modular custom hooks
  const {
    localFileInputRef,
    handleLocalFileChange,
    triggerLocalFileBrowser
  } = useBookIngestion();

  // Font-adaptive visual words-per-page scaler to prevent any visual overflows/cuts
  const getSafeWordsPerPage = React.useCallback((fontSize: number, baseWords: number): number => {
    const scale = 16 / fontSize;
    return Math.max(100, Math.round(baseWords * scale * 0.82));
  }, []);

  const wordsPerPage = React.useMemo(() => {
    const baseWords = settings.general.readerWordsPerPage || 300;
    const fontSize = settings.general.readerFontSize || 16;
    return getSafeWordsPerPage(fontSize, baseWords);
  }, [settings.general.readerWordsPerPage, settings.general.readerFontSize, getSafeWordsPerPage]);

  // Consuming the core speed reading engine playback hook
  const {
    isCompletionModalOpen,
    sessionStats,
    saveProgressForBook,
    setIsPlaying,
    setMode,
    setCompletedChapter,
    setIsCompletionModalOpen,
    chaptersData,
    allBookPages,
    setAllBookPages,
    rsvpSequence,
    clusterChunks,
    handleChapterChange,
    handlePageChange,
    handlePrevChapter,
    handleNextChapter,
    handleRewind,
    handleSkip,
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

  // Low-frequency subscriptions to Zustand store properties
  const mode = useReadingStore((state) => state.mode);
  const activeChapterIndex = useReadingStore((state) => state.activeChapterIndex);
  const storeActiveBookId = useReadingStore((state) => state.activeBookId);

  const isStoreInitialized = activeBook && storeActiveBookId === activeBook.id;

  const currentChapter = React.useMemo(() => {
    const safeIdx = Math.min(Math.max(0, activeChapterIndex), chaptersData.length - 1);
    const ch = chaptersData[safeIdx] || { title: "No Book Loaded", content: "" };
    const wordsArr = ch.content ? ch.content.split(/\s+/).filter(w => w.trim() !== "") : [];
    return { ...ch, words: wordsArr, index: safeIdx };
  }, [chaptersData, activeChapterIndex]);

  const openQuickSettings = () => {
    setIsPlaying(false);
    if (mode === "normal") {
      setDrawerTab("general");
    } else {
      setDrawerTab(mode);
    }
    setIsDrawerOpen(true);
  };

  const readerFontClass = React.useMemo(() => {
    const ff = settings.general.readerFontFamily || "serif";
    return READER_FONT_CLASSES[ff as keyof typeof READER_FONT_CLASSES] || READER_FONT_CLASSES.serif;
  }, [settings.general.readerFontFamily]);

  if (!isHydrated || (activeBook && !isStoreInitialized)) {
    return <LoadingSpinner message="Loading reader session..." fullScreen />;
  }

  if (books.length === 0) {
    return (
      <EmptyLibraryState
        localFileInputRef={localFileInputRef}
        handleLocalFileChange={handleLocalFileChange}
        triggerLocalFileBrowser={triggerLocalFileBrowser}
      />
    );
  }

  if (!activeBook) {
    return (
      <BookshelfSelector
        books={books.filter((book) => book.status === "active")}
        setActiveBookId={setActiveBookId}
      />
    );
  }

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

        <ReaderHeader
          activeBook={activeBook}
          setActiveChapterIndex={handleChapterChange}
          chaptersData={chaptersData}
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

          {completedChapter && mode !== "normal" ? (
            activeQuiz ? (
              <ComprehensionQuiz
                quiz={activeQuiz}
                onComplete={(accuracy, focusLevel) => {
                  if (!activeBook) return;
                  const chapterWords = currentChapter.words.length || 1;
                  const speedWpm = useReadingStore.getState().wpm || 600;
                  const durationSeconds = Math.round(chapterWords / (speedWpm / 60)) || 10;
                  
                  import("@/core/services/stats-service").then(({ StatsService }) => {
                    StatsService.recordSession({
                      bookId: activeBook.id,
                      bookTitle: `${activeBook.title} - ${completedChapter}`,
                      mode: mode,
                      speedWpm: speedWpm,
                      durationSeconds: durationSeconds,
                      accuracy: accuracy
                    });
                  });
                }}
                onClose={() => {
                  setActiveQuiz(null);
                  setCompletedChapter(null);
                  setMode("normal");
                }}
                onNextChapter={() => {
                  setActiveQuiz(null);
                  setCompletedChapter(null);
                  handleNextChapter();
                }}
              />
            ) : (
              <div className="max-w-md w-full bg-card border border-border/30 rounded-2xl p-8 text-center shadow-2xl glass-panel relative overflow-hidden flex flex-col items-center justify-center gap-6 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-bounce relative z-10">
                  <span className="material-symbols-outlined text-3xl">auto_stories</span>
                </div>
                
                <div className="relative z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2 block font-bold">Section completed</span>
                  <h2 className="text-xl font-bold font-heading text-foreground mb-3">{completedChapter}</h2>
                  <p className="text-xs text-muted-foreground font-sans max-w-xs leading-relaxed mx-auto">
                    Excellent comprehension pace! Your mind has successfully processed this chapter. Take a second to breathe and consolidate the information.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full mt-2 relative z-10 font-sans">
                  <button
                    onClick={() => {
                      const generated = generateQuizForChapter(completedChapter, currentChapter.content);
                      setActiveQuiz(generated);
                    }}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-xs font-mono uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(var(--primary),0.15)] hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Take comprehension quiz</span>
                    <span className="material-symbols-outlined text-sm">quiz</span>
                  </button>
                  
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => {
                        setCompletedChapter(null);
                        setMode("normal");
                      }}
                      className="flex-1 px-4 py-2.5 border border-border/30 rounded text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                    >
                      Back to pages
                    </button>
                    <button
                      onClick={() => {
                        setCompletedChapter(null);
                        handleNextChapter();
                      }}
                      className="flex-1 px-4 py-2.5 bg-accent text-primary border border-primary/20 rounded text-xs font-mono uppercase tracking-wider font-bold hover:bg-accent/85 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Skip quiz</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : mode === "normal" ? (
            <PagesVisualBox
              key={activeBook.id}
              currentChapter={currentChapter}
              chaptersData={chaptersData}
              allBookPages={allBookPages}
              onPagesComputed={setAllBookPages}
              savedLocalPageIndex={activeBook.lastChapterIndex === activeChapterIndex ? activeBook.lastLocalPageIndex : undefined}
              onSavePageProgress={(localPageIdx, wIdx) => {
                saveProgressForBook(activeBook.id, activeChapterIndex, wIdx, localPageIdx);
              }}
              readerFontClass={readerFontClass}
              fontSize={settings.general.readerFontSize || 16}
              wordsPerPage={wordsPerPage}
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
              rsvpSequence={rsvpSequence}
              settings={settings.rsvp}
            />
          ) : (
            <ClusterVisualBox
              clusterChunks={clusterChunks}
              settings={settings.cluster}
            />
          )}
        </div>

        {/* Player Bar (Hidden in standard page mode) */}
        {mode !== "normal" && (
          <ReaderPlayer
            onRewind={handleRewind}
            onSkip={handleSkip}
            onPrevPage={() => handlePageChange("prev")}
            onNextPage={() => handlePageChange("next")}
            allBookPages={allBookPages}
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
