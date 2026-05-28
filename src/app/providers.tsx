"use client";

import * as React from "react";

/**
 * Global application-wide React Context provider shell.
 * Integrates global state settings, hydration, offline support, and PWA management.
 * 
 * @param props - Children components inside the layout hierarchy.
 * @returns React node wrapped in all global providers.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Base configuration for PWA - Registering Service Worker on client load
  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      (window as any).workbox === undefined
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Visus Service Worker successfully registered. Scope:", reg.scope);
        })
        .catch((error) => {
          console.error("Error registering Visus Service Worker:", error);
        });
    }
  }, []);

  return (
    <>
      {children}
    </>
  );
}
