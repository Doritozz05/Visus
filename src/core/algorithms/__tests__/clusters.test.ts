import { describe, it, expect } from "vitest";
import { generateFixedChunks, generateSemanticChunks } from "../clusters";

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
});
