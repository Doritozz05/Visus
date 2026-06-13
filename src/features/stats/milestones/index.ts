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
import { Day600Milestone } from "./Day600Milestone";
import { Day730Milestone } from "./Day730Milestone";
import { Day1000Milestone } from "./Day1000Milestone";
import { Day1500Milestone } from "./Day1500Milestone";
import { Day2000Milestone } from "./Day2000Milestone";
import { Day3000Milestone } from "./Day3000Milestone";
import { Day5000Milestone } from "./Day5000Milestone";
import { Day9999Milestone } from "./Day9999Milestone";

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
export * from "./Day600Milestone";
export * from "./Day730Milestone";
export * from "./Day1000Milestone";
export * from "./Day1500Milestone";
export * from "./Day2000Milestone";
export * from "./Day3000Milestone";
export * from "./Day5000Milestone";
export * from "./Day9999Milestone";

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
  Day600Milestone,
  Day730Milestone,
  Day1000Milestone,
  Day1500Milestone,
  Day2000Milestone,
  Day3000Milestone,
  Day5000Milestone,
  Day9999Milestone,
];

export const getMilestone = (streak: number): StreakMilestone => {
  return STREAK_MILESTONES.find((m) => m.isMatch(streak)) || Day1Milestone;
};
