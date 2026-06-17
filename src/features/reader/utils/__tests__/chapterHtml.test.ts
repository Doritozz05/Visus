import { describe, it, expect } from "vitest";
import { prepareChapterHtml } from "../chapterHtml";

describe("prepareChapterHtml utility", () => {
  it("should convert raw plain text to HTML paragraph blocks with word indices", () => {
    const chapter = {
      title: "Chapter 1",
      content: "Hello world. This is test content.",
      index: 0,
    };

    const result = prepareChapterHtml(chapter);
    expect(result).toContain('class="mb-4 text-justify leading-relaxed"');
    expect(result).toContain("data-word-index");
    expect(result).toContain("Hello");
    expect(result).toContain("world.");
  });

  it("should use pre-existing htmlContent if provided", () => {
    const chapter = {
      title: "Chapter 2",
      content: "",
      htmlContent: "<p>Preexisting HTML</p>",
      index: 1,
    };

    const result = prepareChapterHtml(chapter);
    expect(result).toContain("<p");
    expect(result).toContain("Preexisting");
    expect(result).toContain("HTML");
  });

  it("should clean trailing empty elements safely", () => {
    const chapter = {
      title: "Chapter 3",
      content: "",
      htmlContent: "<p>Main body</p><p></p>",
      index: 2,
    };

    const result = prepareChapterHtml(chapter);
    expect(result).not.toContain("<p></p>");
    expect(result).toContain("Main");
    expect(result).toContain("body");
  });
});
