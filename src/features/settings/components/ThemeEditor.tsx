"use client";

import * as React from "react";
import { Palette, Sparkles, Layout, Type } from "lucide-react";
import type { CustomTheme } from "@/core/entities/settings";
import { motion } from "framer-motion";
import { FancyTabs } from "@/components/ui/FancyTabs";

// Subcomponents
import { ThemeEditorHeader } from "./ThemeEditor/ThemeEditorHeader";
import { ThemePreviewSandbox } from "./ThemeEditor/ThemePreviewSandbox";
import { BaseColorsTab } from "./ThemeEditor/BaseColorsTab";
import { DecoupledSectionsTab } from "./ThemeEditor/DecoupledSectionsTab";
import { BackgroundEffectsTab } from "./ThemeEditor/BackgroundEffectsTab";
import { AdvancedCssTab } from "./ThemeEditor/AdvancedCssTab";
import { ThemeEditorFooter } from "./ThemeEditor/ThemeEditorFooter";

// Utilities
import { DEFAULT_NEW_THEME, compressImage, deepCloneTheme } from "./ThemeEditor/utils";

interface ThemeEditorProps {
  themeToEdit?: CustomTheme | null;
  onSave: (theme: CustomTheme) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function ThemeEditor({ themeToEdit, onSave, onDelete, onClose }: ThemeEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [containerEl, setContainerEl] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (editorRef.current) {
      setContainerEl(editorRef.current);
    }
  }, []);

  const [activeTab, setActiveTab] = React.useState<"colors" | "components" | "background" | "advanced">("colors");
  const [mobileMode, setMobileMode] = React.useState<"preview" | "edit">("preview");
  
  const [themeState, setThemeState] = React.useState<CustomTheme>(() => {
    if (themeToEdit) return deepCloneTheme(themeToEdit);
    const randId = `theme-custom-${Date.now()}`;
    return DEFAULT_NEW_THEME(randId);
  });
  
  // Capture initial state for reset functionality
  const [initialTheme] = React.useState(() => deepCloneTheme(themeState));

  // History management
  const [history, setHistory] = React.useState<{
    timeline: CustomTheme[],
    index: number
  }>(() => ({
    timeline: [deepCloneTheme(themeState)],
    index: 0
  }));
  const isInternalUpdate = React.useRef(false);

  const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "mobile">("desktop");
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [importJson, setImportJson] = React.useState("");
  const [importError, setImportError] = React.useState<string | null>(null);

  // Automatically switch preview device to mobile if on mobile mode
  React.useEffect(() => {
    if (mobileMode === "preview") {
      setPreviewDevice("mobile");
    }
  }, [mobileMode]);

  // Function to push to history
  const pushToHistory = React.useCallback((newState: CustomTheme) => {
    if (isInternalUpdate.current) return;
    
    setHistory(prev => {
      const newTimeline = prev.timeline.slice(0, prev.index + 1);
      newTimeline.push(deepCloneTheme(newState));
      
      let newIndex = newTimeline.length - 1;
      // Limit history size to 5
      if (newTimeline.length > 5) {
        newTimeline.shift();
        newIndex--;
      }
      
      return {
        timeline: newTimeline,
        index: newIndex
      };
    });
  }, []);

  const undo = React.useCallback(() => {
    if (history.index > 0) {
      isInternalUpdate.current = true;
      const prevIndex = history.index - 1;
      const prevState = history.timeline[prevIndex];
      setThemeState(deepCloneTheme(prevState));
      setHistory(prev => ({ ...prev, index: prevIndex }));
      setTimeout(() => { isInternalUpdate.current = false; }, 0);
    }
  }, [history]);

  const redo = React.useCallback(() => {
    if (history.index < history.timeline.length - 1) {
      isInternalUpdate.current = true;
      const nextIndex = history.index + 1;
      const nextState = history.timeline[nextIndex];
      setThemeState(deepCloneTheme(nextState));
      setHistory(prev => ({ ...prev, index: nextIndex }));
      setTimeout(() => { isInternalUpdate.current = false; }, 0);
    }
  }, [history]);

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
  }, [undo, redo]);

  // Wrap setThemeState to track history
  const updateThemeState = (updater: CustomTheme | ((prev: CustomTheme) => CustomTheme), push: boolean = true) => {
    setThemeState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (push && !isInternalUpdate.current) {
        // Defer history update to avoid side-effects during render phase
        setTimeout(() => pushToHistory(next), 0);
      }
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
      ...preset,
      id: prev.id, // Keep the same ID
      name: prev.name, // Keep the current edited name
      overrideSidebar: false,
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
    const finalTheme = !themeState.name.trim() 
      ? { ...themeState, name: "My custom theme" }
      : themeState;
    onSave(deepCloneTheme(finalTheme));
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(themeState.id);
    }
  };

  const toggleMobileMode = () => {
    setMobileMode(prev => prev === "preview" ? "edit" : "preview");
  };

  return (
    <div ref={editorRef} className="fixed inset-0 z-[100] flex flex-col font-sans animate-fade-in glass-surface">
      <ThemeEditorHeader
        themeName={themeState.name}
        setThemeName={(name) => updateThemeState(prev => ({ ...prev, name }))}
        onUndo={undo}
        onRedo={redo}
        canUndo={history.index > 0}
        canRedo={history.index < history.timeline.length - 1}
        onClose={onClose}
        mobileMode={mobileMode}
        onToggleMobileMode={toggleMobileMode}
      />

      {/* Editor Main Content Area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left Column: Dynamic App Preview Sandbox */}
        <section className={`md:col-span-5 lg:col-span-5 h-full flex-col overflow-hidden ${mobileMode === "preview" ? "flex" : "hidden md:flex"}`}>
          <ThemePreviewSandbox
            themeState={themeState}
            previewDevice={previewDevice}
            setPreviewDevice={setPreviewDevice}
            applyPresetTemplate={applyPresetTemplate}
          />
        </section>

        {/* Right Column: Custom Styling Dashboard */}
        <section className={`md:col-span-7 lg:col-span-7 flex-col h-full overflow-hidden bg-card ${mobileMode === "edit" ? "flex" : "hidden md:flex"}`}>
          {/* Tab Navigation */}
          <FancyTabs
            tabs={[
              { id: "colors", label: "Colors & Typography", icon: Palette },
              { id: "components", label: "Decoupled sections", icon: Layout },
              { id: "background", label: "Backgrounds & Effects", icon: Sparkles },
              { id: "advanced", label: "JSON & Custom CSS", icon: Type }
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as any)}
            layoutId="active-theme-tab"
            variant="line"
            className="bg-card border-border/30 relative z-[190]"
            fullWidth={true}
          />

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {activeTab === "colors" && (
              <BaseColorsTab
                themeState={themeState}
                setThemeState={updateThemeState}
                initialTheme={initialTheme}
                portalContainer={containerEl}
              />
            )}

            {activeTab === "components" && (
              <DecoupledSectionsTab
                themeState={themeState}
                setThemeState={updateThemeState}
                portalContainer={containerEl}
              />
            )}

            {activeTab === "background" && (
              <BackgroundEffectsTab
                themeState={themeState}
                setThemeState={updateThemeState}
                initialTheme={initialTheme}
                imageError={imageError}
                handleImageUpload={handleImageUpload}
                portalContainer={containerEl}
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
