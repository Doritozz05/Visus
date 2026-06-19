"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, Volume2, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface DictionaryModalProps {
  word: string;
  onClose: () => void;
}

interface Meaning {
  partOfSpeech: string;
  definitions: { definition: string; example?: string }[];
}

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: { text?: string; audio?: string }[];
  meanings: Meaning[];
}

export function DictionaryModal({ word, onClose }: DictionaryModalProps) {
  const [data, setData] = React.useState<DictionaryEntry[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchDefinition() {
      if (!word) return;
      setLoading(true);
      setError(null);
      try {
        // Strip punctuation
        const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().split(/\s+/)[0];
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
        if (!res.ok) {
          throw new Error("Word not found");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError("Definition not found for this word.");
      } finally {
        setLoading(false);
      }
    }

    fetchDefinition();
  }, [word]);

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      new Audio(audioUrl).play();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border/50 flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2 text-primary font-medium">
              <BookOpen className="w-5 h-5" />
              <span>Dictionary</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {loading && (
              <div className="flex flex-col items-center justify-center h-32 gap-4">
                <LoadingSpinner />
                <span className="text-muted-foreground text-sm">Searching...</span>
              </div>
            )}

            {error && !loading && (
              <div className="flex flex-col items-center justify-center h-32 gap-3 text-muted-foreground text-center">
                <AlertCircle className="w-8 h-8 text-destructive/50" />
                <p>{error}</p>
              </div>
            )}

            {!loading && data && data.length > 0 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-end gap-3 mb-1">
                    <h2 className="text-2xl font-serif font-bold text-foreground">{data[0].word}</h2>
                    {data[0].phonetic && (
                      <span className="text-muted-foreground mb-1 font-mono text-sm">{data[0].phonetic}</span>
                    )}
                    {data[0].phonetics.find(p => p.audio) && (
                      <button
                        onClick={() => playAudio(data[0].phonetics.find(p => p.audio)?.audio)}
                        className="mb-1 p-1 text-primary hover:bg-primary/10 rounded-full transition-colors"
                        title="Listen"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  {data[0].meanings.map((meaning, idx) => (
                    <div key={idx}>
                      <h3 className="text-primary/80 font-medium italic mb-2 border-b border-border/50 pb-1">
                        {meaning.partOfSpeech}
                      </h3>
                      <ul className="space-y-3 list-decimal list-outside ml-4 text-sm text-foreground/90">
                        {meaning.definitions.slice(0, 3).map((def, dIdx) => (
                          <li key={dIdx} className="pl-1 leading-relaxed">
                            {def.definition}
                            {def.example && (
                              <p className="text-muted-foreground italic mt-1 font-serif">
                                &ldquo;{def.example}&rdquo;
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
