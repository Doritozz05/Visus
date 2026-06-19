"use client";

import * as React from "react";
import { ReaderPlayer } from "@/features/reader/components/ReaderPlayer";
import { useSettings } from "@/features/settings/context/settings-context";
import { useLibrary } from "@/features/library/context/library-context";
import { useRouter } from "next/navigation";

// Imported modular subcomponents
import { dbService } from "@/core/services/db-service";
import { BookBinary } from "@/core/entities/book";
import { EmptyLibraryState } from "@/features/reader/components/EmptyLibraryState";
import { BookshelfSelector } from "@/features/reader/components/BookshelfSelector";
import { ReaderHeader } from "@/features/reader/components/ReaderHeader";
import { SettingsDrawer } from "@/features/reader/components/SettingsDrawer";
import { CompletionModal } from "@/features/reader/components/CompletionModal";
import { ReadingCanvas } from "@/features/reader/components/ReadingCanvas";

// Modular hooks
import { useBookIngestion } from "@/features/reader/hooks/useBookIngestion";
import { useReaderPlayback } from "@/features/reader/hooks/useReaderPlayback";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useReadingStore } from "@/features/reader/stores/reading-store";
import { TelemetryTrackerWrapper } from "@/features/reader/components/TelemetryTrackerWrapper";
import { AnnotationsSidebar } from "@/features/reader/components/AnnotationsSidebar";
import { Quiz } from "@/core/algorithms/quiz-generator";
import { toast } from "sonner";
import { PomodoroTimer } from "@/features/stats/components/PomodoroTimer";
import { Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getReaderFontClass } from "@/lib/typography";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -25 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 260, damping: 20 } 
  }
};

const canvasVariants = {
  hidden: { opacity: 0, scale: 0.985, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 22 } 
  }
};

const playerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 260, damping: 20 } 
  }
};

