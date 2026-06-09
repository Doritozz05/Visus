import { describe, it, expect } from "vitest";
import { parseTxt } from "../txt";

describe("TXT Parser", () => {
  it("should parse text string into chapters", () => {
    const textContent = "This is a simple text content.";
    const result = parseTxt(textContent);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].title).toBe("Section 1");
    expect(result[0].content).toBe(textContent);
  });

  it("should handle empty text", () => {
    const result = parseTxt("");
    expect(result[0].content).toBe("Empty book content.");
  });

  it("should split large text into sections", () => {
    const largeText = new Array(2000).fill("word").join(" ");
    const result = parseTxt(largeText);
    expect(result.length).toBeGreaterThan(1);
    expect(result[0].title).toBe("Section 1");
    expect(result[1].title).toBe("Section 2");
  });
});
