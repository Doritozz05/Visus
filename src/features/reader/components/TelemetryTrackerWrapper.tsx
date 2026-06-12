"use client";

import * as React from "react";
import { useTelemetryTracker } from "@/features/reader/hooks/useTelemetryTracker";
import { useReadingStore } from "@/features/reader/stores/reading-store";
import { SettingsState } from "@/core/entities/settings";

interface TelemetryTrackerWrapperProps {
  activeBookId: string | null;
  bookTitle: string;
  mode: "normal" | "rsvp" | "cluster";
  activeChapterIndex: number;
  allBookPages: any[];
  theme: string;
  settings: SettingsState;
}

export function TelemetryTrackerWrapper({
  activeBookId,
  bookTitle,
  mode,
  activeChapterIndex,
  allBookPages,
  theme,
  settings,
}: TelemetryTrackerWrapperProps) {
  // Subscribe to fast-changing state here so only this wrapper re-renders
  const wordIndex = useReadingStore((state) => state.wordIndex);
  const isPlaying = useReadingStore((state) => state.isPlaying);
  const wpm = useReadingStore((state) => state.wpm);

  useTelemetryTracker({
    activeBookId,
    bookTitle,
    mode,
    isPlaying,
    wordIndex,
    activeChapterIndex,
    allBookPages,
    theme,
    settings,
    wpm,
  });

  return null;
}
