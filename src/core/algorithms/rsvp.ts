/**
 * @file rsvp.ts
 * @description Contains the core algorithms for RSVP (Rapid Serial Visual Presentation),
 * including Optimal Recognition Point (ORP) computation and dynamic punctuation delays.
 */

import { RSVPWord } from "../entities/text";

/**
 * Calculates the index of the Optimal Recognition Point (ORP) within a word.
 * The ORP minimizes saccadic eye movements, maximizing visual reading speed and comprehension.
 *
 * Classical ORP distribution rules:
 * - 0 to 1 letters: First letter (Index 0)
 * - 2 to 5 letters: Second letter (Index 1)
 * - 6 to 9 letters: Third letter (Index 2)
 * - 10 to 13 letters: Fourth letter (Index 3)
 * - More than 13 letters: Fifth letter (Index 4)
 *
 * @param word - Word to evaluate.
 * @returns The 0-based index of the character serving as the visual anchor.
 */
export function calculateORP(word: string): number {
  const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
  const length = cleanWord.length;
  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  if (length <= 13) return 3;
  return 4;
}

/**
 * Calculates the dynamic delay multiplier associated with punctuation characters.
 * Emulates mental reading rhythm by allocating more focus time for commas, periods, etc.
 *
 * @param word - Word being evaluated.
 * @returns Time multiplier (1.0 = base, 1.5 = medium pause, 2.2 = long pause).
 */
export function calculatePunctuationDelay(word: string): number {
  if (/[.!?]$/.test(word)) return 2.2;  // End of sentence (extended pause)
  if (/[,;:—]$/.test(word)) return 1.5; // Medium pause for structural breaks
  if (/[?!)»]$/.test(word)) return 1.8;  // End of quote or exclamatory break
  return 1.0;
}

/**
 * Calculates the dynamic delay multiplier based on word length.
 * Extremely long words receive a slight delay multiplier to aid cognitive decoding.
 *
 * @param word - Word being evaluated.
 * @returns Time multiplier (1.0 = base, 1.15 = long word, 1.3 = extremely long word).
 */
export function calculateLengthDelay(word: string): number {
  const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
  const length = cleanWord.length;
  if (length > 12) return 1.3;  // Extremely long words (e.g., electrocardiogram)
  if (length > 8) return 1.15;  // Long words (e.g., everything, compositions)
  return 1.0;
}

/**
 * Parses raw text content and generates the full sequence of RSVPWord structures ready for rendering.
 *
 * @param content - Raw text content.
 * @returns An ordered array of RSVPWord objects.
 */
export function generateRSVPSequence(content: string): RSVPWord[] {
  if (!content || typeof content !== "string") return [];
  
  const rawWords = content.trim().split(/\s+/);
  return rawWords.map((word) => {
    const puncDelay = calculatePunctuationDelay(word);
    const lengthDelay = calculateLengthDelay(word);
    return {
      text: word,
      orpIndex: calculateORP(word),
      delayMultiplier: parseFloat((puncDelay * lengthDelay).toFixed(2)),
    };
  });
}

