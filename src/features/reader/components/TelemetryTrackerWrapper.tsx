"use client";

import * as React from "react";
import { useTelemetryTracker } from "@/features/reader/hooks/useTelemetryTracker";
import { useReadingStore } from "@/features/reader/stores/reading-store";
import { SettingsState } from "@/core/entities/settings";

interface TelemetryTrackerWrapperProps {
  activeBookId: string | null;
  bookTitle: string;
  allBookPages: any[];
  settings: SettingsState;
}

export function TelemetryTrackerWrapper({
  activeBookId,
  bookTitle,
  allBookPages,
  settings,
}: TelemetryTrackerWrapperProps) {
  const wordIndex = useReadingStore((state) => state.wordIndex);
  const isPlaying = useReadingStore((state) => state.isPlaying);
  const wpm = useReadingStore((state) => state.wpm);
  const mode = useReadingStore((state) => state.mode);
  const activeChapterIndex = useReadingStore((state) => state.activeChapterIndex);

  useTelemetryTracker({
    activeBookId,
    bookTitle,
    mode,
    isPlaying,
    wordIndex,
    activeChapterIndex,
    allBookPages,
    theme: settings.general.theme,
    settings,
    wpm,
  });

  return null;
}
