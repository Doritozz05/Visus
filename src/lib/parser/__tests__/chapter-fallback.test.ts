import { describe, it, expect } from "vitest";
import { buildChaptersData } from "../chapter-fallback";

describe("Chapter Fallback Utility", () => {
  it("should return empty array if no bookId", () => {
    const result = buildChaptersData(null, undefined, undefined);
    expect(result).toEqual([]);
  });

  it("should return existing chapters if provided with index", () => {
    const mockChapters = [{ title: "Ch1", content: "c1" }];
    const result = buildChaptersData("1", mockChapters, undefined);
    expect(result).toEqual([{ title: "Ch1", content: "c1", index: 0 }]);
  });

  it("should fallback to splitting content into chunks if no chapters", () => {
    const content = "Paragraph 1\n\nParagraph 2";
    const result = buildChaptersData("1", undefined, content);
    
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].title).toBe("Section 1");
    expect(result[0].content).toContain("Paragraph 1");
  });

  it("should fallback to single placeholder if no chapters and no content", () => {
    const result = buildChaptersData("1", undefined, undefined);
    
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Section 1");
    expect(result[0].content).toBe("Empty book content.");
  });
});
