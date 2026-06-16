import * as React from "react";
import { DynamicCluster } from "@/core/algorithms/clusters";
import { ClusterSettings } from "@/core/entities/settings";
import { useReadingStore } from "../../stores/reading-store";
import { hexToRgba, resolveColor } from "@/lib/color-utils";
import { BUILTIN_THEMES } from "@/core/config/themes";
import { useSettings } from "@/features/settings/context/settings-context";
import { getFontFamilyStyle, getReaderFontClass } from "@/lib/typography";
import { useClusterMeasurements } from "./useClusterMeasurements";

interface ClusterVisualBoxProps {
  clusterChunks: string[] | DynamicCluster[];
  settings: ClusterSettings;
}

export function ClusterVisualBox({
  clusterChunks,
  settings,
}: ClusterVisualBoxProps) {
  const { settings: globalSettings, customFonts } = useSettings();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollCanvasRef = React.useRef<HTMLDivElement>(null);

  const wordIndex = useReadingStore((state) => state.wordIndex);
  const [actualContainerHeight, setActualContainerHeight] = React.useState(450);

  // Measure the container's actual height
  React.useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setActualContainerHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Normalize inputs
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

  // Off-screen static measurements
  const { measurements, isMeasured } = useClusterMeasurements(scrollCanvasRef, [
    normalizedChunks,
    settings.fontSize,
    settings.fontFamily,
  ]);

  // Render variables pre-calculated
  const containerHeight = actualContainerHeight;
  const paddingY = (containerHeight / 2) - settings.fontSize / 2;
  const scrollCanvasHeight = scrollCanvasRef.current?.scrollHeight || 0;

  // Focal point around 33% of the container (Top third)
  const focalPointY = containerHeight / 3;

  const [translateY, setTranslateY] = React.useState(0);

  // Discrete line-by-line scrolling
  // Only triggers a scroll when the offsetTop (line position) changes
  React.useEffect(() => {
    if (isMeasured && measurements[activeClusterIndex]) {
      const m = measurements[activeClusterIndex];
      // Target Y to position the active chunk at the focal point
      let targetY = -(m.offsetTop - focalPointY + (m.offsetHeight / 2));

      // Keep within bounds
      const maxScroll = Math.max(0, scrollCanvasHeight - containerHeight);
      targetY = Math.max(-maxScroll, Math.min(0, targetY));

      setTranslateY(targetY);
    }
  }, [activeClusterIndex, isMeasured, measurements, scrollCanvasHeight, focalPointY, containerHeight]);

  // Colors & Styling
  const getThemeColor = (key: string) => {
    const themeId = globalSettings.general.theme;
    const customThemes = globalSettings.general.customThemes || [];
    const builtIn = BUILTIN_THEMES.find(t => t.id === themeId);
    if (builtIn) {
      if (key === "primary") return builtIn.accent;
      if (key === "foreground") return builtIn.foreground;
      if (key === "muted") return builtIn.mutedForeground;
    }
    const custom = customThemes.find(t => t.id === themeId);
    if (custom) {
      if (key === "primary") return custom.accent;
      if (key === "foreground") return custom.foreground;
      if (key === "muted") return custom.mutedForeground;
    }
    return key;
  };

  const activeColors = {
    indigo: "text-indigo-500 dark:text-indigo-400",
    violet: "text-violet-500 dark:text-violet-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
    rose: "text-rose-500 dark:text-rose-400",
    blue: "text-blue-500 dark:text-blue-400",
    white: "text-foreground",
  };

  const sizeClass = `leading-relaxed md:leading-loose`;

  const innerStyle: React.CSSProperties = {
    fontSize: `${settings.fontSize}px`,
    paddingTop: `${paddingY}px`,
    paddingBottom: `${paddingY}px`,
    fontFamily: getFontFamilyStyle(settings.fontFamily, customFonts),
    transform: `translate3d(0, ${translateY}px, 0)`,
    // Smooth discrete scrolling only when translating
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    willChange: 'transform'
  };

  const resolvedActiveColor = settings.activeColor === "primary" ? getThemeColor("primary") : settings.activeColor;
  const resolvedGlowColor = settings.glowEffect === "none" ? "none" : (settings.glowEffect === "primary" ? getThemeColor("primary") : resolveColor(settings.glowEffect));
  const isPreset = resolvedActiveColor in activeColors;
  const readerFontClass = getReaderFontClass(settings.fontFamily);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-3xl h-[360px] md:h-[380px] lg:h-[385px] overflow-hidden border border-border/20 rounded-2xl bg-card relative shadow-xl"
    >
      <div
        ref={scrollCanvasRef}
        style={innerStyle}
        className={`w-full relative px-8 text-center whitespace-normal break-words ${readerFontClass} ${sizeClass}`}
      >
        {normalizedChunks.map((chunk, idx) => {
          const isActive = idx === activeClusterIndex;

          const inactiveStyle: React.CSSProperties = {
            opacity: settings.inactiveOpacity,
            filter: settings.blurAmount && settings.blurAmount !== "0px" ? `blur(${settings.blurAmount})` : undefined,
            transform: "scale(1.0)",
          };

          const activeStyle: React.CSSProperties = {
            opacity: 1,
            filter: "blur(0px)",
            transform: "scale(1.03)",
            textShadow: settings.highlightStyle !== "bold-only" && settings.highlightStyle !== "color-only"
              ? "0.2px 0 0 currentColor, -0.2px 0 0 currentColor"
              : undefined,
          };

          let highlightClass = "";
          let highlightStyle: React.CSSProperties = isActive ? { ...activeStyle } : { ...inactiveStyle };

          if (isActive) {
            if (settings.highlightStyle === "spotlight") {
              highlightStyle.color = resolvedActiveColor;
              if (resolvedGlowColor !== "none") {
                highlightStyle.textShadow = `0 0 12px ${hexToRgba(resolvedGlowColor, 0.55)}, 0 0 2px ${hexToRgba(resolvedGlowColor, 0.3)}`;
              }
            } else if (settings.highlightStyle === "capsule") {
              highlightStyle.color = resolvedActiveColor;
              highlightStyle.backgroundColor = hexToRgba(resolvedActiveColor, 0.1);
              highlightStyle.borderColor = hexToRgba(resolvedActiveColor, 0.2);
              highlightStyle.borderWidth = "1px";
              highlightStyle.borderStyle = "solid";
              highlightStyle.boxShadow = `0 0 15px ${hexToRgba(resolvedActiveColor, 0.15)}`;
              highlightStyle.padding = "2px 6px";
              highlightStyle.borderRadius = "6px";
            } else if (settings.highlightStyle === "underline") {
              highlightStyle.color = resolvedActiveColor;
              highlightStyle.borderBottom = `2px solid ${resolvedActiveColor}`;
              highlightStyle.paddingBottom = "1px";
            } else if (settings.highlightStyle === "bold-only") {
              highlightStyle.color = resolvedActiveColor;
              // Simulate bold without layout shifts using sub-pixel strokes
              highlightStyle.WebkitTextStroke = "0.04em currentColor";
              highlightStyle.textShadow = "0.02em 0 0 currentColor, -0.02em 0 0 currentColor";
            } else if (settings.highlightStyle === "color-only") {
              highlightStyle.color = resolvedActiveColor;
            }
          } else {
            if (settings.highlightStyle === "capsule") {
              highlightClass = "text-muted-foreground";
              highlightStyle.borderWidth = "1px";
              highlightStyle.borderStyle = "solid";
              highlightStyle.borderColor = "transparent";
              highlightStyle.padding = "2px 6px";
              highlightStyle.borderRadius = "6px";
            } else if (settings.highlightStyle === "underline") {
              highlightClass = "text-muted-foreground";
              highlightStyle.borderBottom = "2px solid transparent";
              highlightStyle.paddingBottom = "1px";
            } else if (settings.highlightStyle === "bold-only") {
              highlightClass = "text-muted-foreground font-normal";
              highlightStyle.fontWeight = "normal";
            } else {
              highlightClass = "text-muted-foreground";
            }
          }

          const activePresetClass = isActive && isPreset && settings.highlightStyle !== "bold-only"
            ? activeColors[resolvedActiveColor as keyof typeof activeColors]
            : "";

          return (
            <span
              key={`chunk-${idx}`}
              data-chunk-index={idx}
              style={highlightStyle}
              className={`inline-block whitespace-nowrap transition-all duration-150 ease-out mx-1 sm:mx-1.5 md:mx-2 ${highlightClass} ${activePresetClass}`}
            >
              {chunk.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
