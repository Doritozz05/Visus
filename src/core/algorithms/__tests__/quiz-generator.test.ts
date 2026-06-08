import { describe, it, expect } from "vitest";
import { generateQuizForChapter } from "../quiz-generator";

describe("Quiz Generator", () => {
  it("should generate a quiz with exactly 5 questions", () => {
    const quiz = generateQuizForChapter("Cosmology Introduction");
    expect(quiz.chapterTitle).toBe("Cosmology Introduction");
    expect(quiz.questions.length).toBe(5);
  });

  it("should generate all metacognitive question types", () => {
    const quiz = generateQuizForChapter("Cosmology");
    
    const gistQ = quiz.questions.find(q => q.type === "gist");
    const detailQ = quiz.questions.find(q => q.type === "detail");
    const focusQ = quiz.questions.find(q => q.type === "focus");
    const paceQ = quiz.questions.find(q => q.type === "pace");
    const attentionQ = quiz.questions.find(q => q.type === "attention");

    expect(gistQ).toBeDefined();
    expect(detailQ).toBeDefined();
    expect(focusQ).toBeDefined();
    expect(paceQ).toBeDefined();
    expect(attentionQ).toBeDefined();

    // Verify weights mapping structure
    expect(gistQ?.weights.length).toBe(4);
    expect(detailQ?.weights.length).toBe(4);
    expect(focusQ?.weights.length).toBe(4);
    expect(paceQ?.weights.length).toBe(4);
    expect(attentionQ?.weights.length).toBe(4);

    // Verify they are all configured for self-evaluation (subjective flow)
    expect(gistQ?.isSubjective).toBe(true);
    expect(detailQ?.isSubjective).toBe(true);
    expect(focusQ?.isSubjective).toBe(true);
    expect(paceQ?.isSubjective).toBe(true);
    expect(attentionQ?.isSubjective).toBe(true);
  });
});
