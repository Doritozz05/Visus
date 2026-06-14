import * as React from "react";
import { DynamicCluster } from "@/core/algorithms/clusters";
import { ClusterSettings } from "@/core/entities/settings";
import { useReadingStore } from "../../stores/reading-store";
import { hexToRgba } from "@/lib/color-utils";
import { useSettings } from "@/features/settings/context/settings-context";
import { getFontFamilyStyle, getReaderFontClass } from "@/lib/typography";

interface ClusterVisualBoxProps {
  clusterChunks: string[] | DynamicCluster[];
  settings: ClusterSettings;
}

export function ClusterVisualBox({
  clusterChunks,
  settings,
}: ClusterVisualBoxProps) {
  const { customFonts } = useSettings();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const wordIndex = useReadingStore((state) => state.wordIndex);

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

  const activeClusterIndex = React.useMemo(() => {
    return getClusterIndexForWord(wordIndex);
  }, [wordIndex, getClusterIndexForWord]);

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
    
    const handleScroll = () => {
      const activeChild = container.querySelector(`[data-active="true"]`) as HTMLElement;
      if (activeChild) {
        const containerHeight = container.clientHeight;
        const childOffsetTop = activeChild.offsetTop;
        const childHeight = activeChild.clientHeight;

        const targetScrollTop = Math.max(0, childOffsetTop - containerHeight / 2 + childHeight / 2);

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
  }, [activeClusterIndex]);

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

  const sizeClass = `leading-relaxed md:leading-loose`;
  
  const innerStyle: React.CSSProperties = {
    fontSize: `${settings.fontSize}px`,
    paddingTop: `${140 - settings.fontSize / 2}px`,
    paddingBottom: `${140 - settings.fontSize / 2}px`,
    fontFamily: getFontFamilyStyle(settings.fontFamily, customFonts),
  };

  const isPreset = settings.activeColor in activeColors;
  const activeColorClass = isPreset ? activeColors[settings.activeColor as keyof typeof activeColors] : "";
  const readerFontClass = getReaderFontClass(settings.fontFamily);

  const visibleChunks = React.useMemo(() => {
    const WINDOW_SIZE = 15;
    const start = Math.max(0, activeClusterIndex - WINDOW_SIZE);
    const end = Math.min(normalizedChunks.length - 1, activeClusterIndex + WINDOW_SIZE);

    return normalizedChunks.slice(start, end + 1).map((chunk, idx) => {
      const absoluteIndex = start + idx;
      return {
        ...chunk,
        absoluteIndex,
        isActive: absoluteIndex === activeClusterIndex,
      };
    });
  }, [normalizedChunks, activeClusterIndex]);

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
        className={`text-center whitespace-normal break-words w-full ${readerFontClass} ${sizeClass}`}
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
            textShadow: settings.highlightStyle !== "bold-only"
              ? "0.2px 0 0 currentColor, -0.2px 0 0 currentColor"
              : undefined,
          };

          let highlightClass = "";
          let highlightStyle: React.CSSProperties = isActive ? activeStyle : {};

          if (isActive) {
            if (settings.highlightStyle === "spotlight") {
              const glowClass = isPreset ? (glows[settings.glowEffect as keyof typeof glows] || "") : "";
              highlightClass = `${activeColorClass} ${glowClass}`;
              if (!isPreset) {
                highlightStyle = {
                  ...highlightStyle,
                  color: settings.activeColor,
                  textShadow: settings.glowEffect !== "none"
                    ? `0 0 12px ${hexToRgba(settings.activeColor, 0.55)}, 0 0 2px ${hexToRgba(settings.activeColor, 0.3)}`
                    : undefined
                };
              }
            } else if (settings.highlightStyle === "capsule") {
              highlightClass = `${activeColorClass} bg-primary/10 px-2 py-0.5 rounded border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.15)]`;
              if (!isPreset) {
                highlightStyle = {
                  ...highlightStyle,
                  color: settings.activeColor,
                  backgroundColor: hexToRgba(settings.activeColor, 0.1),
                  borderColor: hexToRgba(settings.activeColor, 0.2),
                  borderWidth: "1px",
                  borderStyle: "solid"
                };
              }
            } else if (settings.highlightStyle === "underline") {
              highlightClass = `${activeColorClass} border-b-2 border-primary px-0.5`;
              if (!isPreset) {
                highlightStyle = {
                  ...highlightStyle,
                  color: settings.activeColor,
                  borderBottom: `2px solid ${settings.activeColor}`
                };
              }
            } else if (settings.highlightStyle === "bold-only") {
              highlightClass = "text-foreground font-extrabold";
            } else if (settings.highlightStyle === "color-only") {
              highlightClass = activeColorClass;
              if (!isPreset) {
                highlightStyle = {
                  ...highlightStyle,
                  color: settings.activeColor
                };
              }
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
                style={isActive ? highlightStyle : inactiveStyle}
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
