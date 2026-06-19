"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, BookOpen, Zap, ArrowRight, X, Eye } from "lucide-react";

interface OnboardingOverlayProps {
  isOpen: boolean;
  onDismiss: () => void;
}

const steps = [
  {
    title: "Import your first book",
    description:
      "Drag and drop an EPUB, PDF, or TXT file onto the upload panel. Visus parses everything locally — nothing leaves your device.",
    icon: Upload,
  },
  {
    title: "Open it in the reader",
    description:
      "Click on any book card to open it. Choose between three reading modes tailored to how you learn best.",
    icon: BookOpen,
  },
  {
    title: "Choose a reading mode",
    description:
      "RSVP flashes words one at a time for maximum speed. Cluster groups words for natural flow. Reader shows full pages with highlights and notes.",
    icon: Zap,
  },
];

export function OnboardingOverlay({ isOpen, onDismiss }: OnboardingOverlayProps) {
  const [stepIndex, setStepIndex] = React.useState(0);
  const current = steps[stepIndex];
  const Icon = current.icon;

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onDismiss();
    }
  };

  const handleSkip = () => {
    onDismiss();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={handleSkip} />

          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative z-10 w-full max-w-md bg-card border border-border/30 rounded-2xl shadow-2xl liquid-glass p-8"
          >
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/20 transition-all"
              aria-label="Skip onboarding"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center gap-6">
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === stepIndex
                        ? "w-8 bg-primary"
                        : i < stepIndex
                          ? "w-2 bg-primary/40"
                          : "w-2 bg-border"
                    }`}
                  />
                ))}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold font-heading tracking-tight">
                  {current.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {current.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full pt-2">
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-6 py-3 rounded-xl hover:brightness-110 transition-all shadow-lg"
                >
                  {stepIndex < steps.length - 1 ? (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Got it
                    </>
                  )}
                </button>
              </div>

              {stepIndex < steps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip tour
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
