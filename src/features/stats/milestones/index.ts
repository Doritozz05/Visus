import { StreakMilestone } from "./types";
import { Day0Milestone } from "./Day0Milestone";
import { Day1Milestone } from "./Day1Milestone";
import { Day5Milestone } from "./Day5Milestone";
import { Day15Milestone } from "./Day15Milestone";
import { Day30Milestone } from "./Day30Milestone";
import { Day50Milestone } from "./Day50Milestone";
import { Day75Milestone } from "./Day75Milestone";
import { Day100Milestone } from "./Day100Milestone";
import { Day150Milestone } from "./Day150Milestone";
import { Day200Milestone } from "./Day200Milestone";
import { Day250Milestone } from "./Day250Milestone";
import { Day300Milestone } from "./Day300Milestone";
import { Day365Milestone } from "./Day365Milestone";
import { Day500Milestone } from "./Day500Milestone";

export * from "./types";
export * from "./Day0Milestone";
export * from "./Day1Milestone";
export * from "./Day5Milestone";
export * from "./Day15Milestone";
export * from "./Day30Milestone";
export * from "./Day50Milestone";
export * from "./Day75Milestone";
export * from "./Day100Milestone";
export * from "./Day150Milestone";
export * from "./Day200Milestone";
export * from "./Day250Milestone";
export * from "./Day300Milestone";
export * from "./Day365Milestone";
export * from "./Day500Milestone";

export const STREAK_MILESTONES: StreakMilestone[] = [
  Day0Milestone,
  Day1Milestone,
  Day5Milestone,
  Day15Milestone,
  Day30Milestone,
  Day50Milestone,
  Day75Milestone,
  Day100Milestone,
  Day150Milestone,
  Day200Milestone,
  Day250Milestone,
  Day300Milestone,
  Day365Milestone,
  Day500Milestone,
];

export const getMilestone = (streak: number): StreakMilestone => {
  return STREAK_MILESTONES.find((m) => m.isMatch(streak)) || Day1Milestone;
};
