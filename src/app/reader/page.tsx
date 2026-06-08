"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { ReaderPlayer } from "@/features/reader/components/ReaderPlayer";
import { useSettings } from "@/features/settings/context/settings-context";
import { useLibrary } from "@/features/library/context/library-context";
import { useRouter } from "next/navigation";

// Imported modular subcomponents
import { EmptyLibraryState } from "@/features/reader/components/EmptyLibraryState";
import { BookshelfSelector } from "@/features/reader/components/BookshelfSelector";
import { ReaderHeader } from "@/features/reader/components/ReaderHeader";
import { SettingsDrawer } from "@/features/reader/components/SettingsDrawer";
import { CompletionModal } from "@/features/reader/components/CompletionModal";
import { MobileReaderNav } from "@/features/reader/components/MobileReaderNav";
import { ReadingCanvas } from "@/features/reader/components/ReadingCanvas";

// Modular hooks
import { useBookIngestion } from "@/features/reader/hooks/useBookIngestion";
import { useReaderPlayback } from "@/features/reader/hooks/useReaderPlayback";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useReadingStore } from "@/features/reader/stores/reading-store";
import { READER_FONT_CLASSES } from "@/features/reader/utils/reader-fonts";
import { Quiz } from "@/core/algorithms/quiz-generator";

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
  const setCompletedChapter = useReadingStore((state) => state.setCompletedChapter);
  const setIsPlaying = useReadingStore((state) => state.setIsPlaying);
  const isCompletionModalOpen = useReadingStore((state) => state.isCompletionModalOpen);
  const setIsCompletionModalOpen = useReadingStore((state) => state.setIsCompletionModalOpen);
  const sessionStats = useReadingStore((state) => state.sessionStats);

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
    saveProgressForBook,
    setMode,
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

      {/* Mobile TopNav (Extracted) */}
      <MobileReaderNav onOpenSettings={openQuickSettings} />

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col items-center justify-between relative md:pl-64 h-[calc(100vh-80px)] md:h-screen p-6 pt-4 pb-8 overflow-hidden overscroll-none">
        
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

        {/* Reading Canvas Container (Extracted) */}
        <ReadingCanvas
          mode={mode}
          completedChapter={completedChapter}
          activeQuiz={activeQuiz}
          setActiveQuiz={setActiveQuiz}
          setCompletedChapter={setCompletedChapter}
          setMode={setMode}
          activeBook={activeBook}
          currentChapter={currentChapter}
          chaptersData={chaptersData}
          activeChapterIndex={activeChapterIndex}
          wordsPerPage={wordsPerPage}
          readerFontClass={readerFontClass}
          settings={settings}
          rsvpSequence={rsvpSequence}
          clusterChunks={clusterChunks}
          handleNextChapter={handleNextChapter}
          handlePrevChapter={handlePrevChapter}
          handleChapterChange={handleChapterChange}
          saveProgressForBook={saveProgressForBook}
          handleAddBookmark={handleAddBookmark}
          handleRemoveBookmark={handleRemoveBookmark}
          handleUpdateBookmarkName={handleUpdateBookmarkName}
        />

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
