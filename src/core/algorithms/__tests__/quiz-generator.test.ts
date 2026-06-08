import { describe, it, expect } from "vitest";
import { generateQuizForChapter } from "../quiz-generator";

describe("Quiz Generator", () => {
  const sampleContent = `
    The quantum fluctuations in the early universe led to the formation of galaxies. 
    In 1984, researchers published a paper describing these patterns. 
    London was the location of the first international symposium on cosmological structures.
    Cosmology is a fascinating field.
  `;

  it("should generate a quiz with exactly 3 questions", () => {
    const quiz = generateQuizForChapter("Cosmology Introduction", sampleContent);
    expect(quiz.chapterTitle).toBe("Cosmology Introduction");
    expect(quiz.questions.length).toBe(3);
  });

  it("should generate a word recognition question", () => {
    const quiz = generateQuizForChapter("Cosmology", sampleContent);
    const wordRecQ = quiz.questions.find(q => q.type === "word_recognition");
    
    expect(wordRecQ).toBeDefined();
    expect(wordRecQ?.questionText).toContain("words was present");
    expect(wordRecQ?.options.length).toBe(4);
    expect(wordRecQ?.options).toContain(wordRecQ?.correctAnswer);
    expect(wordRecQ?.isSubjective).toBe(false);
  });

  it("should generate a numeric detail question when numbers are present", () => {
    const quiz = generateQuizForChapter("Cosmology", sampleContent);
    const detailQ = quiz.questions.find(q => q.type === "detail");
    
    expect(detailQ).toBeDefined();
    expect(detailQ?.questionText).toContain("numbers or quantities");
    expect(detailQ?.options.length).toBe(4);
    expect(detailQ?.options).toContain(detailQ?.correctAnswer);
    expect(detailQ?.correctAnswer).toBe("1984");
    expect(detailQ?.isSubjective).toBe(false);
  });

  it("should generate a proper noun question when proper nouns are present but no numbers are", () => {
    const contentWithoutNumbers = `
      The quantum fluctuations in the early universe led to the formation of galaxies. 
      In summer, London was the location of the symposium on cosmological structures.
      Cosmology is a fascinating field.
    `;
    const quiz = generateQuizForChapter("Cosmology", contentWithoutNumbers);
    const properNounQ = quiz.questions.find(q => q.type === "proper_noun");
    
    expect(properNounQ).toBeDefined();
    expect(properNounQ?.questionText).toContain("names, places, or entities");
    expect(properNounQ?.options.length).toBe(4);
    expect(properNounQ?.options).toContain(properNounQ?.correctAnswer);
    expect(properNounQ?.correctAnswer).toBe("London");
    expect(properNounQ?.isSubjective).toBe(false);
  });

  it("should generate a subjective focus check question", () => {
    const quiz = generateQuizForChapter("Cosmology", sampleContent);
    const focusQ = quiz.questions.find(q => q.type === "focus_check");
    
    expect(focusQ).toBeDefined();
    expect(focusQ?.questionText).toContain("level of attention and focus");
    expect(focusQ?.options.length).toBe(4);
    expect(focusQ?.isSubjective).toBe(true);
  });
});
