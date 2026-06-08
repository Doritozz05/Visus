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

  const clusterOffsets = React.useMemo(() => {
    let offset = 0;
    return clusterChunks.map((chunk) => {
      const start = offset;
      const end = offset + chunk.wordCount;
      offset = end;
      return { start, end };
    });
  }, [clusterChunks]);

  // Master speed reading playback timer loop for Cluster mode
  React.useEffect(() => {
    if (!isPlaying || mode !== "cluster" || clusterChunks.length === 0) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const tick = () => {
      const currentIdx = useReadingStore.getState().wordIndex;
      const baseDelayMs = (60 * 1000) / wpm;

      let activeClusterIdx = -1;
      let low = 0;
      let high = clusterOffsets.length - 1;
      while (low <= high) {
        const mid = (low + high) >> 1;
        const range = clusterOffsets[mid];
        if (currentIdx >= range.start && currentIdx < range.end) {
          activeClusterIdx = mid;
          break;
        } else if (currentIdx < range.start) {
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      }

      if (activeClusterIdx === -1) activeClusterIdx = 0;

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
  }, [isPlaying, wpm, clusterChunks, clusterOffsets, mode, currentChapter]);

  return {
    clusterChunks,
    activeClusterIndex: 0, // Not used by the components, kept for signature compatibility
  };
}
