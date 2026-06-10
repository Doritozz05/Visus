"use client";

import { useEffect } from "react";

import { AlertCard } from "@/components/ui/AlertCard";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error("Global Error Captured:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-background flex items-center justify-center p-4">
        <AlertCard
          title="Something went wrong"
          description={error.message || "An unexpected error occurred in the application."}
          variant="error"
          action={{
            label: "Retry",
            onClick: () => window.location.reload(),
          }}
        />
      </body>
    </html>
  );
}
