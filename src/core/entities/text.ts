/**
 * @file text.ts
 * @description Defines data entities and models for text processed by the Visus platform.
 * Complies with Clean Architecture principles by being 100% UI and framework agnostic.
 */

/**
 * Represents metadata for a loaded document or text.
 */
export interface TextMetadata {
  title: string;
  author?: string;
  sourceType: "txt" | "pdf" | "epub" | "raw";
  fileSize?: number;
  wordCount: number;
  estimatedReadingTimeMin: number;
  createdAt: Date;
}

/**
 * Represents a single processed word for RSVP,
 * identifying the Optimal Recognition Point (ORP).
 */
export interface RSVPWord {
  text: string;
  orpIndex: number;
  delayMultiplier: number; // Speed modifier for punctuation marks (e.g. commas, periods, etc.)
}

/**
 * Main entity representing fully analyzed text ready for speed reading engines.
 */
export interface ReadableText {
  id: string;
  content: string;
  metadata: TextMetadata;
  paragraphs: string[];
  words: RSVPWord[];
}
