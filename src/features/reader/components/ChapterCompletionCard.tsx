"use client";

import * as React from "react";
import { BookOpen, HelpCircle, ArrowRight } from "lucide-react";
import { generateQuizForChapter, Quiz } from "@/core/algorithms/quiz-generator";

interface ChapterCompletionCardProps {
  completedChapter: string;
  currentChapterContent: string;
  onTakeQuiz: (quiz: Quiz) => void;
  onBackToReader: () => void;
  onSkipQuiz: () => void;
}

export function ChapterCompletionCard({
  completedChapter,
  currentChapterContent,
  onTakeQuiz,
  onBackToReader,
  onSkipQuiz,
}: ChapterCompletionCardProps) {
  const handleGenerateQuiz = React.useCallback(() => {
    const generated = generateQuizForChapter(completedChapter, currentChapterContent);
    onTakeQuiz(generated);
  }, [completedChapter, currentChapterContent, onTakeQuiz]);

  return (
    <div className="max-w-md w-full bg-card border border-border/30 rounded-2xl p-8 text-center shadow-2xl glass-panel relative overflow-hidden flex flex-col items-center justify-center gap-6 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
      
      <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-bounce relative z-10">
        <BookOpen className="w-8 h-8" />
      </div>

      <div className="relative z-10">
        <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2 block font-bold">
          Section completed
        </span>
        <h2 className="text-xl font-bold font-heading text-foreground mb-3">
          {completedChapter}
        </h2>
        <p className="text-xs text-muted-foreground font-sans max-w-xs leading-relaxed mx-auto">
          Excellent comprehension pace! Your mind has successfully processed this chapter. Take a second to breathe and consolidate the information.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full mt-2 relative z-10 font-sans">
        <button
          onClick={handleGenerateQuiz}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-xs font-mono uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(var(--primary),0.15)] hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Take comprehension quiz</span>
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="flex gap-3 w-full">
          <button
            onClick={onBackToReader}
            className="flex-1 px-4 py-2.5 border border-border/30 rounded text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            Back to reader
          </button>
          <button
            onClick={onSkipQuiz}
            className="flex-1 px-4 py-2.5 bg-accent text-primary border border-primary/20 rounded text-xs font-mono uppercase tracking-wider font-bold hover:bg-accent/85 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Skip quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
