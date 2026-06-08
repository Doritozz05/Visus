import { create } from "zustand";

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
  chapters: ChapterItem[];
  chapterWordCounts: number[];

  // Actions
  setWordIndex: (wordIndex: number) => void;
  setActiveChapterIndex: (activeChapterIndex: number) => void;
  setActiveBookId: (activeBookId: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setWpm: (wpm: number) => void;
  setMode: (mode: "rsvp" | "cluster" | "normal") => void;
  setCompletedChapter: (completedChapter: string | null) => void;
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
  chapters: ChapterItem[],
  chapterWordCounts: number[],
  activeChapterIndex: number,
  wordIndex: number
): number {
  if (!chapters || chapters.length === 0) return 0;
  const safeIdx = Math.min(Math.max(0, activeChapterIndex), chapters.length - 1);
  const currentChapterWordsCount = chapterWordCounts && chapterWordCounts.length > 0 ? chapterWordCounts[safeIdx] : 1;

  const progressInChapter = wordIndex / currentChapterWordsCount;
  let currentProgress = Math.min(
    100,
    Math.round(((activeChapterIndex + progressInChapter) / chapters.length) * 100)
  );

  const isLastChapter = activeChapterIndex === chapters.length - 1;
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
  wpm: 600,
  mode: "normal",
  completedChapter: null,
  progressPercentage: 0,
  chapters: [],
  chapterWordCounts: [],

  setWordIndex: (wordIndex) =>
    set((state) => {
      const progressPercentage = calculateProgressPercentage(
        state.chapters,
        state.chapterWordCounts,
        state.activeChapterIndex,
        wordIndex
      );
      return { wordIndex, progressPercentage };
    }),

  setActiveChapterIndex: (activeChapterIndex) =>
    set((state) => {
      const progressPercentage = calculateProgressPercentage(
        state.chapters,
        state.chapterWordCounts,
        activeChapterIndex,
        state.wordIndex
      );
      return { activeChapterIndex, progressPercentage };
    }),

  setActiveBookId: (activeBookId) => set({ activeBookId }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setWpm: (wpm) => set({ wpm }),
  setMode: (mode) => set({ mode }),
  setCompletedChapter: (completedChapter) => set({ completedChapter }),

  initBook: (bookId, chapterIndex, wordIndex, wpm, mode, chapters) =>
    set(() => {
      const chapterWordCounts = chapters.map((ch) =>
        ch?.content ? ch.content.split(/\s+/).filter((w) => w.trim() !== "").length || 1 : 1
      );
      const progressPercentage = calculateProgressPercentage(
        chapters,
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
        chapters,
        chapterWordCounts,
      };
    }),
}));
