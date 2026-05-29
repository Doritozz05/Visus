import * as React from "react";
import { DynamicCluster } from "@/core/algorithms/clusters";
import { ClusterSettings } from "@/core/entities/settings";

interface ClusterVisualBoxProps {
  clusterChunks: string[] | DynamicCluster[];
  activeClusterIndex: number;
  settings: ClusterSettings;
}

export function ClusterVisualBox({
  clusterChunks,
  activeClusterIndex,
  settings,
}: ClusterVisualBoxProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Normalize inputs (accepts both string arrays and DynamicCluster arrays)
  const normalizedChunks = React.useMemo(() => {
    return clusterChunks.map((chunk) => {
      if (typeof chunk === "string") {
        return { text: chunk };
      }
      return chunk;
    });
  }, [clusterChunks]);

  // Center scroll automatically to keep the active reading line perfectly focused
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
  }, [activeClusterIndex]);

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
    dyslexic: "font-sans font-bold tracking-widest",
  };

  const sizeClass = `leading-relaxed md:leading-loose`;
  const sizeStyle: React.CSSProperties = {
    fontSize: `${settings.fontSize}px`,
  };

  const activeColorClass = activeColors[settings.activeColor as keyof typeof activeColors] || activeColors.white;
  const fontFamilyClass = fontFamilies[settings.fontFamily as keyof typeof fontFamilies] || fontFamilies.inter;

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl h-[45vh] overflow-y-auto scrollbar-none border border-border/20 rounded-2xl p-8 md:p-12 bg-card/45 backdrop-blur-xl relative transition-all duration-300"
    >
      {/* Book-Format Continuous Paragraph Flow */}
      <div 
        style={sizeStyle}
        className={`text-justify whitespace-normal break-words py-16 ${fontFamilyClass} ${sizeClass}`}
      >
        {normalizedChunks.map((chunk, index) => {
          const isActive = index === activeClusterIndex;

          const inactiveStyle: React.CSSProperties = {
            opacity: settings.inactiveOpacity,
            filter: settings.blurAmount ? `blur(${settings.blurAmount})` : undefined,
          };

          const activeStyle: React.CSSProperties = {
            opacity: 1,
            filter: "blur(0px)",
          };

          let highlightClass = "";
          if (isActive) {
            if (settings.highlightStyle === "spotlight") {
              highlightClass = `${activeColorClass} ${glows[settings.glowEffect as keyof typeof glows] || ""}`;
            } else if (settings.highlightStyle === "capsule") {
              highlightClass = `${activeColorClass} bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.15)]`;
            } else if (settings.highlightStyle === "underline") {
              highlightClass = `${activeColorClass} border-b-2 border-primary px-0.5`;
            } else if (settings.highlightStyle === "bold-only") {
              highlightClass = "text-foreground font-extrabold";
            } else if (settings.highlightStyle === "color-only") {
              highlightClass = activeColorClass;
            }
          } else {
            if (settings.highlightStyle === "capsule") {
              highlightClass = "border border-transparent px-1.5 py-0.5 text-muted-foreground/75";
            } else if (settings.highlightStyle === "underline") {
              highlightClass = "border-b-2 border-transparent px-0.5 text-muted-foreground/75";
            } else {
              highlightClass = "text-muted-foreground/75";
            }
          }

          return (
            <React.Fragment key={index}>
              <span
                data-active={isActive}
                style={isActive ? activeStyle : inactiveStyle}
                className={`inline transition-all duration-300 ${highlightClass}`}
              >
                {chunk.text}
              </span>
              {index < normalizedChunks.length - 1 && " "}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
