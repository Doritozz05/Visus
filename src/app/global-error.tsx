"use client";

import { useEffect } from "react";

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
      <body>
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
          <h2>Something went wrong</h2>
          <p>{error.message || "An unexpected error occurred in the application."}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </body>
    </html>
  );
}
