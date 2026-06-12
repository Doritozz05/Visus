import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from "vitest";
import * as React from "react";
import { DEFAULT_SETTINGS } from "@/core/entities/settings";

// Mock StatsService
vi.mock("@/core/services/stats-service", () => {
  return {
    StatsService: {
      recordSession: vi.fn().mockResolvedValue({}),
    },
  };
});

// Mock React hooks to run hook logic in pure Node environment
vi.mock("react", () => {
  return {
    useEffect: vi.fn((cb) => cb()),
    useRef: vi.fn((initialVal) => ({ current: initialVal })),
    useCallback: vi.fn((fn) => fn),
  };
});

import { useTelemetryTracker } from "../useTelemetryTracker";

describe("useTelemetryTracker hook", () => {
  beforeAll(() => {
    vi.stubGlobal("window", {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      innerWidth: 1024,
    });
    vi.stubGlobal("document", {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      visibilityState: "visible",
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should register visibilitychange and window interactions on mount", () => {
    const mockAddDocListener = vi.spyOn(document, "addEventListener");
    const mockAddWinListener = vi.spyOn(window, "addEventListener");

    useTelemetryTracker({
      activeBookId: "book-123",
      bookTitle: "Test Book",
      mode: "normal",
      isPlaying: false,
      wordIndex: 100,
      activeChapterIndex: 1,
      allBookPages: [],
      theme: "light",
      settings: DEFAULT_SETTINGS,
      wpm: 600,
    });

    expect(mockAddDocListener).toHaveBeenCalledWith("visibilitychange", expect.any(Function));
    expect(mockAddWinListener).toHaveBeenCalledWith("scroll", expect.any(Function), expect.any(Object));
    expect(mockAddWinListener).toHaveBeenCalledWith("mousemove", expect.any(Function), expect.any(Object));
  });
});
