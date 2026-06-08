import * as React from "react";
import { generateDynamicClusters, DynamicCluster } from "@/core/algorithms/clusters";
import { ChapterHtmlData } from "@/features/reader/utils/chapterHtml";
import { useReadingStore } from "@/features/reader/stores/reading-store";

interface UseClusterEngineProps {
  currentChapter: ChapterHtmlData & { words: string[] };
  mode: "rsvp" | "cluster" | "normal";
  wpm: number;
}

export function useClusterEngine({
  currentChapter,
  mode,
  wpm,
}: UseClusterEngineProps) {
  const isPlaying = useReadingStore((state) => state.isPlaying);

  const clusterChunks = React.useMemo(() => {
    return generateDynamicClusters(currentChapter.words, 3);
  }, [currentChapter.words]);

  // Master speed reading playback timer loop for Cluster mode
  React.useEffect(() => {
    if (!isPlaying || mode !== "cluster" || clusterChunks.length === 0) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const tick = () => {
      const currentIdx = useReadingStore.getState().wordIndex;
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
        const latestIdx = useReadingStore.getState().wordIndex;
        const nextIndex = latestIdx + wordsToAdvance;

        if (nextIndex >= currentChapter.words.length) {
          useReadingStore.getState().setIsPlaying(false);
          useReadingStore.getState().setCompletedChapter(currentChapter.title);
          useReadingStore.getState().setWordIndex(Math.min(nextIndex, currentChapter.words.length - 1));
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
  }, [isPlaying, wpm, clusterChunks, mode, currentChapter]);

  return {
    clusterChunks,
    activeClusterIndex: 0, // Not used by the components, kept for signature compatibility
  };
}
