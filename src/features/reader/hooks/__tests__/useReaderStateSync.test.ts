import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReaderStateSync } from "../useReaderStateSync";
import { useReadingStore } from "../../stores/reading-store";

// Mock the store
vi.mock("../../stores/reading-store", () => ({
  useReadingStore: {
    getState: vi.fn(),
  },
}));

describe("useReaderStateSync", () => {
  const mockUpdateBook = vi.fn();
  const mockChaptersData = [{ index: 0, title: "Chapter 1" }];
  const mockActiveBookRef = { current: null } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it("should ignore remote updates if a local save occurred within the last 3 seconds", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const mockState = {
      lastLocalSaveTimestamp: now - 1000, // 1 second ago
      activeChapterIndex: 0,
      wordIndex: 10,
      initBook: vi.fn(),
      setActiveChapterIndex: vi.fn(),
      setWordIndex: vi.fn(),
    };
    (useReadingStore.getState as any).mockReturnValue(mockState);

    const activeBook = {
      id: "book-1",
      lastChapterIndex: 0,
      lastWordIndex: 50,
    } as any;

    const { rerender } = renderHook(
      ({ activeBook }) => useReaderStateSync({
        activeBook,
        activeBookRef: mockActiveBookRef,
        activeBookId: "book-1",
        chaptersData: mockChaptersData,
        updateBook: mockUpdateBook,
      }),
      { initialProps: { activeBook } }
    );

    // Initial render does initialization. 
    // We need another render with same ID but different progress to hit the reactive sync branch.
    const updatedBook = { ...activeBook, lastWordIndex: 100 };
    rerender({ activeBook: updatedBook });

    expect(mockState.setActiveChapterIndex).not.toHaveBeenCalled();
    expect(mockState.setWordIndex).not.toHaveBeenCalled();
  });

  it("should apply remote updates if the last local save occurred more than 3 seconds ago", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const mockState = {
      lastLocalSaveTimestamp: now - 5000, // 5 seconds ago
      activeChapterIndex: 0,
      wordIndex: 10,
      initBook: vi.fn(),
      setActiveChapterIndex: vi.fn(),
      setWordIndex: vi.fn(),
    };
    (useReadingStore.getState as any).mockReturnValue(mockState);

    const activeBook = {
      id: "book-1",
      lastChapterIndex: 0,
      lastWordIndex: 50,
    } as any;

    const { rerender } = renderHook(
      ({ activeBook }) => useReaderStateSync({
        activeBook,
        activeBookRef: mockActiveBookRef,
        activeBookId: "book-1",
        chaptersData: mockChaptersData,
        updateBook: mockUpdateBook,
      }),
      { initialProps: { activeBook } }
    );

    const updatedBook = { ...activeBook, lastWordIndex: 100 };
    rerender({ activeBook: updatedBook });

    expect(mockState.setWordIndex).toHaveBeenCalledWith(100);
  });
});
