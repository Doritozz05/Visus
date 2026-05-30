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
  if (!word) return 0;

  // Let's identify the range of letter/number content in the raw word.
  // We want to skip leading and trailing non-alphanumeric punctuation.
  // In Spanish, this includes standard letters/numbers plus characters with accents/diacritics.
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

// Common English and Spanish abbreviations that should not trigger standard sentence-end pauses
const ABBREVIATIONS = new Set([
  "etc.", "etc", "dr.", "dr", "dra.", "dra", "sr.", "sr", "sra.", "sra",
  "av.", "av", "pág.", "pág", "pag.", "pag", "pp.", "pp", "vs.", "vs",
  "art.", "art", "dcha.", "dcha", "izq.", "izq", "ee.uu.", "eeuu"
]);

/**
 * Calculates the dynamic delay multiplier associated with punctuation characters.
 * Emulates mental reading rhythm by allocating more focus time for commas, periods, etc.
 *
 * @param word - Word being evaluated.
 * @returns Time multiplier (1.0 = base, 1.5 = medium pause, 2.2 = long pause).
 */
export function calculatePunctuationDelay(word: string): number {
  const lowerWord = word.toLowerCase().trim();
  if (ABBREVIATIONS.has(lowerWord)) {
    return 1.0; // Ignore delays for abbreviations
  }

  // Refined regexes to handle ending punctuation potentially followed by closing quotes or parentheses
  if (/[.!?]['"”’»)}]*$/.test(word)) return 2.2;  // End of sentence (extended pause)
  if (/[,;:—]['"”’»)}]*$/.test(word)) return 1.5; // Medium pause for structural breaks
  if (/[?!)»'"”’]$/.test(word)) return 1.8;        // End of quote or exclamatory break
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
export function generateRSVPSequence(contentOrWords: string | string[]): RSVPWord[] {
  if (!contentOrWords) return [];
  
  const rawWords = Array.isArray(contentOrWords)
    ? contentOrWords
    : contentOrWords.trim().split(/\s+/).filter(w => w.trim() !== "");
    
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

