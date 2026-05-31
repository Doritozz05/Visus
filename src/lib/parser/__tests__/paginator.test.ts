import { describe, it, expect } from "vitest";
import { paginateChapter } from "../paginator";

describe("Paginator Unit Tests", () => {
  it("should paginate plain text with correct word counts and index mapping", () => {
    const text = "One two three four five six seven eight nine ten.";
    const pages = paginateChapter(text, 4);

    // Total words = 10, targetWordsPerPage = 4 -> should produce 3 pages: 4, 4, 2 words
    expect(pages).toHaveLength(3);

    expect(pages[0].startWordIndex).toBe(0);
    expect(pages[0].endWordIndex).toBe(4);
    expect(pages[0].content).toBe("One two three four");

    expect(pages[1].startWordIndex).toBe(4);
    expect(pages[1].endWordIndex).toBe(8);
    expect(pages[1].content).toBe("five six seven eight");

    expect(pages[2].startWordIndex).toBe(8);
    expect(pages[2].endWordIndex).toBe(10);
    expect(pages[2].content).toBe("nine ten.");
  });

  it("should preserve original paragraph formatting and multiple newlines", () => {
    const text = "Paragraph one.\n\nParagraph two.\n\nParagraph three.";
    const pages = paginateChapter(text, 6); // Total words = 6 (2 per paragraph)

    expect(pages).toHaveLength(1);
    expect(pages[0].content).toBe("Paragraph one.\n\nParagraph two.\n\nParagraph three.");
    
    // Test splitting with single newline
    const singleNewlineText = "Line one.\nLine two.\nLine three.";
    const pagesSingle = paginateChapter(singleNewlineText, 6);
    expect(pagesSingle[0].content).toBe("Line one.\nLine two.\nLine three.");
  });

  it("should elegantly handle clean column splits in double-column mode", () => {
    const text = "First sentence. Second sentence. Third sentence.";
    const pages = paginateChapter(text, 10);
    expect(pages).toHaveLength(1);
    const page = pages[0];
    
    // Columns should exist and not be empty
    expect(page.leftColumn.length).toBeGreaterThan(0);
    expect(page.rightColumn.length).toBeGreaterThan(0);
    
    // Combined columns (trimmed and combined) should match the full page content
    const reCombined = `${page.leftColumn} ${page.rightColumn}`;
    expect(reCombined.replace(/\s+/g, " ")).toBe(text.replace(/\s+/g, " "));
  });

  it("should return empty array for empty chapter content", () => {
    expect(paginateChapter("")).toEqual([]);
    expect(paginateChapter("   ")).toEqual([]);
  });
});
