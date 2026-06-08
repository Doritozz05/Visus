"use client";

import * as React from "react";
import { Quiz, QuizQuestion } from "@/core/algorithms/quiz-generator";
import { CheckCircle, ArrowRight, CheckCheck } from "lucide-react";

interface ComprehensionQuizProps {
  quiz: Quiz;
  onComplete: (accuracy: number, focusLevel: string) => void;
  onClose: () => void;
  onNextChapter?: () => void;
}

export function ComprehensionQuiz({
  quiz,
  onComplete,
  onClose,
  onNextChapter,
}: ComprehensionQuizProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [selectedWeights, setSelectedWeights] = React.useState<number[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  const [focusLevel, setFocusLevel] = React.useState<string>("");

  const currentQuestion: QuizQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleCheckOrNext = () => {
    if (!selectedOption) return;

    const optIdx = currentQuestion.options.indexOf(selectedOption);
    const weight = currentQuestion.weights[optIdx] ?? 100;

    const newWeights = [...selectedWeights, weight];
    setSelectedWeights(newWeights);

    if (currentQuestion.type === "attention") {
      setFocusLevel(selectedOption);
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      // Calculate average score of performance-related questions (gist, detail, focus, pace)
      const performanceWeights = newWeights.slice(0, 4);
      const sum = performanceWeights.reduce((a, b) => a + b, 0);
      const scorePercentage = Math.round(sum / 4);

      const finalFocus = selectedOption;
      setFocusLevel(finalFocus);

      onComplete(scorePercentage, finalFocus);
      setShowResults(true);
    }
  };

  if (showResults) {
    const performanceWeights = selectedWeights.slice(0, 4);
    const sum = performanceWeights.reduce((a, b) => a + b, 0);
    const scorePercentage = Math.round(sum / 4);

    return (
      <div className="w-full max-w-md bg-card border border-border/30 rounded-xl p-5 md:p-6 text-center shadow-2xl glass-panel relative overflow-hidden flex flex-col items-center justify-center gap-4 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
        
        <div className="relative mb-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="relative z-10 w-full">
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-1 block font-bold">Evaluation completed</span>
          <h2 className="text-lg font-bold font-heading text-foreground mb-3">Your Reading Metrics</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-background/40 border border-border/20 p-3 rounded-lg text-left">
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Accuracy rating</span>
              <p className={`text-xl font-extrabold font-heading mt-0.5 ${
                scorePercentage >= 80 ? "text-emerald-500" : scorePercentage >= 50 ? "text-amber-500" : "text-destructive"
              }`}>
                {scorePercentage}%
              </p>
            </div>
            
            <div className="bg-background/40 border border-border/20 p-3 rounded-lg text-left">
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Focus level</span>
              <p className="text-xs font-bold text-foreground mt-0.5 truncate">
                {focusLevel ? focusLevel.split(": ")[0] : "Not rated"}
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-sans max-w-xs leading-relaxed mx-auto mb-1">
            {scorePercentage >= 80 
              ? "Excellent comprehension! You have found a highly efficient pace for this text."
              : scorePercentage >= 50 
                ? "Moderate comprehension. You might benefit from slightly slowing down to absorb details."
                : "Low retention. Try decreasing your target WPM to process the text more comfortably."
            }
          </p>
        </div>

        <div className="flex gap-3 w-full mt-1 relative z-10">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border/30 rounded text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
          >
            Back to pages
          </button>
          {onNextChapter && (
            <button
              onClick={onNextChapter}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded text-xs font-mono uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(var(--primary),0.15)] hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Next chapter</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg bg-card border border-border/30 rounded-xl p-4 md:p-5 shadow-2xl glass-panel relative overflow-hidden flex flex-col gap-4 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
      
      {/* Header / Progress bar */}
      <div className="relative z-10 flex justify-between items-center border-b border-border/20 pb-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">Comprehension quiz</span>
          <h3 className="text-xs md:text-sm font-bold font-heading text-foreground truncate max-w-[200px] md:max-w-xs">{quiz.chapterTitle}</h3>
        </div>
        <span className="text-[10px] md:text-xs font-mono text-muted-foreground">
          Question {currentIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-accent h-1 rounded-full overflow-hidden relative z-10">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        ></div>
      </div>

      {/* Question Text */}
      <div className="relative z-10 py-1">
        <h4 className="text-sm md:text-base font-bold text-foreground leading-snug">
          {currentQuestion.questionText}
        </h4>
      </div>

      {/* Options List */}
      <div className="relative z-10 flex flex-col gap-2">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          
          let optionStyle = "border-border/30 hover:border-primary/50 hover:bg-accent/40";
          if (isSelected) {
            optionStyle = "border-primary bg-primary/10 text-primary";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option)}
              className={`w-full text-left py-2 px-3.5 rounded-lg border transition-all text-xs md:text-sm font-sans flex items-center justify-between group ${optionStyle}`}
            >
              <span className="flex-1">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="relative z-10 flex justify-between items-center gap-3 pt-2 border-t border-border/20">
        <button
          onClick={onClose}
          className="px-3 py-1.5 border border-border/30 rounded text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
        >
          Cancel quiz
        </button>
        <button
          onClick={handleCheckOrNext}
          disabled={!selectedOption}
          className="px-4 py-1.5 bg-primary disabled:opacity-50 disabled:hover:brightness-100 text-primary-foreground rounded text-xs font-mono uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(var(--primary),0.15)] hover:brightness-110 transition-all flex items-center gap-1.5"
        >
          <span>
            {currentIndex === totalQuestions - 1 ? "Finish evaluation" : "Next question"}
          </span>
          {currentIndex === totalQuestions - 1 ? (
            <CheckCheck className="h-3.5 w-3.5" />
          ) : (
            <ArrowRight className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
