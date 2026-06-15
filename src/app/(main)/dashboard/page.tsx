import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your reading telemetries and performance stats.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
