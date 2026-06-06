/**
 * @file abbreviations.ts
 * @description Language abbreviations configuration to prevent sentence-end pauses in RSVP reader.
 */

// Common English and Spanish abbreviations that should not trigger standard sentence-end pauses
export const ABBREVIATIONS = new Set([
  "etc.", "etc", "dr.", "dr", "dra.", "dra", "sr.", "sr", "sra.", "sra",
  "av.", "av", "pág.", "pág", "pag.", "pag", "pp.", "pp", "vs.", "vs",
  "art.", "art", "dcha.", "dcha", "izq.", "izq", "ee.uu.", "eeuu"
]);
