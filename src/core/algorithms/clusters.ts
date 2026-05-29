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

/**
 * Representación estructurada de un cúmulo dinámico para lectura rápida.
 */
export interface DynamicCluster {
  text: string;
  wordCount: number;
  charCount: number;
  delayMultiplier: number;
}

/**
 * Agrupa texto de forma dinámica basándose en principios cognitivos de lectura.
 * Controla la longitud visual (visión parafoveal) y las pausas gramaticales,
 * asignando un factor de retardo adaptativo a cada bloque.
 *
 * @param paragraph - Texto del párrafo a procesar.
 * @param targetChunkSize - Cantidad ideal de palabras por cúmulo.
 * @returns Listado de cúmulos dinámicos estructurados.
 */
export function generateDynamicClusters(paragraph: string, targetChunkSize: number = 3): DynamicCluster[] {
  if (!paragraph || paragraph.trim() === "") return [];

  const words = paragraph.trim().split(/\s+/);
  const clusters: DynamicCluster[] = [];
  
  let currentWords: string[] = [];
  let currentCharCount = 0;

  const pushCurrentCluster = () => {
    if (currentWords.length === 0) return;

    const text = currentWords.join(" ");
    const wordCount = currentWords.length;
    const charCount = text.length;

    // Calcular multiplicador de retardo cognitivo
    let delayMultiplier = 1.0;
    const lastWord = currentWords[currentWords.length - 1];

    if (/[.?!]$/.test(lastWord)) {
      delayMultiplier = 1.6; // Pausa mayor al final de frases
    } else if (/[,,;:—]$/.test(lastWord)) {
      delayMultiplier = 1.3; // Pausa media en comas y pausas sintácticas
    }

    // Incrementar retardo si contiene palabras complejas o largas
    const hasLongWord = currentWords.some((w) => w.replace(/[^\w]/g, "").length >= 9);
    if (hasLongWord) {
      delayMultiplier += 0.2;
    }

    // Acelerar si son palabras muy cortas y simples
    const avgLength = currentWords.reduce((sum, w) => sum + w.length, 0) / wordCount;
    if (avgLength <= 3.5 && delayMultiplier === 1.0) {
      delayMultiplier = 0.85;
    }

    clusters.push({
      text,
      wordCount,
      charCount,
      delayMultiplier: Math.min(2.0, Math.max(0.7, delayMultiplier)),
    });

    currentWords = [];
    currentCharCount = 0;
  };

  for (const word of words) {
    const wordLength = word.length;
    
    // Reglas de corte foveal y longitud (visión parafoveal max ~22 caracteres)
    const wouldExceedCharLimit = currentWords.length > 0 && (currentCharCount + wordLength + 1 > 22);
    const wouldExceedWordLimit = currentWords.length >= targetChunkSize;

    if (wouldExceedCharLimit || wouldExceedWordLimit) {
      pushCurrentCluster();
    }

    currentWords.push(word);
    currentCharCount += (currentCharCount === 0 ? 0 : 1) + wordLength;

    // Corte obligatorio por puntuación sintáctica pesada o media
    if (/[.?!,;:—]$/.test(word)) {
      pushCurrentCluster();
    }
  }

  // Empujar residuo final
  pushCurrentCluster();

  return clusters;
}

