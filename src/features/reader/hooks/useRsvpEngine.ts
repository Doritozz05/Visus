import * as React from "react";
import { generateRSVPSequence } from "@/core/algorithms/rsvp";
import { ChapterHtmlData } from "@/features/reader/utils/chapterHtml";

interface UseRsvpEngineProps {
  currentChapter: ChapterHtmlData & { words: string[] };
  isPlaying: boolean;
  mode: "rsvp" | "cluster" | "normal";
  wpm: number;
  currentWordIndexRef: React.MutableRefObject<number>;
  setWordIndex: (idx: number) => void;
  setCompletedChapter: (title: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  playbackListeners: Set<(idx: number) => void>;
  latestPositionRef: React.MutableRefObject<{ wordIndex: number; activeChapterIndex: number }>;
}

export function useRsvpEngine({
  currentChapter,
  isPlaying,
  mode,
  wpm,
  currentWordIndexRef,
  setWordIndex,
  setCompletedChapter,
  setIsPlaying,
  playbackListeners,
  latestPositionRef,
}: UseRsvpEngineProps) {
  const rsvpSequence = React.useMemo(() => {
    return generateRSVPSequence(currentChapter.words);
  }, [currentChapter.words]);

  // Master speed reading playback timer loop for RSVP mode
  React.useEffect(() => {
    if (!isPlaying || mode !== "rsvp" || rsvpSequence.length === 0) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const tick = () => {
      const currentIdx = currentWordIndexRef.current;
      const baseDelayMs = (60 * 1000) / wpm;

      const currentWordObj = rsvpSequence[currentIdx];
      const delayMultiplier = currentWordObj ? currentWordObj.delayMultiplier : 1.0;
      const finalDelay = baseDelayMs * delayMultiplier;
      const wordsToAdvance = 1;

      timeoutId = setTimeout(() => {
        const nextIndex = currentIdx + wordsToAdvance;

        if (nextIndex >= rsvpSequence.length) {
          setIsPlaying(false);
          setCompletedChapter(currentChapter.title);
          setWordIndex(Math.min(nextIndex, rsvpSequence.length - 1));
        } else {
          currentWordIndexRef.current = nextIndex;
          latestPositionRef.current.wordIndex = nextIndex;
          playbackListeners.forEach((cb) => cb(nextIndex));

          if (nextIndex % 10 === 0) {
            setWordIndex(nextIndex);
          }
          tick();
        }
      }, finalDelay);
    };

    tick();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying, wpm, rsvpSequence, mode, currentChapter, playbackListeners, currentWordIndexRef, latestPositionRef, setCompletedChapter, setIsPlaying, setWordIndex]);

  return {
    rsvpSequence,
  };
}
