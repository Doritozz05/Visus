import * as React from "react";
import { generateRSVPSequence } from "@/core/algorithms/rsvp";
import { ChapterHtmlData } from "@/features/reader/utils/chapterHtml";
import { useReadingStore } from "@/features/reader/stores/reading-store";

interface UseRsvpEngineProps {
  currentChapter: ChapterHtmlData & { words: string[] };
  mode: "rsvp" | "cluster" | "normal";
  wpm: number;
}

export function useRsvpEngine({
  currentChapter,
  mode,
  wpm,
}: UseRsvpEngineProps) {
  const isPlaying = useReadingStore((state) => state.isPlaying);

  const rsvpSequence = React.useMemo(() => {
    return generateRSVPSequence(currentChapter.words);
  }, [currentChapter.words]);

  // Master speed reading playback timer loop for RSVP mode
  React.useEffect(() => {
    if (!isPlaying || mode !== "rsvp" || rsvpSequence.length === 0) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const tick = () => {
      const currentIdx = useReadingStore.getState().wordIndex;
      const baseDelayMs = (60 * 1000) / wpm;

      const currentWordObj = rsvpSequence[currentIdx];
      const delayMultiplier = currentWordObj ? currentWordObj.delayMultiplier : 1.0;
      const finalDelay = baseDelayMs * delayMultiplier;
      const wordsToAdvance = 1;

      timeoutId = setTimeout(() => {
        const nextIndex = currentIdx + wordsToAdvance;

        if (nextIndex >= rsvpSequence.length) {
          useReadingStore.getState().setIsPlaying(false);
          useReadingStore.getState().setCompletedChapter(currentChapter.title);
          useReadingStore.getState().setWordIndex(Math.min(nextIndex, rsvpSequence.length - 1));
        } else {
          useReadingStore.getState().setWordIndex(nextIndex);
          tick();
        }
      }, finalDelay);
    };

    tick();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying, wpm, rsvpSequence, mode, currentChapter]);

  return {
    rsvpSequence,
  };
}
