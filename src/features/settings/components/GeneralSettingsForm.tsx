"use client";

import * as React from "react";
import { Palette, CheckCircle, Settings2, Edit, Trash2, Plus, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/features/settings/context/settings-context";
import type { GeneralSettings, CustomTheme } from "@/core/entities/settings";
import { ColorSelector } from "@/components/ui/ColorSelector";
import { useContextMenu, ContextMenuItem } from "@/components/ui/ContextMenu";
import { PRESETS_TEMPLATES, DEFAULT_NEW_THEME, deepCloneTheme } from "./ThemeEditor/utils";

export function GeneralSettingsForm() {
  const router = useRouter();
  const { showMenu } = useContextMenu();
  const { settings, updateGeneralSettings } = useSettings();
  const {
    theme,
    accentColor,
    uiFont,
    glassmorphism,
    reducedMotion,
    soundEffects,
    readingTimerReminder,
    yearlyReadingGoal,
    customThemes = []
  } = settings.general;

  const handleDeleteTheme = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // prevent setting it as active
    const updatedThemes = customThemes.filter((t) => t.id !== id);
    const fallbackTheme = theme === id ? "light" : theme;
    updateGeneralSettings({
      customThemes: updatedThemes,
      theme: fallbackTheme
    });
  };

  const handleEditTheme = (t: CustomTheme, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    router.push(`/settings/theme?id=${t.id}`);
  };

  const handleDuplicateTheme = (t: CustomTheme, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newId = `theme-custom-${Date.now()}`;
    const newTheme = {
      ...deepCloneTheme(t),
      id: newId,
      name: `${t.name} (Copy)`
    };
    updateGeneralSettings({
      customThemes: [...customThemes, newTheme]
    });
  };

  const handleCreateTheme = () => {
    router.push("/settings/theme?id=new");
  };

  const onThemeContextMenu = (e: React.MouseEvent, t: CustomTheme | { id: string, name: string, isPreset: boolean }) => {
    e.preventDefault();
    e.stopPropagation();

    const items: ContextMenuItem[] = [];

    if ('isPreset' in t && t.isPreset) {
      // Predefined theme items
      items.push(
        {
          id: "activate",
          label: "Set as active",
          icon: <Check className="w-4 h-4" />,
          onClick: () => updateGeneralSettings({ theme: t.id as any }),
          disabled: theme === t.id
        },
        {
          id: "duplicate",
          label: "Duplicate to edit",
          icon: <Copy className="w-4 h-4" />,
          onClick: () => {
            const presetIdToTemplateName: Record<string, string> = {
              "dark-violet": "Dark violet",
              "light": "Light minimal",
              "sepia": "Warm sepia",
              "nord": "Nord arctic"
            };
            const templateName = presetIdToTemplateName[t.id];
            const preset = PRESETS_TEMPLATES.find(p => p.name === templateName);
            if (preset) {
              const newId = `theme-custom-${Date.now()}`;
              const newTheme: CustomTheme = {
                ...DEFAULT_NEW_THEME(newId),
                ...deepCloneTheme(preset as any),
                id: newId,
                name: `${t.name} Custom`,
                bgType: (preset as any).bgType || "solid",
              };
              updateGeneralSettings({
                customThemes: [...customThemes, newTheme],
                theme: newId
              });
            }
          }
        }
      );
    } else {
      // Custom theme items
      const customT = t as CustomTheme;
      items.push(
        {
          id: "activate",
          label: "Set as active",
          icon: <Check className="w-4 h-4" />,
          onClick: () => updateGeneralSettings({ theme: customT.id }),
          disabled: theme === customT.id
        },
        {
          id: "edit",
          label: "Edit theme",
          icon: <Edit className="w-4 h-4" />,
          onClick: () => handleEditTheme(customT)
        },
        {
          id: "duplicate",
          label: "Duplicate theme",
          icon: <Copy className="w-4 h-4" />,
          onClick: () => handleDuplicateTheme(customT)
        },
        { id: "divider-1", label: "", divider: true },
        {
          id: "delete",
          label: "Delete theme",
          icon: <Trash2 className="w-4 h-4" />,
          tone: "danger",
          onClick: () => handleDeleteTheme(customT.id)
        }
      );
    }

    showMenu(e, items);
  };

  return (
    <div className="space-y-6">
      {/* Visual Themes Module */}
      <div className="bg-card/50 border border-border/20 rounded-xl p-6 shadow-md liquid-glass">
        <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
          <Palette className="text-primary h-5 w-5" />
          <h3 className="text-sm font-bold font-heading text-foreground">Themes</h3>
        </div>

        {/* Predefined Themes Grid */}
        <div className="mb-6">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">Color scheme theme</label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: "dark-violet", name: "Dark Violet", desc: "Original Clinical Navy", preview: "bg-[#0b1326]" },
              { id: "light", name: "Light Paper", desc: "Warm Minimal Light", preview: "bg-[#f1f3f6]" },
              { id: "sepia", name: "Sepia Warm", desc: "Parchment Reading", preview: "bg-[#f4ecd8]" },
              { id: "nord", name: "Nord Arctic", desc: "Snowy Blue Cold", preview: "bg-[#2e3440]" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => updateGeneralSettings({ theme: t.id as GeneralSettings["theme"] })}
                onContextMenu={(e) => onThemeContextMenu(e, { ...t, isPreset: true })}
                className={`p-2.5 border rounded-lg text-left transition-all relative overflow-hidden flex flex-col justify-between ${theme === t.id
                  ? "border-primary bg-accent/65"
                  : "border-border/30 bg-card hover:border-border/60"
                  }`}
              >
                <div className="flex items-center justify-between mb-2 w-full">
                  <span className="text-[11px] font-bold">{t.name}</span>
                  {theme === t.id && <CheckCircle className="text-primary h-3.5 w-3.5" />}
                </div>
                <div className="flex gap-1.5 items-center">
                  <div className={`w-4 h-4 rounded-full ${t.preview} border border-border/40 shrink-0`}></div>
                  <span className="text-[8px] text-muted-foreground leading-tight truncate">{t.desc}</span>
                </div>
              </button>
            ))}

            {/* Custom themes list */}
            {customThemes.map((t) => (
              <div
                key={t.id}
                onClick={() => updateGeneralSettings({ theme: t.id })}
                onContextMenu={(e) => onThemeContextMenu(e, t)}
                className={`p-2.5 border rounded-lg text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer group ${theme === t.id
                  ? "border-primary bg-accent/65"
                  : "border-border/30 bg-card hover:border-border/60"
                  }`}
              >
                <div className="flex items-center justify-between mb-2 w-full">
                  <span className="text-[11px] font-bold truncate pr-14">{t.name}</span>
                  <div className={`flex items-center gap-1.5 transition-all relative z-10 ${theme === t.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    <button
                      onClick={(e) => handleDeleteTheme(t.id, e)}
                      title="Delete Theme"
                      className="p-0.5 hover:text-destructive transition-colors text-muted-foreground"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleEditTheme(t, e)}
                      title="Edit Theme"
                      className="p-0.5 hover:text-primary transition-colors text-muted-foreground"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <div className="w-4 h-4 flex items-center justify-center">
                      {theme === t.id ? (
                        <CheckCircle className="text-primary h-3.5 w-3.5" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-border/40" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 items-center w-full justify-between">
                  <div className="flex gap-1.5 items-center">
                    <div 
                      className="w-4 h-4 rounded-full border border-border/40 shrink-0 shadow-inner" 
                      style={{ backgroundColor: t.background }} 
                    />
                    <span className="text-[8px] text-muted-foreground leading-tight truncate">Custom Theme</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Create theme button */}
            <button
              onClick={handleCreateTheme}
              className="p-2.5 border border-dashed border-border/40 hover:border-primary/50 bg-card/20 hover:bg-accent/10 rounded-lg text-center flex flex-col items-center justify-center transition-all min-h-[58px]"
            >
              <Plus className="h-4.5 w-4.5 text-muted-foreground mb-1" />
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Create Theme</span>
            </button>
          </div>
        </div>

        {/* Accent Highlight Color Selection */}
        <div className="mb-6">
          <ColorSelector
            label="Accent tint color"
            value={accentColor}
            onChange={(color) => updateGeneralSettings({ accentColor: color })}
          />
        </div>

        {/* UI Typography */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">System UI font family</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "inter", name: "Inter", desc: "Sans-Serif" },
              { id: "outfit", name: "Outfit", desc: "Geometric" },
              { id: "roboto", name: "Hanken", desc: "Grotesk" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => updateGeneralSettings({ uiFont: f.id as GeneralSettings["uiFont"] })}
                className={`p-1.5 border rounded text-center transition-all ${uiFont === f.id
                  ? "border-primary bg-accent/30 text-primary font-bold"
                  : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                  }`}
              >
                <span className="block text-[11px] font-semibold">{f.name}</span>
                <span className="block text-[7px] opacity-60 font-mono tracking-widest">{f.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Behavioral & Advanced Configuration */}
      <div className="bg-card/50 border border-border/20 rounded-xl p-6 shadow-md liquid-glass">
        <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
          <Settings2 className="text-primary h-5 w-5" />
          <h3 className="text-sm font-bold font-heading text-foreground">General features</h3>
        </div>

        {/* Settings toggles */}
        <div className="space-y-4">

          {/* Glassmorphism */}
          <div className="flex items-center justify-between py-1">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Liquid glass</label>
              <p className="text-[9px] text-muted-foreground mt-0.5">Enables premium Apple-style glass effects. Disable on slow hardware.</p>
            </div>
            <button
              onClick={() => updateGeneralSettings({ glassmorphism: !glassmorphism })}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${glassmorphism ? "bg-primary" : "bg-accent"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-background transition-transform duration-300 ${glassmorphism ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between py-1 border-t border-border/10 pt-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Reduce UI motion</label>
              <p className="text-[9px] text-muted-foreground mt-0.5">Disables transitions for speed loads and pagination changes.</p>
            </div>
            <button
              onClick={() => updateGeneralSettings({ reducedMotion: !reducedMotion })}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${reducedMotion ? "bg-primary" : "bg-accent"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-background transition-transform duration-300 ${reducedMotion ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between py-1 border-t border-border/10 pt-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Sound feedbacks</label>
              <p className="text-[9px] text-muted-foreground mt-0.5">Subtle clicks on pacing ticks and chimes on completing sessions.</p>
            </div>
            <button
              onClick={() => updateGeneralSettings({ soundEffects: !soundEffects })}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 relative shrink-0 ${soundEffects ? "bg-primary" : "bg-accent"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-background transition-transform duration-300 ${soundEffects ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>

          {/* Cognitive rest alerts */}
          <div className="py-2 border-t border-border/10 pt-3 flex flex-col justify-between gap-2.5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-foreground font-semibold">Cognitive rest alerts</label>
              <p className="text-[9px] text-muted-foreground mt-0.5">Rest prompts after prolonged speed training sessions.</p>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { val: 0, label: "Off" },
                { val: 10, label: "10m" },
                { val: 20, label: "20m" },
                { val: 30, label: "30m" },
              ].map((o) => (
                <button
                  key={o.val}
                  onClick={() => updateGeneralSettings({ readingTimerReminder: o.val })}
                  className={`flex-1 py-1.5 text-[9px] font-mono border rounded transition-all ${readingTimerReminder === o.val
                    ? "bg-primary text-primary-foreground font-bold border-primary"
                    : "border-border/30 hover:border-border/60 text-muted-foreground bg-card"
                    }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
