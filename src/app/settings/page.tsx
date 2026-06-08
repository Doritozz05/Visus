import { Metadata } from "next";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "Settings | Visus",
  description: "Configure your global visual engine parameters and account.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
