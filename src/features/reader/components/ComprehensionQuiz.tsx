"use client";

import * as React from "react";
import { Quiz, QuizQuestion } from "@/core/algorithms/quiz-generator";

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
  const [isAnswerChecked, setIsAnswerChecked] = React.useState(false);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [showResults, setShowResults] = React.useState(false);
  const [focusLevel, setFocusLevel] = React.useState<string>("");

  const currentQuestion: QuizQuestion = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const objectiveQuestionsCount = quiz.questions.filter(q => !q.isSubjective).length;

  const handleOptionSelect = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(option);
  };

  const handleCheckOrNext = () => {
    if (!selectedOption) return;

    if (!isAnswerChecked && !currentQuestion.isSubjective) {
      // Check the answer
      const isCorrect = selectedOption === currentQuestion.correctAnswer;
      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
      }
      setIsAnswerChecked(true);
    } else {
      // Save focus level if subjective
      if (currentQuestion.isSubjective) {
        setFocusLevel(selectedOption);
      }

      // Advance or show results
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      } else {
        // Compute final score
        const scorePercentage = objectiveQuestionsCount > 0 
          ? Math.round((correctCount / objectiveQuestionsCount) * 100)
          : 100;
        
        onComplete(scorePercentage, focusLevel || selectedOption);
        setShowResults(true);
      }
    }
  };

  if (showResults) {
    const scorePercentage = objectiveQuestionsCount > 0 
      ? Math.round((correctCount / objectiveQuestionsCount) * 100)
      : 100;

    return (
      <div className="w-full max-w-md bg-card border border-border/30 rounded-xl p-5 md:p-6 text-center shadow-2xl glass-panel relative overflow-hidden flex flex-col items-center justify-center gap-4 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
        
        <div className="relative mb-1">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
        </div>

        <div className="relative z-10 w-full">
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary mb-1 block font-bold">Quiz completed</span>
          <h2 className="text-lg font-bold font-heading text-foreground mb-3">Comprehension results</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-background/40 border border-border/20 p-3 rounded-lg text-left">
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Accuracy score</span>
              <p className={`text-xl font-extrabold font-heading mt-0.5 ${
                scorePercentage >= 80 ? "text-emerald-500" : scorePercentage >= 50 ? "text-amber-500" : "text-destructive"
              }`}>
                {scorePercentage}%
              </p>
            </div>
            
            <div className="bg-background/40 border border-border/20 p-3 rounded-lg text-left">
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Focus rating</span>
              <p className="text-xs font-bold text-foreground mt-0.5 truncate">
                {focusLevel ? focusLevel.split(": ")[0] : "Not rated"}
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-sans max-w-xs leading-relaxed mx-auto mb-1">
            {scorePercentage === 100 
              ? "Perfect retention! Your speed-reading comprehension is outstanding at this pace."
              : scorePercentage >= 50 
                ? "Good comprehension. Try maintaining a steady rhythm to improve retention."
                : "Low retention. Consider adjusting your WPM lower to process details more effectively."
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
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
          const isCorrect = option === currentQuestion.correctAnswer;
          
          let optionStyle = "border-border/30 hover:border-primary/50 hover:bg-accent/40";
          if (isSelected) {
            optionStyle = "border-primary bg-primary/10 text-primary";
          }
          
          if (isAnswerChecked) {
            if (isCorrect) {
              optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium";
            } else if (isSelected) {
              optionStyle = "border-destructive bg-destructive/10 text-destructive font-medium";
            } else {
              optionStyle = "border-border/10 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionSelect(option)}
              disabled={isAnswerChecked}
              className={`w-full text-left py-2 px-3.5 rounded-lg border transition-all text-xs md:text-sm font-sans flex items-center justify-between group ${optionStyle}`}
            >
              <span className="flex-1">{option}</span>
              {isAnswerChecked && isCorrect && (
                <span className="material-symbols-outlined text-emerald-500 text-sm ml-2">check_circle</span>
              )}
              {isAnswerChecked && isSelected && !isCorrect && (
                <span className="material-symbols-outlined text-destructive text-sm ml-2">cancel</span>
              )}
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
            {currentQuestion.isSubjective
              ? (currentIndex === totalQuestions - 1 ? "Finish quiz" : "Next question")
              : (isAnswerChecked
                  ? (currentIndex === totalQuestions - 1 ? "View results" : "Next question")
                  : "Check answer")
            }
          </span>
          <span className="material-symbols-outlined text-sm">
            {currentIndex === totalQuestions - 1 && (isAnswerChecked || currentQuestion.isSubjective) ? "done_all" : "arrow_forward"}
          </span>
        </button>
      </div>
    </div>
  );
}
