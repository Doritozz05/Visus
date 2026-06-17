import { create } from "zustand";
import { BookVisualPage } from "@/lib/parser/paginator";
import { Annotation } from "@/core/entities/book";

interface ChapterItem {
  title: string;
  content: string;
}

export interface ReadingState {
  wordIndex: number;
  activeChapterIndex: number;
  activeBookId: string | null;
  isPlaying: boolean;
  wpm: number;
  mode: "rsvp" | "cluster" | "normal";
  completedChapter: string | null;
  progressPercentage: number;
  totalChapters: number;
  chapterWordCounts: number[];
  allBookPages: BookVisualPage[];
  annotations: Annotation[];
  isCompletionModalOpen: boolean;
  isFocusMode: boolean;
  sessionStats: {
    speedWpm: number;
    durationSeconds: number;
    accuracy: number | null;
    wordsCount: number;
  } | null;
  lastLocalSaveTimestamp: number;

  // Actions
  setWordIndex: (wordIndex: number) => void;
  setActiveChapterIndex: (activeChapterIndex: number) => void;
  setActiveBookId: (activeBookId: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setWpm: (wpm: number) => void;
  setMode: (mode: "rsvp" | "cluster" | "normal") => void;
  setCompletedChapter: (completedChapter: string | null) => void;
  setAllBookPages: (pages: BookVisualPage[]) => void;
  setAnnotations: (annotations: Annotation[]) => void;
  setIsCompletionModalOpen: (isOpen: boolean) => void;
  setIsFocusMode: (isFocus: boolean) => void;
  setSessionStats: (stats: { speedWpm: number; durationSeconds: number; accuracy: number | null; wordsCount: number; } | null) => void;
  setLastLocalSaveTimestamp: (timestamp: number) => void;
  initBook: (
    bookId: string,
    chapterIndex: number,
    wordIndex: number,
    wpm: number,
    mode: "rsvp" | "cluster" | "normal",
    chapters: ChapterItem[]
  ) => void;
}

function calculateProgressPercentage(
  totalChapters: number,
  chapterWordCounts: number[],
  activeChapterIndex: number,
  wordIndex: number
): number {
  if (totalChapters === 0) return 0;
  const safeIdx = Math.min(Math.max(0, activeChapterIndex), totalChapters - 1);
  const currentChapterWordsCount = chapterWordCounts && chapterWordCounts.length > 0 ? chapterWordCounts[safeIdx] : 1;

  const progressInChapter = wordIndex / currentChapterWordsCount;
  let currentProgress = Math.min(
    100,
    Math.round(((activeChapterIndex + progressInChapter) / totalChapters) * 100)
  );

  const isLastChapter = activeChapterIndex === totalChapters - 1;
  const isAtLastWords = wordIndex >= currentChapterWordsCount - 5;

  if (isLastChapter && isAtLastWords) {
    currentProgress = 100;
  }

  return currentProgress;
}

export const useReadingStore = create<ReadingState>((set) => ({
  wordIndex: 0,
  activeChapterIndex: 0,
  activeBookId: null,
  isPlaying: false,
  wpm: 250,
  mode: "normal",
  completedChapter: null,
  progressPercentage: 0,
  totalChapters: 0,
  chapterWordCounts: [],
  allBookPages: [],
  annotations: [],
  isCompletionModalOpen: false,
  isFocusMode: false,
  sessionStats: null,
  lastLocalSaveTimestamp: 0,

  setWordIndex: (wordIndex) =>
    set((state) => {
      const progressPercentage = calculateProgressPercentage(
        state.totalChapters,
        state.chapterWordCounts,
        state.activeChapterIndex,
        wordIndex
      );
      return { wordIndex, progressPercentage };
    }),

  setActiveChapterIndex: (activeChapterIndex) =>
    set((state) => {
      const progressPercentage = calculateProgressPercentage(
        state.totalChapters,
        state.chapterWordCounts,
        activeChapterIndex,
        state.wordIndex
      );
      return { activeChapterIndex, progressPercentage };
    }),

  setActiveBookId: (activeBookId) => set({ activeBookId }),
  setIsPlaying: (isPlaying) => set((state) => state.isPlaying === isPlaying ? state : { isPlaying }),
  setWpm: (wpm) => set({ wpm }),
  setMode: (mode) => set({ mode }),
  setCompletedChapter: (completedChapter) => set({ completedChapter }),
  setAllBookPages: (allBookPages) => set({ allBookPages }),
  setAnnotations: (annotations) => set({ annotations }),
  setIsCompletionModalOpen: (isCompletionModalOpen) => set({ isCompletionModalOpen }),
  setIsFocusMode: (isFocusMode) => set({ isFocusMode }),
  setSessionStats: (sessionStats) => set({ sessionStats }),
  setLastLocalSaveTimestamp: (lastLocalSaveTimestamp) => set({ lastLocalSaveTimestamp }),

  initBook: (bookId, chapterIndex, wordIndex, wpm, mode, chapters) =>
    set(() => {
      const chapterWordCounts = chapters.map((ch) =>
        ch?.content ? ch.content.split(/\s+/).filter((w) => w.trim() !== "").length || 1 : 1
      );
      const totalChapters = chapters.length;
      const progressPercentage = calculateProgressPercentage(
        totalChapters,
        chapterWordCounts,
        chapterIndex,
        wordIndex
      );
      return {
        activeBookId: bookId,
        activeChapterIndex: chapterIndex,
        wordIndex: wordIndex,
        wpm: wpm,
        mode: mode,
        isPlaying: false,
        completedChapter: null,
        progressPercentage,
        totalChapters,
        chapterWordCounts,
        allBookPages: [],
        annotations: [],
        isCompletionModalOpen: false,
        isFocusMode: false,
        sessionStats: null,
        lastLocalSaveTimestamp: 0,
      };
    }),
}));
