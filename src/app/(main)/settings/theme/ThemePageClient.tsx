"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSettings } from "@/features/settings/context/settings-context";
import { ThemeEditor } from "@/features/settings/components/ThemeEditor";
import type { CustomTheme } from "@/core/entities/settings";

export function ThemePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeId = searchParams.get("id");
  const { settings, updateGeneralSettings } = useSettings();
  const { customThemes = [], theme: currentTheme } = settings.general;

  // Retrieve theme to edit if id is specified
  const themeToEdit = React.useMemo(() => {
    if (!themeId || themeId === "new") return null;
    return customThemes.find((t) => t.id === themeId) || null;
  }, [themeId, customThemes]);

  const handleSaveTheme = (newTheme: CustomTheme) => {
    const exists = customThemes.some((t) => t.id === newTheme.id);
    let updatedThemes: CustomTheme[];
    if (exists) {
      updatedThemes = customThemes.map((t) => (t.id === newTheme.id ? newTheme : t));
    } else {
      updatedThemes = [...customThemes, newTheme];
    }
    updateGeneralSettings({
      customThemes: updatedThemes,
      theme: newTheme.id
    });
    router.push("/settings");
  };

  const handleDeleteTheme = (id: string) => {
    const updatedThemes = customThemes.filter((t) => t.id !== id);
    const fallbackTheme = currentTheme === id ? "light" : currentTheme;
    updateGeneralSettings({
      customThemes: updatedThemes,
      theme: fallbackTheme
    });
    router.push("/settings");
  };

  const handleClose = () => {
    router.push("/settings");
  };

  return (
    <ThemeEditor
      themeToEdit={themeToEdit}
      onSave={handleSaveTheme}
      onDelete={handleDeleteTheme}
      onClose={handleClose}
    />
  );
}
