/**
 * @file clusters.ts
 * @description Algorithms for visual word-chunking (Cúmulos).
 * Provides utilities to group text into visual chunks that train and expand peripheral vision.
 */

/**
 * Groups a sequential array of words into visual chunks of fixed sizes.
 * 
 * @param words - Raw word list.
 * @param chunkSize - Words per visual chunk.
 * @returns Array matrix of grouped reading chunks.
 */
export function generateFixedChunks(words: string[], chunkSize: number): string[][] {
  if (!words || words.length === 0) return [];
  const safeChunkSize = Math.max(1, chunkSize);
  const chunks: string[][] = [];
  
  for (let i = 0; i < words.length; i += safeChunkSize) {
    chunks.push(words.slice(i, i + safeChunkSize));
  }
  
  return chunks;
}

/**
 * Segments paragraph text using syntactic and natural punctuation boundaries
 * to keep semantic meaning cohesive, balancing chunk lengths to avoid broken ideas.
 *
 * @param paragraph - Raw text block/paragraph.
 * @param targetChunkSize - Ideal words per visual chunk.
 * @returns Array list of reading phrases (syntactic chunks).
 */
export function generateSemanticChunks(paragraph: string, targetChunkSize: number): string[] {
  if (!paragraph) return [];
  
  // Split by basic grammatical clauses (periods, commas, semicolons)
  const clauses = paragraph.split(/(?<=[,.;:?!])\s+/);
  const finishedChunks: string[] = [];
  
  for (const clause of clauses) {
    const words = clause.trim().split(/\s+/);
    if (words.length === 0 || words[0] === "") continue;
    
    if (words.length <= targetChunkSize + 1) {
      // Keep clause together if close to target size to preserve immediate semantic meaning
      finishedChunks.push(words.join(" "));
    } else {
      // Divide evenly if it significantly exceeds target size
      for (let i = 0; i < words.length; i += targetChunkSize) {
        finishedChunks.push(words.slice(i, i + targetChunkSize).join(" "));
      }
    }
  }
  
  return finishedChunks;
}
