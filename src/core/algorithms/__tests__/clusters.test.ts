import { describe, it, expect } from "vitest";
import { generateFixedChunks, generateSemanticChunks, generateDynamicClusters } from "../clusters";

describe("Clusters Algorithm", () => {
  describe("generateFixedChunks", () => {
    it("should return empty array for empty inputs", () => {
      expect(generateFixedChunks([], 3)).toEqual([]);
    });

    it("should group words in chunks of fixed size", () => {
      const words = ["one", "two", "three", "four", "five"];
      const chunks = generateFixedChunks(words, 2);

      expect(chunks).toEqual([
        ["one", "two"],
        ["three", "four"],
        ["five"],
      ]);
    });

    it("should fallback gracefully if chunkSize is less than 1", () => {
      const words = ["one", "two"];
      expect(generateFixedChunks(words, 0)).toEqual([["one"], ["two"]]);
      expect(generateFixedChunks(words, -1)).toEqual([["one"], ["two"]]);
    });
  });

  describe("generateSemanticChunks", () => {
    it("should return empty array for empty input", () => {
      expect(generateSemanticChunks("", 3)).toEqual([]);
    });

    it("should group short clauses together if they are near target size plus one", () => {
      const paragraph = "Hello world, how are you?";
      // targetChunkSize = 3
      // Clauses split by: "Hello world," and "how are you?"
      // "Hello world," has 2 words (<= 3 + 1) -> joined as "Hello world,"
      // "how are you?" has 3 words (<= 3 + 1) -> joined as "how are you?"
      const chunks = generateSemanticChunks(paragraph, 3);
      expect(chunks).toEqual(["Hello world,", "how are you?"]);
    });

    it("should split long clauses evenly by targetChunkSize", () => {
      // One single long sentence without punctuation: 6 words
      const paragraph = "This is a very long sentence";
      // targetChunkSize = 2. words.length (6) > 2 + 1 (3).
      // So it loops and slices by 2 words:
      // "This is", "a very", "long sentence"
      const chunks = generateSemanticChunks(paragraph, 2);
      expect(chunks).toEqual(["This is", "a very", "long sentence"]);
    });

    it("should ignore extra spaces and empty clauses", () => {
      const paragraph = "Hello world!    ";
      const chunks = generateSemanticChunks(paragraph, 3);
      expect(chunks).toEqual(["Hello world!"]);
    });
  });

  describe("generateDynamicClusters", () => {
    it("should return empty array for empty input", () => {
      expect(generateDynamicClusters("")).toEqual([]);
    });

    it("should group words and respect the target chunk size limit", () => {
      const paragraph = "one two three four five six";
      const clusters = generateDynamicClusters(paragraph, 3);
      
      expect(clusters[0].text).toBe("one two three");
      expect(clusters[0].wordCount).toBe(3);
      expect(clusters[1].text).toBe("four five six");
      expect(clusters[1].wordCount).toBe(3);
    });

    it("should cut immediately on punctuation to preserve semantic flow", () => {
      const paragraph = "Hello world, how are you? Life is good.";
      const clusters = generateDynamicClusters(paragraph, 3);
      
      // "Hello world," ends with comma -> should close immediately
      expect(clusters[0].text).toBe("Hello world,");
      
      // "how are you?" ends with question mark -> should close immediately
      expect(clusters[1].text).toBe("how are you?");
      
      // "Life is good." ends with period -> should close immediately
      expect(clusters[2].text).toBe("Life is good.");
    });

    it("should compute delay multipliers correctly based on punctuation and complexity", () => {
      const p1 = "Simple short.";
      const p2 = "Very long complex word electromagnetism here.";
      const p3 = "Just a comma, here.";
      
      const c1 = generateDynamicClusters(p1, 3);
      const c2 = generateDynamicClusters(p2, 3);
      const c3 = generateDynamicClusters(p3, 3);

      // Ends with period -> should have 1.6 delay multiplier
      expect(c1[0].delayMultiplier).toBeCloseTo(1.6);
      
      // Second chunk contains only "word electromagnetism" because "here." exceeds character limits
      expect(c2[1].text).toBe("word electromagnetism");
      expect(c2[1].delayMultiplier).toBeCloseTo(1.2);

      // Third chunk contains "here."
      expect(c2[2].text).toBe("here.");
      expect(c2[2].delayMultiplier).toBeCloseTo(1.6);

      // Ends with comma -> should have 1.3 delay multiplier
      expect(c3[0].delayMultiplier).toBeCloseTo(1.3);
    });
  });
});

