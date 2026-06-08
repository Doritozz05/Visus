/**
 * @file quiz-generator.ts
 * @description Logic for generating deterministic reading comprehension quizzes based on chapter text.
 * Runs entirely offline with no external dependencies.
 */

export interface QuizQuestion {
  id: string;
  type: "word_recognition" | "detail" | "proper_noun" | "focus_check";
  questionText: string;
  options: string[];
  correctAnswer: string;
  isSubjective: boolean;
}

export interface Quiz {
  chapterTitle: string;
  questions: QuizQuestion[];
}

const STOPWORDS = new Set([
  "the", "and", "a", "of", "to", "in", "is", "that", "it", "he", "was", "for", "on", "are", 
  "as", "with", "his", "they", "i", "at", "be", "this", "have", "from", "or", "one", "had", 
  "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said", 
  "there", "use", "an", "each", "which", "she", "do", "how", "their", "if", "will", "up", 
  "other", "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", 
  "make", "like", "him", "into", "time", "has", "look", "two", "more", "write", "go", "see"
]);

const DISTRACTOR_WORDS = [
  "matrix", "vector", "galaxy", "quantum", "gravity", "nebula", "element", "substance",
  "chemical", "reaction", "energy", "spectrum", "frequency", "vibration", "resonance", "harmonic",
  "pattern", "sequence", "process", "function", "variable", "constant", "equation", "formula",
  "theorem", "hypothesis", "analysis", "synthesis", "feedback", "control", "system", "network",
  "channel", "protocol", "message", "signal", "device", "terminal", "console", "keyboard",
  "monitor", "display", "graphic", "texture", "surface", "volume", "density", "pressure",
  "temperature", "velocity", "friction", "inertia", "momentum", "impulse", "entropy", "enthalpy",
  "concept", "theory", "method", "source", "object", "design", "impact", "nature",
  "future", "growth", "change", "factor", "market", "policy", "social", "public", "health",
  "action", "course", "period", "effect", "office", "report", "member", "sector", "detail",
  "option", "choice", "effort", "status", "series", "season", "moment", "border",
  "island", "forest", "mountain", "valley", "river", "stream", "ocean", "desert", "canyon"
];

const DISTRACTOR_PROPER_NOUNS = [
  "London", "Paris", "Berlin", "Tokyo", "New York", "Chicago", "Boston", "Sydney", "Rome", "Madrid",
  "Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Henry", "John", "Sarah", "Michael",
  "Google", "Apple", "Microsoft", "Amazon", "Tesla", "NASA", "Earth", "Mars", "Jupiter"
];

/**
 * Shuffles an array deterministically or pseudo-randomly.
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Extract clean words from text.
 */
function getWords(text: string): string[] {
  return text
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’“]/g, "")
    .split(/\s+/)
    .filter(w => w.trim() !== "");
}

/**
 * Helper to generate plausible numerical distractors.
 */
function generateNumericDistractors(correctNumber: number): string[] {
  const distractors: Set<string> = new Set();
  
  // Basic offsets
  const offsets = [
    Math.round(correctNumber * 0.8),
    Math.round(correctNumber * 1.2),
    Math.round(correctNumber * 1.5),
    correctNumber + 10,
    correctNumber - 5,
  ];

  for (const offset of offsets) {
    if (offset !== correctNumber && offset > 0) {
      distractors.add(offset.toString());
    }
    if (distractors.size >= 3) break;
  }

  // Fallbacks if we don't have 3 unique distractors
  let scale = 1;
  while (distractors.size < 3) {
    const fallback = correctNumber + (scale * 3);
    if (fallback !== correctNumber) {
      distractors.add(fallback.toString());
    }
    scale++;
  }

  return Array.from(distractors);
}

/**
 * Generates a comprehension quiz based on a chapter's content.
 * 
 * @param chapterTitle - Title of the completed chapter
 * @param content - Content of the chapter
 * @returns A Quiz object containing exactly 3 questions
 */
