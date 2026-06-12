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
  handleAddBookmark: (name: string, wordIdx: number, chIdx: number) => void;
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
          ? "max-w-4xl"
          : mode === "normal"
            ? "max-w-5xl"
            : "max-w-2xl"
      } px-6 md:px-0 flex-1 flex flex-col items-center justify-center relative z-10 transition-opacity duration-300`}
    >
      {completedChapter && mode !== "normal" ? (
        activeQuiz ? (
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
          <ChapterCompletionCard
            completedChapter={completedChapter}
            onTakeQuiz={(generated) => setActiveQuiz(generated)}
            onBackToReader={() => {
              setCompletedChapter(null);
              setMode("normal");
            }}
            onSkipQuiz={() => {
              setCompletedChapter(null);
              handleNextChapter();
            }}
          />
        )
      ) : mode === "normal" ? (
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
      ) : mode === "rsvp" ? (
        <RsvpVisualBox rsvpSequence={rsvpSequence} settings={settings.rsvp} />
      ) : (
        <ClusterVisualBox clusterChunks={clusterChunks} settings={settings.cluster} />
      )}
    </div>
  );
}
