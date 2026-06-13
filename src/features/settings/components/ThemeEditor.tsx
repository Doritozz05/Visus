"use client";

import * as React from "react";
import { Palette, Sparkles, Layout, Type } from "lucide-react";
import type { CustomTheme } from "@/core/entities/settings";

// Subcomponents
import { ThemeEditorHeader } from "./ThemeEditor/ThemeEditorHeader";
import { ThemePreviewSandbox } from "./ThemeEditor/ThemePreviewSandbox";
import { BaseColorsTab } from "./ThemeEditor/BaseColorsTab";
import { DecoupledSectionsTab } from "./ThemeEditor/DecoupledSectionsTab";
import { BackgroundEffectsTab } from "./ThemeEditor/BackgroundEffectsTab";
import { AdvancedCssTab } from "./ThemeEditor/AdvancedCssTab";
import { ThemeEditorFooter } from "./ThemeEditor/ThemeEditorFooter";

// Utilities
import { DEFAULT_NEW_THEME, compressImage } from "./ThemeEditor/utils";

interface ThemeEditorProps {
  themeToEdit?: CustomTheme | null;
  onSave: (theme: CustomTheme) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function ThemeEditor({ themeToEdit, onSave, onDelete, onClose }: ThemeEditorProps) {
  const [activeTab, setActiveTab] = React.useState<"colors" | "components" | "background" | "advanced">("colors");
  const [themeState, setThemeState] = React.useState<CustomTheme>(() => {
    if (themeToEdit) return { ...themeToEdit };
    const randId = `theme-custom-${Date.now()}`;
    return DEFAULT_NEW_THEME(randId);
  });
  
  // Capture initial state for reset functionality
  const [initialTheme] = React.useState({ ...themeState });

  // History management
  const [history, setHistory] = React.useState<CustomTheme[]>([themeState]);
  const [historyIndex, setHistoryIndex] = React.useState(0);
  const isInternalUpdate = React.useRef(false);

  const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "mobile">("desktop");
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [importJson, setImportJson] = React.useState("");
  const [importError, setImportError] = React.useState<string | null>(null);

  // Function to push to history (debounced or on important changes)
  const pushToHistory = (newState: CustomTheme) => {
    if (isInternalUpdate.current) return;
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    
    // Limit history size to 5 as requested
    if (newHistory.length > 5) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = React.useCallback(() => {
    if (historyIndex > 0) {
      isInternalUpdate.current = true;
      const prevIndex = historyIndex - 1;
      const prevState = history[prevIndex];
      setThemeState(prevState);
      setHistoryIndex(prevIndex);
      setTimeout(() => { isInternalUpdate.current = false; }, 0);
    }
  }, [history, historyIndex]);

  const redo = React.useCallback(() => {
    if (historyIndex < history.length - 1) {
      isInternalUpdate.current = true;
      const nextIndex = historyIndex + 1;
      const nextState = history[nextIndex];
      setThemeState(nextState);
      setHistoryIndex(nextIndex);
      setTimeout(() => { isInternalUpdate.current = false; }, 0);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, undo, redo]);

  // Wrap setThemeState to track history
  const updateThemeState = (updater: CustomTheme | ((prev: CustomTheme) => CustomTheme), push: boolean = true) => {
    setThemeState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (push) pushToHistory(next);
      return next;
    });
  };

  // Resize and compress image helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setImageError("Image size too large (max 8MB file size allowed before compression)");
      return;
    }

    setImageError(null);
    try {
      const base64Str = await compressImage(file);
      updateThemeState(prev => ({
        ...prev,
        bgType: "image",
        bgImageUrl: base64Str
      }));
    } catch (err) {
      setImageError("Failed to compress and load background image.");
    }
  };

  const applyPresetTemplate = (preset: any) => {
    updateThemeState(prev => ({
      ...prev,
      isDark: preset.isDark,
      background: preset.background,
      foreground: preset.foreground,
      border: preset.border,
      cardBackground: preset.cardBackground,
      cardForeground: preset.cardForeground,
      accent: preset.accent,
      accentForeground: preset.accentForeground,
      muted: preset.muted,
      mutedForeground: preset.mutedForeground,
      cardRadius: preset.cardRadius,
      cardShadow: preset.cardShadow,
      overrideSidebar: false,
      overrideReader: false,
      bgType: "solid"
    }));
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(themeState, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportFile = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(themeState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${themeState.name.toLowerCase().replace(/\s+/g, "_")}_theme.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = () => {
    try {
      setImportError(null);
      const parsed = JSON.parse(importJson);
      if (!parsed.name || !parsed.background || !parsed.foreground) {
        setImportError("Invalid theme JSON. Required fields name, background, foreground are missing.");
        return;
      }
      const importedTheme: CustomTheme = {
        ...DEFAULT_NEW_THEME(themeState.id),
        ...parsed,
        id: themeState.id // keep current ID to save over
      };
      updateThemeState(importedTheme);
      setImportJson("");
    } catch (err) {
      setImportError("Invalid JSON structure. Please check the syntax.");
    }
  };

  const handleSave = () => {
    if (!themeState.name.trim()) {
      themeState.name = "My custom theme";
    }
    onSave(themeState);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(themeState.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-[100] flex flex-col font-sans animate-fade-in">
      <ThemeEditorHeader
        themeName={themeState.name}
        setThemeName={(name) => updateThemeState(prev => ({ ...prev, name }))}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onClose={onClose}
      />

      {/* Editor Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Dynamic App Preview Sandbox */}
        <ThemePreviewSandbox
          themeState={themeState}
          previewDevice={previewDevice}
          setPreviewDevice={setPreviewDevice}
          applyPresetTemplate={applyPresetTemplate}
        />

        {/* Right Column: Custom Styling Dashboard */}
        <section className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-card">
          {/* Tab Navigation */}
          <nav className="flex border-b border-border/30 bg-accent/15 shrink-0">
            {[
              { id: "colors", label: "Colors & Typography", icon: Palette },
              { id: "components", label: "Decoupled sections", icon: Layout },
              { id: "background", label: "Backgrounds & Effects", icon: Sparkles },
              { id: "advanced", label: "JSON & Custom CSS", icon: Type }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-bold font-mono uppercase tracking-wider border-b-2 transition-all ${activeTab === tab.id ? "border-primary text-primary bg-card" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/5"}`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === "colors" && (
              <BaseColorsTab
                themeState={themeState}
                setThemeState={updateThemeState}
                initialTheme={initialTheme}
              />
            )}

            {activeTab === "components" && (
              <DecoupledSectionsTab
                themeState={themeState}
                setThemeState={updateThemeState}
              />
            )}

            {activeTab === "background" && (
              <BackgroundEffectsTab
                themeState={themeState}
                setThemeState={updateThemeState}
                initialTheme={initialTheme}
                imageError={imageError}
                handleImageUpload={handleImageUpload}
              />
            )}

            {activeTab === "advanced" && (
              <AdvancedCssTab
                themeState={themeState}
                setThemeState={updateThemeState}
                copied={copied}
                handleCopyJson={handleCopyJson}
                handleExportFile={handleExportFile}
                importJson={importJson}
                setImportJson={setImportJson}
                handleImportJson={handleImportJson}
                importError={importError}
              />
            )}
          </div>

          <ThemeEditorFooter
            themeName={themeState.name}
            isEditing={!!themeToEdit}
            onSave={handleSave}
            onCancel={onClose}
            onDelete={onDelete ? handleDelete : undefined}
          />
        </section>
      </div>
    </div>
  );
}
