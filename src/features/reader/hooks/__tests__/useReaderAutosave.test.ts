import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from "vitest";
import * as React from "react";

// Mock Zustand reading-store BEFORE importing the hook
vi.mock("@/features/reader/stores/reading-store", () => {
  return {
    useReadingStore: Object.assign(
      vi.fn((selector) => selector({ isPlaying: false, activeBookId: "book-123", activeChapterIndex: 1, wordIndex: 10 })),
      {
        getState: vi.fn(() => ({
          isPlaying: false,
          activeBookId: "book-123",
          activeChapterIndex: 1,
          wordIndex: 10,
        })),
      }
    ),
  };
});

// Mock React hooks to run hook logic in pure Node environment
vi.mock("react", () => {
  return {
    useEffect: vi.fn((cb) => cb()),
    useRef: vi.fn((initialVal) => ({ current: initialVal })),
  };
});

import { useReaderAutosave } from "../useReaderAutosave";

describe("useReaderAutosave hook", () => {
  let mockSaveProgress: any;
  let mockActiveBook: any;
  
  beforeAll(() => {
    vi.stubGlobal("window", {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    mockSaveProgress = vi.fn();
    mockActiveBook = { id: "book-123", title: "Test Book" };
    vi.clearAllMocks();
  });

  it("should register beforeunload event listener on mount", () => {
    const mockAddListener = vi.spyOn(window, "addEventListener");

    useReaderAutosave({
      activeBook: mockActiveBook,
      saveProgressForBook: mockSaveProgress,
    });

    expect(mockAddListener).toHaveBeenCalledWith("beforeunload", expect.any(Function));
    mockAddListener.mockRestore();
  });
});
