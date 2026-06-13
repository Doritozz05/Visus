import { Metadata } from "next";
import { ThemePageClient } from "./ThemePageClient";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Theme Designer | Visus",
  description: "Customize and design premium visual themes for Visus.",
};

export default function ThemePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <ThemePageClient />
    </Suspense>
  );
}
