import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from "vitest";
import * as React from "react";
import { useReaderAutosave } from "../useReaderAutosave";

// Mock React hooks to run hook logic in pure Node environment
vi.mock("react", () => {
  return {
    useEffect: vi.fn((cb) => cb()), // Immediately execute effects to test registration
    useRef: vi.fn((initialVal) => ({ current: initialVal })),
  };
});

describe("useReaderAutosave hook", () => {
  let mockSaveProgress: any;
  let mockSetWordIndex: any;
  let mockActiveBook: any;
  
  beforeAll(() => {
    // Stub global window with add/removeEventListener
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
    mockSetWordIndex = vi.fn();
    mockActiveBook = { id: "book-123", title: "Test Book" };
    vi.clearAllMocks();
  });

  it("should register beforeunload event listener on mount", () => {
    const mockAddListener = vi.spyOn(window, "addEventListener");

    const currentWordIndexRef = { current: 10 };
    const latestPositionRef = { current: { wordIndex: 10, activeChapterIndex: 1 } };
    const initializedBookIdRef = { current: "book-123" };

    useReaderAutosave({
      activeBook: mockActiveBook,
      isPlaying: false,
      currentWordIndexRef,
      latestPositionRef,
      initializedBookIdRef,
      saveProgressForBook: mockSaveProgress,
      setWordIndex: mockSetWordIndex,
    });

    expect(mockAddListener).toHaveBeenCalledWith("beforeunload", expect.any(Function));
    mockAddListener.mockRestore();
  });
});
