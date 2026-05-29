import * as React from "react";
import { DynamicCluster } from "@/core/algorithms/clusters";

export interface ClusterSettings {
  highlightStyle?: "spotlight" | "capsule" | "underline";
  activeColor?: string;
  inactiveOpacity?: number;
  blurAmount?: string;
  glowEffect?: "indigo" | "amber" | "green" | "none";
  fontSize?: "lg" | "xl" | "2xl" | "3xl" | "4xl";
  fontWeight?: "font-normal" | "font-medium" | "font-semibold" | "font-bold";
}

interface ClusterVisualBoxProps {
  clusterChunks: string[] | DynamicCluster[];
  activeClusterIndex: number;
  settings?: ClusterSettings;
}

const DEFAULT_SETTINGS: Required<ClusterSettings> = {
  highlightStyle: "spotlight",
  activeColor: "text-white",
  inactiveOpacity: 0.25,
  blurAmount: "0.4px",
  glowEffect: "indigo",
  fontSize: "2xl",
  fontWeight: "font-semibold",
};

export function ClusterVisualBox({
  clusterChunks,
  activeClusterIndex,
  settings: customSettings,
}: ClusterVisualBoxProps) {
  const settings = { ...DEFAULT_SETTINGS, ...customSettings };
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

  const fontSizes = {
    lg: "text-lg md:text-xl",
    xl: "text-xl md:text-2xl",
    "2xl": "text-2xl md:text-3xl leading-relaxed md:leading-loose",
    "3xl": "text-3xl md:text-4xl leading-loose",
    "4xl": "text-4xl md:text-5xl leading-loose",
  };

  const glows = {
    indigo: "text-shadow-glow-indigo text-[#c0c1ff]",
    amber: "text-shadow-glow-amber text-amber-200",
    green: "text-shadow-glow-green text-green-200",
    none: "",
  };

  const sizeClass = fontSizes[settings.fontSize] || fontSizes["2xl"];
  const weightClass = settings.fontWeight;

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl h-[50vh] overflow-y-auto scrollbar-none border border-[#464554]/15 rounded-2xl p-8 md:p-12 bg-[#0f1526]/50 backdrop-blur-xl relative transition-all duration-300"
    >
      {/* Book-Format Continuous Paragraph Flow */}
      <div className={`text-justify whitespace-normal break-words font-sans py-16 ${sizeClass}`}>
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
              highlightClass = `${settings.activeColor} ${glows[settings.glowEffect]}`;
            } else if (settings.highlightStyle === "capsule") {
              highlightClass = `${settings.activeColor} bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-400/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]`;
            } else if (settings.highlightStyle === "underline") {
              highlightClass = `${settings.activeColor} border-b-2 border-indigo-400 px-0.5`;
            }
          } else {
            if (settings.highlightStyle === "capsule") {
              highlightClass = "border border-transparent px-1.5 py-0.5 text-[#c7c4d7]/70";
            } else if (settings.highlightStyle === "underline") {
              highlightClass = "border-b-2 border-transparent px-0.5 text-[#c7c4d7]/70";
            } else {
              highlightClass = "text-[#c7c4d7]/70";
            }
          }

          return (
            <React.Fragment key={index}>
              <span
                data-active={isActive}
                style={isActive ? activeStyle : inactiveStyle}
                className={`inline transition-all duration-300 ${weightClass} ${highlightClass}`}
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
