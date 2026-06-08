/**
 * @file quiz-generator.ts
 * @description Logic for generating structured metacognitive reading self-evaluations.
 * Runs entirely offline, language-agnostic, and evaluates comprehension performance honestly.
 */

export interface QuizQuestion {
  id: string;
  type: "gist" | "detail" | "focus" | "pace" | "attention";
  questionText: string;
  options: string[];
  correctAnswer: string;
  isSubjective: boolean;
  weights: number[]; // Performance score weights corresponding to each option index
}

export interface Quiz {
  chapterTitle: string;
  questions: QuizQuestion[];
}

/**
 * Generates a standard 5-question metacognitive comprehension quiz.
 * 
 * @param chapterTitle - Title of the completed chapter
 * @param _content - Chapter text (unused, kept for signature compatibility)
 * @returns A Quiz object containing exactly 5 questions
 */
export function generateQuizForChapter(chapterTitle: string, _content?: string): Quiz {
  const questions: QuizQuestion[] = [
    {
      id: "q-gist",
      type: "gist",
      questionText: "How well did you capture and retain the main argument or theme of this section?",
      options: [
        "Excellent: I fully grasped the core message and flow of ideas.",
        "Good: I understood the main point but missed some transitions.",
        "Partial: I got the general topic but couldn't explain details clearly.",
        "None: I read the words but retained no coherent meaning."
      ],
      correctAnswer: "",
      isSubjective: true,
      weights: [100, 75, 40, 0]
    },
    {
      id: "q-detail",
      type: "detail",
      questionText: "How accurately did you process details, technical terms, or key entities?",
      options: [
        "High: I registered specific names, terms, or key facts clearly.",
        "Moderate: I noticed some details but their connections are blurry.",
        "Low: I focused heavily on general rhythm and skipped details.",
        "None: I bypassed all details and read only for superficial speed."
      ],
      correctAnswer: "",
      isSubjective: true,
      weights: [100, 70, 30, 0]
    },
    {
      id: "q-focus",
      type: "focus",
      questionText: "What was your cognitive pacing and comfort level during playback?",
      options: [
        "Optimal: The WPM speed felt natural and easy to process.",
        "Pushed: The speed was slightly high, causing minor tracking strains.",
        "Skimming: I felt rushed and had to struggle to keep up with words.",
        "Overwhelming: The text moved too fast to process sentences."
      ],
      correctAnswer: "",
      isSubjective: true,
      weights: [100, 75, 40, 10]
    },
    {
      id: "q-pace",
      type: "pace",
      questionText: "To what extent did you experience inner vocalization (subvocalization)?",
      options: [
        "None/Minimal: Quiet mental state, words processed entirely visually.",
        "Occasional: Subvocalized only long, complex, or unfamiliar words.",
        "Frequent: Tended to repeat clauses in my head, limiting speed.",
        "Constant: Subvocalized every word as if reading aloud."
      ],
      correctAnswer: "",
      isSubjective: true,
      weights: [100, 80, 45, 10]
    },
    {
      id: "q-attention",
      type: "attention",
      questionText: "How would you rate your level of focus and attention while reading this section?",
      options: [
        "Excellent focus: Zero distractions, high mental alertness.",
        "Good focus: Brief moments of distraction but easily corrected.",
        "Moderate focus: Mind wandered occasionally, missed small blocks.",
        "Low focus: Highly distracted, might need to re-read parts of it."
      ],
      correctAnswer: "",
      isSubjective: true,
      weights: [100, 75, 45, 10]
    }
  ];

  return {
    chapterTitle,
    questions
  };
}
