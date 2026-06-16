/**
 * @file rsvp.ts
 * @description Contains the core algorithms for RSVP (Rapid Serial Visual Presentation),
 * including Optimal Recognition Point (ORP) computation and dynamic punctuation delays.
 */

import { RSVPWord } from "../entities/text";
import { ABBREVIATIONS } from "../config/abbreviations";

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
  if (!word) return 0;

  // Identify the range of letter/number content in the raw word.
  // Skip leading and trailing non-alphanumeric punctuation.
  // Supports standard letters/numbers plus accented characters and diacritics.
  const letterRegex = /[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜíïöëàèìòù]/;

  let firstLetterIdx = -1;
  for (let i = 0; i < word.length; i++) {
    if (letterRegex.test(word[i])) {
      firstLetterIdx = i;
      break;
    }
  }

  if (firstLetterIdx === -1) {
    // Fallback if no alphanumeric character exists (e.g. only symbols)
    return Math.floor(word.length / 2);
  }

  let lastLetterIdx = firstLetterIdx;
  for (let i = word.length - 1; i >= firstLetterIdx; i--) {
    if (letterRegex.test(word[i])) {
      lastLetterIdx = i;
      break;
    }
  }

  const cleanLength = lastLetterIdx - firstLetterIdx + 1;

  // Classical ORP rules for visual foveal anchor points:
  let cleanOrpOffset = 0;
  if (cleanLength <= 1) cleanOrpOffset = 0;
  else if (cleanLength <= 5) cleanOrpOffset = 1;
  else if (cleanLength <= 9) cleanOrpOffset = 2;
  else if (cleanLength <= 13) cleanOrpOffset = 3;
  else cleanOrpOffset = 4;

  // Translate this foveal offset back to the index in the original raw word string.
  return firstLetterIdx + cleanOrpOffset;
}



/**
 * Options for generating RSVP sequence to apply algorithmic settings.
 */
export interface RsvpAlgorithmOptions {
  algorithm?: "dynamic" | "metronome" | "custom";
  customDelays?: {
    shortWord: number;
    longWord: number;
    comma: number;
    period: number;
  };
}

/**
 * Calculates the dynamic delay multiplier associated with punctuation characters.
 * Emulates mental reading rhythm by allocating more focus time for commas, periods, etc.
 *
 * @param word - Word being evaluated.
 * @param options - Configurable delay multipliers.
 * @returns Time multiplier (1.0 = base, 1.5 = medium pause, 2.2 = long pause).
 */
export function calculatePunctuationDelay(word: string, options?: RsvpAlgorithmOptions): number {
  if (options?.algorithm === "metronome") return 1.0;

  const lowerWord = word.toLowerCase().trim();
  if (ABBREVIATIONS.has(lowerWord)) {
    return 1.0; // Ignore delays for abbreviations
  }

  const commaDelay = options?.algorithm === "custom" && options?.customDelays?.comma ? options.customDelays.comma : 1.5;
  const periodDelay = options?.algorithm === "custom" && options?.customDelays?.period ? options.customDelays.period : 2.2;
  // Fallback for exclamation/quotes slightly lower than period
  const quoteDelay = Math.max(1.0, periodDelay - 0.4);

  // Refined regexes to handle ending punctuation potentially followed by closing quotes or parentheses
  if (/[.!?]['"”’»)}]*$/.test(word)) return periodDelay;  // End of sentence (extended pause)
  if (/[,;:—]['"”’»)}]*$/.test(word)) return commaDelay; // Medium pause for structural breaks
  if (/[?!)»'"”’]$/.test(word)) return quoteDelay;        // End of quote or exclamatory break
  return 1.0;
}

/**
 * Calculates the dynamic delay multiplier based on word length.
 * Extremely long words receive a slight delay multiplier to aid cognitive decoding.
 * Extremely short words (stop words) are slightly accelerated.
 *
 * @param word - Word being evaluated.
 * @param options - Configurable delay multipliers.
 * @returns Time multiplier.
 */
export function calculateLengthDelay(word: string, options?: RsvpAlgorithmOptions): number {
  if (options?.algorithm === "metronome") return 1.0;

  const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
  const length = cleanWord.length;
  
  const longWordDelay = options?.algorithm === "custom" && options?.customDelays?.longWord ? options.customDelays.longWord : 1.3;
  const shortWordDelay = options?.algorithm === "custom" && options?.customDelays?.shortWord ? options.customDelays.shortWord : 0.85;

  if (length > 12) return longWordDelay;  // Extremely long words (e.g., electrocardiogram)
  if (length > 8) return Math.max(1.0, longWordDelay - 0.15);  // Long words (e.g., everything, compositions)
  if (length <= 3 && length > 0) return shortWordDelay; // Short stop words (e.g., the, a, of)
  return 1.0;
}

/**
 * Parses raw text content and generates the full sequence of RSVPWord structures ready for rendering.
 *
 * @param contentOrWords - Raw text content or array of words.
 * @param options - Algorithmic overrides.
 * @returns An ordered array of RSVPWord objects.
 */
export function generateRSVPSequence(contentOrWords: string | string[], options?: RsvpAlgorithmOptions): RSVPWord[] {
  if (!contentOrWords) return [];
  
  const rawWords = Array.isArray(contentOrWords)
    ? contentOrWords
    : contentOrWords.trim().split(/\s+/).filter(w => w.trim() !== "");
    
  return rawWords.map((word) => {
    const puncDelay = calculatePunctuationDelay(word, options);
    const lengthDelay = calculateLengthDelay(word, options);
    return {
      text: word,
      orpIndex: calculateORP(word),
      delayMultiplier: parseFloat((puncDelay * lengthDelay).toFixed(2)),
    };
  });
}

