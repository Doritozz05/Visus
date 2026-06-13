import { StreakMilestone } from "./types";
import { Day0Milestone } from "./Day0Milestone";
import { Day1Milestone } from "./Day1Milestone";
import { Day5Milestone } from "./Day5Milestone";
import { Day15Milestone } from "./Day15Milestone";

export * from "./types";
export * from "./Day0Milestone";
export * from "./Day1Milestone";
export * from "./Day5Milestone";
export * from "./Day15Milestone";

export const STREAK_MILESTONES: StreakMilestone[] = [
  Day0Milestone,
  Day1Milestone,
  Day5Milestone,
  Day15Milestone
];

export const getMilestone = (streak: number): StreakMilestone => {
  return STREAK_MILESTONES.find((m) => m.isMatch(streak)) || Day1Milestone;
};