export function generateQuizForChapter(chapterTitle: string, content: string): Quiz {
  const questions: QuizQuestion[] = [];
  const cleanContent = content.trim();
  const lowercaseContent = cleanContent.toLowerCase();
  
  const allRawWords = getWords(cleanContent);
  const lowercaseWords = allRawWords.map(w => w.toLowerCase());
  const wordsSet = new Set(lowercaseWords);

  // --- QUESTION 1: Word Recognition ---
  // Find candidates: length 6-12, not in stopwords, present in text
  const wordCandidates = allRawWords.filter(w => {
    const len = w.length;
    const lower = w.toLowerCase();
    return len >= 6 && len <= 12 && !STOPWORDS.has(lower);
  });

  let wordQSuccess = false;
  let firstTargetWord = "";

  if (wordCandidates.length > 0) {
    // Count frequencies
    const freqMap: { [key: string]: number } = {};
    wordCandidates.forEach(w => {
      const lower = w.toLowerCase();
      freqMap[lower] = (freqMap[lower] || 0) + 1;
    });

    // Sort candidates by frequency descending
    const sortedCandidates = Object.keys(freqMap).sort((a, b) => freqMap[b] - freqMap[a]);
    const targetWord = sortedCandidates[0]; // Most frequent word
    firstTargetWord = targetWord;

    // Find distractors of similar length that are NOT in the text
    const targetLen = targetWord.length;
    const distractors = DISTRACTOR_WORDS.filter(w => {
      const len = w.length;
      return Math.abs(len - targetLen) <= 2 && !wordsSet.has(w.toLowerCase());
    });

    if (distractors.length >= 3) {
      const chosenDistractors = shuffleArray(distractors).slice(0, 3);
      const options = shuffleArray([targetWord, ...chosenDistractors]);
      
      questions.push({
        id: "q-word-rec",
        type: "word_recognition",
        questionText: "Which of the following words was present in the section you just read?",
        options,
        correctAnswer: targetWord,
        isSubjective: false
      });
      wordQSuccess = true;
    }
  }

  // Fallback for Q1 if candidate extraction failed
  if (!wordQSuccess) {
    questions.push({
      id: "q-word-rec-fallback",
      type: "word_recognition",
      questionText: "Which of the following words was present in the section you just read?",
      options: ["the", "element", "matrix", "resonance"],
      correctAnswer: "the", // Simple placeholder
      isSubjective: false
    });
  }

  // --- QUESTION 2: Detail Check (Numbers) or Proper Noun Check ---
  // Try to find numbers first
  const numberRegex = /\b\d+\b/g;
  const numbersFound = cleanContent.match(numberRegex) || [];
  const uniqueNumbers = Array.from(new Set(numbersFound)).filter(n => n.length >= 1 && n !== "0");

  let detailQSuccess = false;

  if (uniqueNumbers.length > 0) {
    const targetNumStr = uniqueNumbers[0];
    const targetNum = parseInt(targetNumStr, 10);
    
    if (!isNaN(targetNum)) {
      const distractors = generateNumericDistractors(targetNum);
      const options = shuffleArray([targetNumStr, ...distractors]);

      questions.push({
        id: "q-detail-num",
        type: "detail",
        questionText: `Which of these numbers or quantities was explicitly mentioned in this section?`,
        options,
        correctAnswer: targetNumStr,
        isSubjective: false
      });
      detailQSuccess = true;
    }
  }

  // If no numbers, try Proper Nouns
  if (!detailQSuccess) {
    // Split into sentences and find capitalized words not at start
    const sentences = cleanContent.split(/[.!?]\s+/);
    const properNounCandidates: string[] = [];

    sentences.forEach(sentence => {
      const sentenceWords = sentence.trim().split(/\s+/).filter(w => w.trim() !== "");
      if (sentenceWords.length > 1) {
        // Skip first word, look at subsequent words
        for (let i = 1; i < sentenceWords.length; i++) {
          const rawWord = sentenceWords[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, "");
          if (rawWord && /^[A-Z][a-z]+$/.test(rawWord) && !STOPWORDS.has(rawWord.toLowerCase())) {
            properNounCandidates.push(rawWord);
          }
        }
      }
    });

    const uniqueProperNouns = Array.from(new Set(properNounCandidates));

    if (uniqueProperNouns.length > 0) {
      const targetProperNoun = uniqueProperNouns[0];
      const distractors = DISTRACTOR_PROPER_NOUNS.filter(n => !wordsSet.has(n.toLowerCase()) && n.toLowerCase() !== targetProperNoun.toLowerCase());

      if (distractors.length >= 3) {
        const chosenDistractors = shuffleArray(distractors).slice(0, 3);
        const options = shuffleArray([targetProperNoun, ...chosenDistractors]);

        questions.push({
          id: "q-proper-noun",
          type: "proper_noun",
          questionText: "Which of the following names, places, or entities was mentioned in this section?",
          options,
          correctAnswer: targetProperNoun,
          isSubjective: false
        });
        detailQSuccess = true;
      }
    }
  }

  // Fallback Q2 (Second word recognition of a different word)
  if (!detailQSuccess) {
    const secondaryCandidates = wordCandidates.filter(w => w.toLowerCase() !== firstTargetWord.toLowerCase());
    if (secondaryCandidates.length > 0) {
      const targetWord = secondaryCandidates[Math.floor(Math.random() * secondaryCandidates.length)];
      const targetLen = targetWord.length;
      const distractors = DISTRACTOR_WORDS.filter(w => {
        const len = w.length;
        return Math.abs(len - targetLen) <= 2 && !wordsSet.has(w.toLowerCase());
      });

      if (distractors.length >= 3) {
        const chosenDistractors = shuffleArray(distractors).slice(0, 3);
        const options = shuffleArray([targetWord, ...chosenDistractors]);
        
        questions.push({
          id: "q-word-rec-secondary",
          type: "word_recognition",
          questionText: "Select another word that was present in the section you just read:",
          options,
          correctAnswer: targetWord,
          isSubjective: false
        });
        detailQSuccess = true;
      }
    }
  }

  // Hard fallback Q2
  if (!detailQSuccess) {
    questions.push({
      id: "q-detail-fallback",
      type: "word_recognition",
      questionText: "Which of the following words appeared in this section?",
      options: ["read", "system", "vibration", "formula"],
      correctAnswer: "read",
      isSubjective: false
    });
  }

  // --- QUESTION 3: Self-reported Focus Check (Subjective) ---
  questions.push({
    id: "q-focus-check",
    type: "focus_check",
    questionText: "How would you rate your level of attention and focus while reading this section?",
    options: [
      "Excellent focus: I understood and retained almost everything.",
      "Good focus: I followed the text but had brief moments of distraction.",
      "Moderate focus: I had to slow down and missed some details.",
      "Low focus: I was distracted and might need to re-read parts of it."
    ],
    correctAnswer: "",
    isSubjective: true
  });

  return {
    chapterTitle,
    questions
  };
}
