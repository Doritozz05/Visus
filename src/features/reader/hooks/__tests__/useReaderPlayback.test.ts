import { describe, it, expect, vi, beforeEach } from "vitest";
import * as React from "react";

// Mock Zustand reading-store BEFORE importing the hook
vi.mock("@/features/reader/stores/reading-store", () => {
  const mockState = {
    wordIndex: 0,
    activeChapterIndex: 0,
    activeBookId: "book-abc",
    isPlaying: false,
    wpm: 600,
    mode: "normal",
    completedChapter: null,
    progressPercentage: 0,
    chapters: [],
    setWordIndex: vi.fn(),
    setActiveChapterIndex: vi.fn(),
    setActiveBookId: vi.fn(),
    setIsPlaying: vi.fn(),
    setWpm: vi.fn(),
    setMode: vi.fn(),
    setCompletedChapter: vi.fn(),
    initBook: vi.fn(),
  };

  return {
    useReadingStore: Object.assign(
      vi.fn((selector) => selector(mockState)),
      {
        getState: vi.fn(() => mockState),
        subscribe: vi.fn(() => vi.fn()),
      }
    ),
  };
});

// Mock React hooks to run hook logic in pure Node environment
vi.mock("react", () => {
  return {
    useState: vi.fn((init) => [typeof init === "function" ? init() : init, vi.fn()]),
    useRef: vi.fn((init) => ({ current: init })),
    useMemo: vi.fn((cb) => cb()),
    useCallback: vi.fn((cb) => cb),
    useEffect: vi.fn(),
  };
});

import { useReaderPlayback } from "../useReaderPlayback";

describe("useReaderPlayback hook", () => {
  let mockUpdateBook: any;
  let mockActiveBook: any;
  let mockSettings: any;

  beforeEach(() => {
    mockUpdateBook = vi.fn();
    mockActiveBook = {
      id: "book-abc",
      title: "Sample Book Title",
      content: "Paragraph one text content.\n\nParagraph two text content.",
      chapters: [],
      progress: 0,
    };
    mockSettings = {
      general: {
        readerFontSize: 16,
        readerWordsPerPage: 300,
        readerFontFamily: "serif",
      },
      rsvp: {
        fontSize: 40,
        fontFamily: "inter",
      },
      cluster: {
        fontSize: 24,
        fontFamily: "inter",
      },
    };
  });

  it("should initialize default state correctly and return structured engine components", () => {
    const result = useReaderPlayback({
      activeBook: mockActiveBook,
      updateBook: mockUpdateBook,
      settings: mockSettings,
      wordsPerPage: 300,
    });

    // Check initialized properties exist
    expect(result).toHaveProperty("wordIndex");
    expect(result).toHaveProperty("activeChapterIndex");
    expect(result).toHaveProperty("isPlaying");
    expect(result).toHaveProperty("mode");
    expect(result).toHaveProperty("rsvpSequence");
    expect(result).toHaveProperty("clusterChunks");
    expect(result).toHaveProperty("progressPercentage");
    
    // Check initial values
    expect(result.isPlaying).toBe(false);
    expect(result.mode).toBe("normal");
  });
});
