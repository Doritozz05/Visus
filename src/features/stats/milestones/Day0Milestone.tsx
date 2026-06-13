import * as React from "react";
import { StreakMilestone } from "./types";

export const Day0Milestone: StreakMilestone = {
  id: "day0",
  isMatch: (s) => s === 0,
  canvasWidth: 100,
  canvasHeight: 40,
  gap: 10,
  renderPreview: () => (
    <span className="text-2xl font-black text-muted-foreground/40 italic tracking-tighter animate-in fade-in zoom-in duration-500">
      Oops!
    </span>
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    ctx.translate(x, y + 30);
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.font = "italic bold 32px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Oops!", 0, 0);
    ctx.restore();
  }
};
