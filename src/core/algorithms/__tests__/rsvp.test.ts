import { describe, it, expect } from "vitest";
import { calculateORP, calculatePunctuationDelay, generateRSVPSequence } from "../rsvp";

describe("RSVP Algorithm", () => {
  describe("calculateORP", () => {
    it("should return index 0 for short words (length <= 1)", () => {
      expect(calculateORP("")).toBe(0);
      expect(calculateORP("a")).toBe(0);
      expect(calculateORP("a!")).toBe(0); // Punctuation removed, length of 'a' is 1
    });

    it("should return index 1 for words with 2 to 5 letters", () => {
      expect(calculateORP("to")).toBe(1);
      expect(calculateORP("read")).toBe(1);
      expect(calculateORP("speed")).toBe(1);
      expect(calculateORP("speed,")).toBe(1); // comma is ignored
    });

    it("should return index 2 for words with 6 to 9 letters", () => {
      expect(calculateORP("visual")).toBe(2);
      expect(calculateORP("reading")).toBe(2);
      expect(calculateORP("training")).toBe(2);
    });

    it("should return index 3 for words with 10 to 13 letters", () => {
      expect(calculateORP("everything")).toBe(3); // 10 chars
      expect(calculateORP("compositions")).toBe(3); // 12 chars
    });

    it("should return index 4 for extremely long words (> 13 letters)", () => {
      expect(calculateORP("characterization")).toBe(4); // 16 chars
      expect(calculateORP("electrocardiogram")).toBe(4); // 17 chars
    });
  });

  describe("calculatePunctuationDelay", () => {
    it("should return 2.2 multiplier for end of sentence (. ! ?)", () => {
      expect(calculatePunctuationDelay("hello.")).toBe(2.2);
      expect(calculatePunctuationDelay("what?")).toBe(2.2); // matches [.!?] first
      expect(calculatePunctuationDelay("wow!")).toBe(2.2); // matches [.!?] first
    });

    it("should return 1.5 multiplier for medium pauses (, ; : —)", () => {
      expect(calculatePunctuationDelay("however,")).toBe(1.5);
      expect(calculatePunctuationDelay("first;")).toBe(1.5);
      expect(calculatePunctuationDelay("list:")).toBe(1.5);
      expect(calculatePunctuationDelay("word—")).toBe(1.5);
    });

    it("should return 1.8 multiplier for quotes or quotes/brackets (excluding ? ! which are matched first by end of sentence rule)", () => {
      expect(calculatePunctuationDelay("quote»")).toBe(1.8);
      expect(calculatePunctuationDelay("parenthesis)")).toBe(1.8);
    });

    it("should return 1.0 multiplier for normal words without punctuation", () => {
      expect(calculatePunctuationDelay("normal")).toBe(1.0);
      expect(calculatePunctuationDelay("words")).toBe(1.0);
    });
  });

  describe("generateRSVPSequence", () => {
    it("should return empty array for empty or invalid input", () => {
      expect(generateRSVPSequence("")).toEqual([]);
      // @ts-expect-error - testing boundary condition
      expect(generateRSVPSequence(null)).toEqual([]);
    });

    it("should correctly split text and map ORP and delay multipliers", () => {
      const text = "Hello, this is a speed-reading test.";
      const sequence = generateRSVPSequence(text);

      expect(sequence).toHaveLength(6);
      
      // "Hello," -> length 5 (comma clean), ends with comma (1.5 delay)
      expect(sequence[0]).toEqual({
        text: "Hello,",
        orpIndex: 1,
        delayMultiplier: 1.5,
      });

      // "test." -> length 4 (dot clean), ends with dot (2.2 delay)
      expect(sequence[5]).toEqual({
        text: "test.",
        orpIndex: 1,
        delayMultiplier: 2.2,
      });
    });
  });
});
