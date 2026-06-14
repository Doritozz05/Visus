import { Metadata } from "next";
import SettingsClient from "./SettingsClient";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const metadata: Metadata = {
  title: "Settings | Visus",
  description: "Configure your global visual engine parameters and account.",
};

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingSpinner className="h-full" />}>
      <SettingsClient />
    </Suspense>
  );
}
