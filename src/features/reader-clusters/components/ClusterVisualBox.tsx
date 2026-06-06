import * as React from "react";
import { DynamicCluster } from "@/core/algorithms/clusters";
import { ClusterSettings } from "@/core/entities/settings";

interface ClusterVisualBoxProps {
  clusterChunks: string[] | DynamicCluster[];
  initialWordIndex: number;
  subscribeToPlayback: (callback: (idx: number) => void) => () => void;
  settings: ClusterSettings;
}

export function ClusterVisualBox({
  clusterChunks,
  initialWordIndex,
  subscribeToPlayback,
  settings,
}: ClusterVisualBoxProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Normalize inputs (accepts both string arrays and DynamicCluster arrays)
  const normalizedChunks = React.useMemo(() => {
    return clusterChunks.map((chunk) => {
      if (typeof chunk === "string") {
        return { text: chunk, wordCount: 1 };
      }
      return { ...chunk, wordCount: chunk.wordCount || 1 };
    });
  }, [clusterChunks]);

  const getClusterIndexForWord = React.useCallback((wIdx: number) => {
    let currentWordOffset = 0;
    for (let i = 0; i < normalizedChunks.length; i++) {
      const chunk = normalizedChunks[i];
      const count = chunk.wordCount || 1;
      if (wIdx >= currentWordOffset && wIdx < currentWordOffset + count) {
        return i;
      }
      currentWordOffset += count;
    }
    return Math.max(0, normalizedChunks.length - 1);
  }, [normalizedChunks]);

  const [localActiveClusterIndex, setLocalActiveClusterIndex] = React.useState(() => {
    let currentWordOffset = 0;
    const initialChunks = clusterChunks.map((chunk) => {
      if (typeof chunk === "string") {
        return { text: chunk, wordCount: 1 };
      }
      return chunk;
    });
    for (let i = 0; i < initialChunks.length; i++) {
      const chunk = initialChunks[i];
      const count = chunk.wordCount || 1;
      if (initialWordIndex >= currentWordOffset && initialWordIndex < currentWordOffset + count) {
        return i;
      }
      currentWordOffset += count;
    }
    return Math.max(0, initialChunks.length - 1);
  });

  // Sync state if initialWordIndex changes (such as manually moving bookmarks or skip/rewind)
  React.useEffect(() => {
    setLocalActiveClusterIndex(getClusterIndexForWord(initialWordIndex));
  }, [initialWordIndex, getClusterIndexForWord]);

  // Subscribe to high-frequency timer ticks
  React.useEffect(() => {
    return subscribeToPlayback((newWordIdx) => {
      setLocalActiveClusterIndex(getClusterIndexForWord(newWordIdx));
    });
  }, [subscribeToPlayback, getClusterIndexForWord]);

  // High-performance foveal sliding window to avoid massive DOM trees and visual cognitive fatigue
  const windowConfig = React.useMemo(() => {
    const windowSize = 18; // optimal count for foveal visual tracking
    const half = Math.floor(windowSize / 2);
    
    let start = Math.max(0, localActiveClusterIndex - half);
    let end = Math.min(normalizedChunks.length, start + windowSize);
    
    // Adjust start offset if near the end of the chapter
    if (end - start < windowSize) {
      start = Math.max(0, end - windowSize);
    }
    
    return {
      start,
      end,
      hasPreceding: start > 0,
      hasSucceeding: end < normalizedChunks.length,
    };
  }, [normalizedChunks.length, localActiveClusterIndex]);

  // Auto-scroll inside container to keep active line centered if there is any minor overflow
  React.useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    const activeChild = container.querySelector(`[data-active="true"]`) as HTMLElement;
    if (activeChild) {
      const containerHeight = container.clientHeight;
      const childOffsetTop = activeChild.offsetTop;
      const childHeight = activeChild.clientHeight;

      const targetScrollTop = childOffsetTop - containerHeight / 2 + childHeight / 2;

      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    }
  }, [localActiveClusterIndex]);

  // Active color styling mapping
  const activeColors = {
    indigo: "text-indigo-500 dark:text-indigo-400 font-bold",
    violet: "text-violet-500 dark:text-violet-400 font-bold",
    emerald: "text-emerald-600 dark:text-emerald-400 font-bold",
    amber: "text-amber-600 dark:text-amber-400 font-bold",
    rose: "text-rose-500 dark:text-rose-400 font-bold",
    blue: "text-blue-500 dark:text-blue-400 font-bold",
    white: "text-foreground font-bold",
  };

  const glows = {
    indigo: "text-shadow-glow-indigo",
    amber: "text-shadow-glow-amber",
    green: "text-shadow-glow-green",
    none: "",
  };

  const fontFamilies = {
    inter: "font-sans",
    atkinson: "font-sans font-medium tracking-wide",
    dyslexic: "font-sans font-normal tracking-wide",
  };

  const sizeClass = `leading-relaxed md:leading-loose`;
  const sizeStyle: React.CSSProperties = {
    fontSize: `${settings.fontSize}px`,
  };

  const activeColorClass = activeColors[settings.activeColor as keyof typeof activeColors] || activeColors.white;
  const fontFamilyClass = fontFamilies[settings.fontFamily as keyof typeof fontFamilies] || fontFamilies.inter;

  // Sliced chunks within sliding window
  const visibleChunks = React.useMemo(() => {
    return normalizedChunks.slice(windowConfig.start, windowConfig.end).map((chunk, index) => {
      const absoluteIndex = windowConfig.start + index;
      return {
        ...chunk,
        absoluteIndex,
        isActive: absoluteIndex === localActiveClusterIndex,
      };
    });
  }, [normalizedChunks, windowConfig, localActiveClusterIndex]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-3xl h-[280px] overflow-y-auto scrollbar-none border border-border/20 rounded-2xl p-8 bg-card/45 backdrop-blur-xl relative transition-all duration-300 flex items-center justify-center shadow-xl"
    >
      <div 
        style={sizeStyle}
        className={`text-center whitespace-normal break-words w-full ${fontFamilyClass} ${sizeClass}`}
      >
        {/* Preceding text fade indicator */}
        {windowConfig.hasPreceding && (
          <span className="text-muted-foreground/35 select-none font-mono text-[0.8em] mr-2">...</span>
        )}

        {visibleChunks.map((chunk) => {
          const isActive = chunk.isActive;

          const inactiveStyle: React.CSSProperties = {
            opacity: settings.inactiveOpacity,
            filter: settings.blurAmount ? `blur(${settings.blurAmount})` : undefined,
          };

          const activeStyle: React.CSSProperties = {
            opacity: 1,
            filter: "blur(0px)",
            transform: "scale(1.05)",
            display: "inline-block",
          };

          let highlightClass = "";
          if (isActive) {
            if (settings.highlightStyle === "spotlight") {
              highlightClass = `${activeColorClass} ${glows[settings.glowEffect as keyof typeof glows] || ""}`;
            } else if (settings.highlightStyle === "capsule") {
              highlightClass = `${activeColorClass} bg-primary/10 px-2 py-0.5 rounded border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.15)]`;
            } else if (settings.highlightStyle === "underline") {
              highlightClass = `${activeColorClass} border-b-2 border-primary px-0.5`;
            } else if (settings.highlightStyle === "bold-only") {
              highlightClass = "text-foreground font-extrabold";
            } else if (settings.highlightStyle === "color-only") {
              highlightClass = activeColorClass;
            }
          } else {
            if (settings.highlightStyle === "capsule") {
              highlightClass = "border border-transparent px-2 py-0.5 text-muted-foreground/60";
            } else if (settings.highlightStyle === "underline") {
              highlightClass = "border-b-2 border-transparent px-0.5 text-muted-foreground/60";
            } else {
              highlightClass = "text-muted-foreground/60";
            }
          }

          return (
            <React.Fragment key={chunk.absoluteIndex}>
              <span
                data-active={isActive}
                style={isActive ? activeStyle : inactiveStyle}
                className={`inline-block transition-all duration-300 mx-1.5 ${highlightClass}`}
              >
                {chunk.text}
              </span>
            </React.Fragment>
          );
        })}

        {/* Succeeding text fade indicator */}
        {windowConfig.hasSucceeding && (
          <span className="text-muted-foreground/35 select-none font-mono text-[0.8em] ml-2">...</span>
        )}
      </div>
    </div>
  );
}
