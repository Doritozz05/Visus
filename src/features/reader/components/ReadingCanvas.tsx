"use client";

import * as React from "react";
import { RsvpVisualBox } from "@/features/reader/modes/rsvp/RsvpVisualBox";
import { ClusterVisualBox } from "@/features/reader/modes/cluster/ClusterVisualBox";
import { PagesVisualBox } from "@/features/reader/components/PagesVisualBox";
import { ComprehensionQuiz } from "@/features/reader/components/ComprehensionQuiz";
import { ChapterCompletionCard } from "./ChapterCompletionCard";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Quiz } from "@/core/algorithms/quiz-generator";
import { Book } from "@/core/entities/book";
import { SettingsState } from "@/core/entities/settings";
import { useReadingStore } from "@/features/reader/stores/reading-store";
import { DynamicCluster } from "@/core/algorithms/clusters";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingCanvasProps {
  mode: "normal" | "rsvp" | "cluster";
  completedChapter: string | null;
  activeQuiz: Quiz | null;
  setActiveQuiz: (quiz: Quiz | null) => void;
  setCompletedChapter: (chapter: string | null) => void;
  setMode: (mode: "normal" | "rsvp" | "cluster") => void;
  activeBook: Book;
  currentChapter: {
    title: string;
    content: string;
    words: string[];
    index: number;
  };
  chaptersData: any[];
  activeChapterIndex: number;
  wordsPerPage: number;
  readerFontClass: string;
  settings: SettingsState;
  rsvpSequence: any[];
  clusterChunks: DynamicCluster[] | string[];
  handleNextChapter: () => void;
  handlePrevChapter: () => void;
  handleChapterChange: (idx: number) => void;
  saveProgressForBook: (bookId: string, chIdx: number, wIdx: number, localPageIdx?: number) => void;
  handleAddBookmark: (name: string, chapterIndex: number, wordIndex: number) => void;
  handleRemoveBookmark: (id: string) => void;
  handleUpdateBookmarkName: (id: string, name: string) => void;
}

export function ReadingCanvas({
  mode,
  completedChapter,
  activeQuiz,
  setActiveQuiz,
  setCompletedChapter,
  setMode,
  activeBook,
  currentChapter,
  chaptersData,
  activeChapterIndex,
  wordsPerPage,
  readerFontClass,
  settings,
  rsvpSequence,
  clusterChunks,
  handleNextChapter,
  handlePrevChapter,
  handleChapterChange,
  saveProgressForBook,
  handleAddBookmark,
  handleRemoveBookmark,
  handleUpdateBookmarkName,
}: ReadingCanvasProps) {
  return (
    <div
      className={`w-full ${
        mode === "cluster"
          ? "max-w-3xl"
          : mode === "normal"
            ? "max-w-5xl"
            : "max-w-2xl"
      } px-6 md:px-0 flex-1 flex flex-col items-center ${
        mode === "cluster" 
          ? "justify-start pt-4 sm:pt-8 md:justify-center md:pt-0" 
          : "justify-center"
      } relative z-10 transition-all duration-500 ease-in-out min-h-0`}
    >
      <AnimatePresence mode="wait">
        {completedChapter && mode !== "normal" ? (
          activeQuiz ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full flex items-center justify-center"
            >
              <ComprehensionQuiz
                quiz={activeQuiz}
                onComplete={(accuracy) => {
                  const chapterWords = currentChapter.words.length || 1;
                  const speedWpm = useReadingStore.getState().wpm || 600;
                  const FALLBACK_DURATION_SECONDS = 10;
                  const durationSeconds =
                    Math.round(chapterWords / (speedWpm / 60)) || FALLBACK_DURATION_SECONDS;

                  import("@/core/services/stats-service").then(({ StatsService }) => {
                    StatsService.recordSession({
                      bookId: activeBook.id,
                      bookTitle: `${activeBook.title} - ${completedChapter}`,
                      mode: mode,
                      speedWpm: speedWpm,
                      durationSeconds: durationSeconds,
                      accuracy: accuracy,
                    });
                  });

                  // Adaptive RSVP Calibration
                  if (accuracy === 100) {
                    toast.success(`🎯 Excellent retention! Score: 100%. We suggest increasing your speed by +25 WPM.`, {
                      action: {
                        label: "Increase",
                        onClick: () => useReadingStore.getState().setWpm(speedWpm + 25),
                      },
                      duration: 8000,
                    });
                  } else if (accuracy < 70) {
                    toast.info(`📖 Let's find your comfort zone. Retention was ${accuracy}%. We suggest trying a slightly lower speed for this chapter.`, {
                      action: {
                        label: "Adjust Speed",
                        onClick: () => useReadingStore.getState().setWpm(Math.max(100, speedWpm - 50)),
                      },
                      duration: 8000,
                    });
                  }
                }}
                onClose={() => {
                  setActiveQuiz(null);
                  setCompletedChapter(null);
                  // Reset to start of chapter
                  useReadingStore.getState().setWordIndex(0);
                }}
                onNextChapter={() => {
                  setActiveQuiz(null);
                  setCompletedChapter(null);
                  handleNextChapter();
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="completion"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full flex items-center justify-center"
            >
              <ChapterCompletionCard
                completedChapter={completedChapter}
                onTakeQuiz={(generated) => setActiveQuiz(generated)}
                onBackToReader={() => {
                  setCompletedChapter(null);
                  // Reset to start of chapter
                  useReadingStore.getState().setWordIndex(0);
                }}
                onSkipQuiz={() => {
                  setCompletedChapter(null);
                  handleNextChapter();
                }}
              />
            </motion.div>
          )
        ) : mode === "normal" ? (
          <motion.div
            key="normal"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col items-center justify-center"
          >
            <ErrorBoundary>
              <PagesVisualBox
                key={activeBook.id}
                activeBookId={activeBook.id}
                currentChapter={currentChapter}
                chaptersData={chaptersData}
                savedLocalPageIndex={
                  activeBook.lastChapterIndex === activeChapterIndex
                    ? activeBook.lastLocalPageIndex
                    : undefined
                }
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
            </ErrorBoundary>
          </motion.div>
        ) : mode === "rsvp" ? (
          <motion.div
            key="rsvp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full flex items-center justify-center mb-[15vh] md:mb-[20vh]"
          >
            <RsvpVisualBox rsvpSequence={rsvpSequence} settings={settings.rsvp} />
          </motion.div>
        ) : (
          <motion.div
            key="cluster"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full flex items-center justify-center md:mb-[20vh] mt-4 md:mt-0"
          >
            <ClusterVisualBox clusterChunks={clusterChunks} settings={settings.cluster} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

