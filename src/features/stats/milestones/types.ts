import * as React from "react";

export interface StreakMilestone {
  id: string;
  isMatch: (streak: number) => boolean;
  canvasWidth: number;
  canvasHeight: number;
  gap: number;
  renderPreview: (streak: number) => React.ReactNode;
  drawCanvas: (ctx: CanvasRenderingContext2D, x: number, y: number, streak: number) => void;
}