export default function ReaderClient() {
  const router = useRouter();
  const { settings } = useSettings();
  const { books, activeBookId, setActiveBookId, updateBook, isHydrated } = useLibrary();

  // --- 1. STATE & STORE HOOKS (TOP LEVEL) ---
  const [bookBinary, setBookBinary] = React.useState<BookBinary | null>(null);
  const [isLoadingContent, setIsLoadingContent] = React.useState(true);
  const [isInitializing, setIsInitializing] = React.useState(true);
  
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [drawerTab, setDrawerTab] = React.useState<"general" | "rsvp" | "cluster" | "normal">("rsvp");
  const [isTocOpen, setIsTocOpen] = React.useState(false);
  const [isAnnotationsOpen, setIsAnnotationsOpen] = React.useState(false);
  const [activeQuiz, setActiveQuiz] = React.useState<Quiz | null>(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = React.useState(false);

  const mode = useReadingStore((state) => state.mode);
  const activeChapterIndex = useReadingStore((state) => state.activeChapterIndex);
  const setWordIndex = useReadingStore((state) => state.setWordIndex);
  const storeActiveBookId = useReadingStore((state) => state.activeBookId);
  const completedChapter = useReadingStore((state) => state.completedChapter);
  const setCompletedChapter = useReadingStore((state) => state.setCompletedChapter);
  const setIsPlaying = useReadingStore((state) => state.setIsPlaying);
  const isCompletionModalOpen = useReadingStore((state) => state.isCompletionModalOpen);
  const setIsCompletionModalOpen = useReadingStore((state) => state.setIsCompletionModalOpen);
  const isFocusMode = useReadingStore((state) => state.isFocusMode);
  const setIsFocusMode = useReadingStore((state) => state.setIsFocusMode);
  const sessionStats = useReadingStore((state) => state.sessionStats);

  const wpm = useReadingStore((state) => state.wpm);
  const { updateGeneralSettings } = useSettings();

  // --- 2. CUSTOM HOOKS ---
  const { localFileInputRef, handleLocalFileChange, triggerLocalFileBrowser } = useBookIngestion();

  // Persist WPM and Mode changes to general settings
  React.useEffect(() => {
    if (!isHydrated) return;
    
    const lastSavedWpm = settings.general.lastUsedWpm;
    const lastSavedMode = settings.general.lastUsedMode;

    if (wpm !== lastSavedWpm || mode !== lastSavedMode) {
      updateGeneralSettings({
        lastUsedWpm: wpm,
        lastUsedMode: mode
      });
    }
  }, [wpm, mode, isHydrated, updateGeneralSettings, settings.general.lastUsedWpm, settings.general.lastUsedMode]);

  // Initialize focus mode from settings on hydration
  const focusInitialized = React.useRef(false);
  React.useEffect(() => {
    if (!isHydrated || focusInitialized.current) return;
    focusInitialized.current = true;
    const saved = settings.general.isFocusMode;
    if (saved !== undefined) {
      setIsFocusMode(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  React.useEffect(() => {
    if (!isHydrated) return;
    updateGeneralSettings({ isFocusMode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocusMode, isHydrated, updateGeneralSettings]);

  // Active book derivation
  const activeBook = React.useMemo(() => {
    if (!activeBookId) return null;
    return books.find((book) => book.id === activeBookId) || null;
  }, [books, activeBookId]);

  const handleGoToAnnotation = (chapterIndex: number, wordIndex: number) => {
    handleChapterChange(chapterIndex);
    setWordIndex(wordIndex);
    setIsAnnotationsOpen(false);
    if (activeBook) {
      saveProgressForBook(activeBook.id, chapterIndex, wordIndex);
    }
  };

  const getSafeWordsPerPage = React.useCallback((fontSize: number, baseWords: number): number => {
    const scale = 16 / fontSize;
    return Math.max(100, Math.round(baseWords * scale * 0.82));
  }, []);

  const wordsPerPage = React.useMemo(() => {
    const baseWords = settings.general.readerWordsPerPage || 300;
    const fontSize = settings.general.readerFontSize || 16;
    return getSafeWordsPerPage(fontSize, baseWords);
  }, [settings.general.readerWordsPerPage, settings.general.readerFontSize, getSafeWordsPerPage]);

  // Synchronously derive loading state to prevent race conditions during book transitions
  const isActuallyLoading = isLoadingContent || (!!activeBookId && bookBinary?.bookId !== activeBookId);

  const {
    saveProgressForBook,
    setMode,
    initializedBookIdRef,
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
    bookBinary,
    updateBook,
    settings,
    wordsPerPage,
    isLoadingContent: isActuallyLoading,
  });

  // --- 3. EFFECTS ---
  // Ensure we keep loading state if we expect an active book but library hasn't settled
  const [hasSettledBookId, setHasSettledBookId] = React.useState(false);
  React.useEffect(() => {
    if (isHydrated) {
      // Small debounce to ensure activeBookId is resolved from context/storage
      const timer = setTimeout(() => setHasSettledBookId(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isHydrated]);

  React.useEffect(() => {
    if (!isHydrated) return;
    
    setIsInitializing(true);
    async function loadBinary() {
      if (!activeBookId) {
        setBookBinary(null);
        setIsLoadingContent(false);
        setIsInitializing(false);
        return;
      }
      setIsLoadingContent(true);
      try {
        const binary = await dbService.getBookBinary(activeBookId);
        setBookBinary(binary || null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Database error";
        toast.error("Failed to load book content", { description: message });
      } finally {
        setIsLoadingContent(false);
      }
    }
    loadBinary();
  }, [activeBookId, activeBook?.isInCloud, isHydrated]);

  React.useEffect(() => {
    if (isHydrated && !isLoadingContent) {
      if (!activeBook) {
        setIsInitializing(false);
      } else if (storeActiveBookId === activeBook.id && initializedBookIdRef.current === activeBook.id) {
        const timeout = setTimeout(() => setIsInitializing(false), 50);
        return () => clearTimeout(timeout);
      }
    }
  }, [isHydrated, isLoadingContent, storeActiveBookId, activeBook, initializedBookIdRef]);

  React.useEffect(() => {
    setActiveQuiz(null);
  }, [activeBookId, completedChapter]);

  // --- 4. DERIVED VALUES & HANDLERS ---
  const isStoreInitialized = activeBook && storeActiveBookId === activeBook.id && initializedBookIdRef.current === activeBook.id;

  const currentChapter = React.useMemo(() => {
    const safeIdx = Math.min(Math.max(0, activeChapterIndex), chaptersData.length - 1);
    const ch = chaptersData[safeIdx] || { title: "No book loaded", content: "" };
    const wordsArr = ch.content ? ch.content.split(/\s+/).filter((w: string) => w.trim() !== "") : [];
    return { ...ch, words: wordsArr, index: safeIdx };
  }, [chaptersData, activeChapterIndex]);

  const openQuickSettings = () => {
    setIsPlaying(false);
    setDrawerTab(mode);
    setIsDrawerOpen(true);
  };

  const readerFontClass = React.useMemo(() => {
    return getReaderFontClass(settings.general.readerFontFamily);
  }, [settings.general.readerFontFamily]);

  // --- 5. RENDER LOGIC ---
  
  // Wait for hydration and for the book ID to "settle" to prevent flashing the BookshelfSelector
  if (!isHydrated || !hasSettledBookId || isLoadingContent || isInitializing || (activeBook && !isStoreInitialized)) {
    return <LoadingSpinner message={activeBook?.isInCloud && !bookBinary ? "Downloading from cloud..." : "Loading reader session..."} className="h-full" />;
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
    <div className="h-dvh w-full overflow-hidden overscroll-none flex flex-col items-center justify-between relative transition-all duration-300 bg-[hsl(var(--reader-background))] text-[hsl(var(--reader-foreground))]">
      {/* Focus Mode Exit Button */}
      {isFocusMode && (
        <button
          onClick={() => setIsFocusMode(false)}
          className="fixed top-6 left-6 z-[60] flex items-center justify-center w-10 h-10 rounded-full border border-border/40 bg-card text-muted-foreground hover:text-primary transition-all shadow-lg hover:scale-110 liquid-glass"
          title="Exit focus mode"
        >
          <Eye className="w-5 h-5" />
        </button>
      )}

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-center justify-between relative w-full p-3 pt-2 pb-4 sm:p-6 sm:pt-4 sm:pb-8 overflow-hidden overscroll-none transition-all duration-300 h-dvh md:h-screen"
      >
        <motion.div variants={headerVariants} className="w-full">
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
            isPomodoroOpen={isPomodoroOpen}
            setIsPomodoroOpen={setIsPomodoroOpen}
            isAnnotationsOpen={isAnnotationsOpen}
            setIsAnnotationsOpen={setIsAnnotationsOpen}
          />
        </motion.div>

        <motion.div 
          variants={canvasVariants} 
          className={`w-full flex-1 flex flex-col items-center min-h-0 ${
            mode === "cluster" ? "justify-start md:justify-center" : "justify-center"
          }`}
        >
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
        </motion.div>

      </motion.main>

      <AnnotationsSidebar
        isOpen={isAnnotationsOpen}
        onClose={() => setIsAnnotationsOpen(false)}
        onGoToAnnotation={handleGoToAnnotation}
      />

      {mode !== "normal" && !activeQuiz && !completedChapter && (
        <ReaderPlayer
          onRewind={handleRewind}
          onSkip={handleSkip}
          allBookPages={allBookPages}
        />
      )}


      {/* Pomodoro Timer - Rendered constantly to keep timer running, toggled via CSS */}
      <div 
        className={`fixed z-50 w-[240px] xs:w-60 transition-all duration-300 ${
          isPomodoroOpen 
            ? "opacity-100 scale-100 pointer-events-auto" 
            : "opacity-0 scale-95 pointer-events-none"
        } top-20 right-4 md:top-auto md:right-auto md:bottom-6 md:left-6`}
      >
        <PomodoroTimer />
      </div>

      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        initialTab={drawerTab}
        isPomodoroOpen={isPomodoroOpen}
        setIsPomodoroOpen={setIsPomodoroOpen}
      />

      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        bookTitle={activeBook.title}
        stats={sessionStats}
        onNavigateToLibrary={() => router.push("/library")}
        onNavigateToDashboard={() => router.push("/dashboard")}
      />

      <TelemetryTrackerWrapper
        activeBookId={activeBookId}
        bookTitle={activeBook?.title || ""}
        allBookPages={allBookPages}
        settings={settings}
      />
    </div>
  );
}
