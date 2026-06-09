import { describe, it, expect, vi, beforeEach } from "vitest";
import { paginateChapter } from "../paginationCore";

describe("paginationCore", () => {
  let hiddenEl: HTMLDivElement;

  beforeEach(() => {
    hiddenEl = document.createElement("div");
    // Mock scrollWidth and other DOM properties
    Object.defineProperty(hiddenEl, 'scrollWidth', { value: 1000, configurable: true });
    
    // Mock getAttribute and querySelectorAll
    hiddenEl.querySelectorAll = vi.fn().mockReturnValue([]);
  });

  it("should return empty array if hiddenEl is missing", async () => {
    const result = await paginateChapter({
      chIdx: 0,
      chapter: { title: "Ch 1", content: "Content" } as any,
      width: 500,
      columnGap: 20,
      hiddenEl: null as any,
      checkActive: () => true,
    });
    expect(result).toEqual([]);
  });

  it("should calculate correct number of pages", async () => {
    // scrollWidth = 1000, width = 480, gap = 20
    // (1000 + 20) / (480 + 20) = 1020 / 500 = 2.04 -> 3 pages
    Object.defineProperty(hiddenEl, 'scrollWidth', { value: 1000, configurable: true });
    
    const result = await paginateChapter({
      chIdx: 0,
      chapter: { title: "Ch 1", content: "Some content here" } as any,
      width: 480,
      columnGap: 20,
      hiddenEl,
      checkActive: () => true,
    });

    expect(result).toHaveLength(3);
  });

  it("should interpolate startWordIndex for duplicate page starts", async () => {
    Object.defineProperty(hiddenEl, 'scrollWidth', { value: 1000, configurable: true });
    // All blocks at same offset
    hiddenEl.querySelectorAll = vi.fn().mockReturnValue([
      { getAttribute: (attr: string) => attr === "data-start-word-idx" ? "0" : "10", offsetLeft: 0 },
    ]);

    const result = await paginateChapter({
      chIdx: 0,
      chapter: { title: "Ch 1", content: "Word1 Word2 Word3 Word4 Word5 Word6 Word7 Word8 Word9 Word10" } as any,
      width: 480,
      columnGap: 20,
      hiddenEl,
      checkActive: () => true,
    });

    expect(result).toHaveLength(3);
    // Should have interpolated values rather than all 0
    expect(result[1].startWordIndex).toBeGreaterThan(0);
    expect(result[2].startWordIndex).toBeGreaterThan(result[1].startWordIndex);
  });
});
