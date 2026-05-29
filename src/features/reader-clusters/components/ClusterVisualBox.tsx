import * as React from "react";

interface ClusterVisualBoxProps {
  clusterChunks: string[];
  activeClusterIndex: number;
}

export function ClusterVisualBox({ clusterChunks, activeClusterIndex }: ClusterVisualBoxProps) {
  return (
    <div className="w-full max-w-xl text-lg md:text-xl text-[#c7c4d7]/50 leading-relaxed text-justify py-8 h-64 overflow-y-auto border border-[#464554]/20 rounded-xl p-6 bg-[#171f33]/40">
      {clusterChunks.map((chunk, index) => {
        const isActive = index === activeClusterIndex;
        return (
          <span 
            key={index} 
            className={`inline-block mr-2 px-1 rounded transition-all ${
              isActive 
                ? "bg-[#c0c1ff]/20 text-[#c0c1ff] font-bold border border-[#c0c1ff]/30 scale-105" 
                : "opacity-40"
            }`}
          >
            {chunk}
          </span>
        );
      })}
    </div>
  );
}
