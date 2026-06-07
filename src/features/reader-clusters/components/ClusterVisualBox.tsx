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

  // Scroll position tracking ref
  const lastScrollTopRef = React.useRef<number>(-1);

  // Reset scroll tracker when the chapter chunks change
  React.useEffect(() => {
    lastScrollTopRef.current = -1;
  }, [clusterChunks]);

  // Auto-scroll inside container to keep active line centered
  React.useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Use requestAnimationFrame to ensure the DOM has updated and painted the new active child
    const handleScroll = () => {
      const activeChild = container.querySelector(`[data-active="true"]`) as HTMLElement;
      if (activeChild) {
        const containerHeight = container.clientHeight;
        const childOffsetTop = activeChild.offsetTop;
        const childHeight = activeChild.clientHeight;

        const targetScrollTop = Math.max(0, childOffsetTop - containerHeight / 2 + childHeight / 2);

        // Only scroll if the target position has changed significantly (e.g. more than 2px)
        // This prevents scroll stuttering and keeps it static during same-line reading
        if (Math.abs(lastScrollTopRef.current - targetScrollTop) > 2) {
          lastScrollTopRef.current = targetScrollTop;
          container.scrollTo({
            top: targetScrollTop,
            behavior: "smooth",
          });
        }
      }
    };

    const rafId = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(rafId);
  }, [localActiveClusterIndex]);

  // Active color styling mapping
  const activeColors = {
    indigo: "text-indigo-500 dark:text-indigo-400",
    violet: "text-violet-500 dark:text-violet-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    rose: "text-rose-500 dark:text-rose-400",
    blue: "text-blue-500 dark:text-blue-400",
    white: "text-foreground",
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
  
  // Calculate dynamic padding so the active line centers perfectly vertically
  // regardless of font size, within the 280px high container.
  const innerStyle: React.CSSProperties = {
    fontSize: `${settings.fontSize}px`,
    paddingTop: `${140 - settings.fontSize / 2}px`,
    paddingBottom: `${140 - settings.fontSize / 2}px`,
  };

  const activeColorClass = activeColors[settings.activeColor as keyof typeof activeColors] || activeColors.white;
  const fontFamilyClass = fontFamilies[settings.fontFamily as keyof typeof fontFamilies] || fontFamilies.inter;

  // Map all chunks in the chapter (static layout) instead of slicing a sliding window
  const visibleChunks = React.useMemo(() => {
    return normalizedChunks.map((chunk, index) => {
      return {
        ...chunk,
        absoluteIndex: index,
        isActive: index === localActiveClusterIndex,
      };
    });
  }, [normalizedChunks, localActiveClusterIndex]);

  // Premium lens focus fade gradient mask
  const maskStyle: React.CSSProperties = {
    maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
  };

  return (
    <div
      ref={containerRef}
      style={maskStyle}
      className="w-full max-w-3xl h-[280px] overflow-y-auto scrollbar-none border border-border/20 rounded-2xl px-8 py-0 bg-card/45 backdrop-blur-xl relative transition-all duration-300 shadow-xl"
    >
      <div 
        style={innerStyle}
        className={`text-center whitespace-normal break-words w-full ${fontFamilyClass} ${sizeClass}`}
      >
        {visibleChunks.map((chunk) => {
          const isActive = chunk.isActive;

          const inactiveStyle: React.CSSProperties = {
            opacity: settings.inactiveOpacity,
            filter: settings.blurAmount && settings.blurAmount !== "0px" ? `blur(${settings.blurAmount})` : undefined,
            transform: "scale(1.0)",
          };

          const activeStyle: React.CSSProperties = {
            opacity: 1,
            filter: "blur(0px)",
            transform: "scale(1.03)",
            // Simulate subtle bolding without changing the layout footprint to prevent any line wraps
            textShadow: settings.highlightStyle !== "bold-only"
              ? "0.2px 0 0 currentColor, -0.2px 0 0 currentColor"
              : undefined,
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
            } else if (settings.highlightStyle === "bold-only") {
              highlightClass = "text-muted-foreground/35 font-extrabold";
            } else {
              highlightClass = "text-muted-foreground/60";
            }
          }

          return (
            <React.Fragment key={chunk.absoluteIndex}>
              <span
                data-active={isActive}
                style={isActive ? activeStyle : inactiveStyle}
                className={`inline-block whitespace-nowrap transition-all duration-150 ease-out mx-0.5 ${highlightClass}`}
              >
                {chunk.text}
              </span>
              {" "}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
