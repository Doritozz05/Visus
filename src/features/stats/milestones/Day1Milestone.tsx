import * as React from "react";
import { Flame } from "lucide-react";
import { StreakMilestone } from "./types";

export const Day1Milestone: StreakMilestone = {
  id: "day1",
  isMatch: (s) => s >= 1 && s < 5,
  canvasWidth: 80,
  canvasHeight: 90,
  gap: 20,
  renderPreview: () => (
    <Flame className="w-8 h-8 text-orange-500 fill-orange-500/10 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)] animate-pulse shrink-0" />
  ),
  drawCanvas: (ctx, x, y) => {
    ctx.save();
    // Center within the 80x90 area
    // Original was filling the whole area: ctx.scale(80 / 24, 90 / 24)
    // New scale: 2.2 (approx 53px)
    const scale = 2.2;
    const dx = (80 - 24 * scale) / 2;
    const dy = (90 - 24 * scale) / 2;
    
    ctx.translate(x + dx, y + dy);
    ctx.scale(scale, scale);

    const flamePath = new Path2D(
      "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
    );

    ctx.shadowColor = "rgba(249, 115, 22, 0.4)";
    ctx.shadowBlur = 25;

    ctx.fillStyle = "rgba(249, 115, 22, 0.15)";
    ctx.fill(flamePath);

    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke(flamePath);

    ctx.restore();
  }
};
