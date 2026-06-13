import { StreakMilestone } from "./types";

export const Day0Milestone: StreakMilestone = {
  id: "day0",
  isMatch: (s) => s === 0,
  canvasWidth: 0,
  canvasHeight: 0,
  gap: 0,
  renderPreview: () => null,
  drawCanvas: () => {}
};
