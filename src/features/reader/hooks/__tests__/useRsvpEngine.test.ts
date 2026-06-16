import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useRsvpEngine } from "../useRsvpEngine";
import { useReadingStore } from "@/features/reader/stores/reading-store";
import { DEFAULT_SETTINGS } from "@/core/entities/settings";

describe("useRsvpEngine", () => {
  const mockChapter = {
    title: "Chapter 1",
    content: "One two three four five.",
    words: ["One", "two", "three", "four", "five."]
  };

  beforeEach(() => {
    vi.useFakeTimers();
    useReadingStore.setState({
      wordIndex: 0,
      isPlaying: false,
      totalChapters: 1,
      chapterWordCounts: [5],
      activeChapterIndex: 0
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should generate rsvp sequence", () => {
    const { result } = renderHook(() => useRsvpEngine({
      currentChapter: mockChapter as any,
      mode: "rsvp",
      wpm: 600,
      settings: {
        ...DEFAULT_SETTINGS,
        rsvp: { ...DEFAULT_SETTINGS.rsvp, warmupRamp: false }
      }
    }));

    expect(result.current.rsvpSequence).toHaveLength(5);
    expect(result.current.rsvpSequence[0].text).toBe("One");
  });

  it("should advance wordIndex during playback", async () => {
    useReadingStore.setState({ isPlaying: false, wordIndex: 0 });

    renderHook(() => useRsvpEngine({
      currentChapter: mockChapter as any,
      mode: "rsvp",
      wpm: 600, // 100ms per word base
      settings: {
        ...DEFAULT_SETTINGS,
        rsvp: { ...DEFAULT_SETTINGS.rsvp, warmupRamp: false }
      }
    }));

    act(() => {
      useReadingStore.setState({ isPlaying: true });
    });

    // Advance by 110ms
    act(() => {
      vi.advanceTimersByTime(110);
    });
    
    expect(useReadingStore.getState().wordIndex).toBeGreaterThanOrEqual(1);
    const firstTickIdx = useReadingStore.getState().wordIndex;

    act(() => {
      vi.advanceTimersByTime(110);
    });
    expect(useReadingStore.getState().wordIndex).toBeGreaterThan(firstTickIdx);
  });

  it("should stop at end of chapter", () => {
    useReadingStore.setState({ wordIndex: 4, isPlaying: true });

    renderHook(() => useRsvpEngine({
      currentChapter: mockChapter as any,
      mode: "rsvp",
      wpm: 600,
      settings: {
        ...DEFAULT_SETTINGS,
        rsvp: { ...DEFAULT_SETTINGS.rsvp, warmupRamp: false }
      }
    }));

    act(() => {
      // Last word "five." has 2.2 multiplier -> 220ms
      vi.advanceTimersByTime(250);
    });

    expect(useReadingStore.getState().isPlaying).toBe(false);
    expect(useReadingStore.getState().completedChapter).toBe("Chapter 1");
  });
});
