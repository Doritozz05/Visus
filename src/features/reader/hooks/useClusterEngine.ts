import * as React from "react";
import { generateDynamicClusters } from "@/core/algorithms/clusters";
import { ChapterHtmlData } from "@/features/reader/utils/chapterHtml";

interface UseClusterEngineProps {
  currentChapter: ChapterHtmlData & { words: string[] };
  wordIndex: number;
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

export function useClusterEngine({
  currentChapter,
  wordIndex,
  isPlaying,
  mode,
  wpm,
  currentWordIndexRef,
  setWordIndex,
  setCompletedChapter,
  setIsPlaying,
  playbackListeners,
  latestPositionRef,
}: UseClusterEngineProps) {
  const clusterChunks = React.useMemo(() => {
    return generateDynamicClusters(currentChapter.words, 3);
  }, [currentChapter.words]);

  // Map individual word index to correct dynamic semantic foveal cluster chunk
  const activeClusterIndex = React.useMemo(() => {
    let currentWordOffset = 0;
    for (let i = 0; i < clusterChunks.length; i++) {
      const chunkWordsCount = clusterChunks[i].wordCount;
      if (wordIndex >= currentWordOffset && wordIndex < currentWordOffset + chunkWordsCount) {
        return i;
      }
      currentWordOffset += chunkWordsCount;
    }
    return Math.max(0, clusterChunks.length - 1);
  }, [clusterChunks, wordIndex]);

  // Master speed reading playback timer loop for Cluster mode
  React.useEffect(() => {
    if (!isPlaying || mode !== "cluster" || clusterChunks.length === 0) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const tick = () => {
      const currentIdx = currentWordIndexRef.current;
      const baseDelayMs = (60 * 1000) / wpm;

      let activeClusterIdx = 0;
      let currentWordOffset = 0;
      for (let i = 0; i < clusterChunks.length; i++) {
        const chunkWordsCount = clusterChunks[i].wordCount;
        if (currentIdx >= currentWordOffset && currentIdx < currentWordOffset + chunkWordsCount) {
          activeClusterIdx = i;
          break;
        }
        currentWordOffset += chunkWordsCount;
      }

      const currentChunk = clusterChunks[activeClusterIdx];
      if (!currentChunk) return;

      const delayMultiplier = currentChunk.delayMultiplier || 1.0;
      const finalDelay = baseDelayMs * currentChunk.wordCount * delayMultiplier;
      const wordsToAdvance = currentChunk.wordCount;

      timeoutId = setTimeout(() => {
        const nextIndex = currentIdx + wordsToAdvance;

        if (nextIndex >= currentChapter.words.length) {
          setIsPlaying(false);
          setCompletedChapter(currentChapter.title);
          setWordIndex(Math.min(nextIndex, currentChapter.words.length - 1));
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
  }, [isPlaying, wpm, clusterChunks, mode, currentChapter, playbackListeners, currentWordIndexRef, latestPositionRef, setCompletedChapter, setIsPlaying, setWordIndex]);

  return {
    clusterChunks,
    activeClusterIndex,
  };
}
