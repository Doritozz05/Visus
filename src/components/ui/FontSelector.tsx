"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, Plus, Trash2, ChevronDown, Type } from "lucide-react";
import { BUILTIN_FONTS, getFontFamilyStyle, CustomFont } from "@/lib/typography";
import { saveCustomFont } from "@/lib/services/font-storage";
import { toast } from "sonner";
import { useSettings } from "@/features/settings/context/settings-context";

interface FontSelectorProps {
  value: string;
  onChange: (value: string) => void;
  customFonts: CustomFont[];
  onRefreshCustomFonts: () => Promise<void>;
  filterType?: "ui" | "reader" | "both";
  label?: string;
  placeholder?: string;
}

export function FontSelector({
  value,
  onChange,
  customFonts,
  onRefreshCustomFonts,
  filterType,
  label,
  placeholder = "Select font..."
}: FontSelectorProps) {
  const { deleteCustomFontAndCleanup } = useSettings();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});

  const filteredBuiltins = React.useMemo(() => {
    return BUILTIN_FONTS;
  }, []);

  const selectedFont = React.useMemo(() => {
    const builtin = BUILTIN_FONTS.find(f => f.id === value);
    if (builtin) return builtin;
    const custom = customFonts.find(f => f.id === value);
    if (custom) return { id: custom.id, name: custom.name, desc: "Custom Font" };
    return null;
  }, [value, customFonts]);

  // Logic to calculate position relative to the DOCUMENT (to allow natural scrolling without JS updates)
  const updateMenuPosition = React.useCallback(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const viewportHeight = window.innerHeight;
    
    const menuWidth = Math.max(280, rect.width);
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const preferAbove = spaceBelow < 300 && spaceAbove > spaceBelow;

    const style: React.CSSProperties = {
      position: "absolute", // Absolute relative to body/document
      left: rect.left + scrollX,
      width: menuWidth,
      zIndex: 200,
    };

    if (preferAbove) {
      style.bottom = (viewportHeight - rect.top) - scrollY + 8;
    } else {
      style.top = rect.bottom + scrollY + 8;
    }

    // Only update if something actually changed to prevent render loops
    setMenuStyle(prev => {
      if (JSON.stringify(prev) === JSON.stringify(style)) return prev;
      return style;
    });
  }, []);

  React.useLayoutEffect(() => {
    if (!isOpen) return;
    updateMenuPosition();

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    // Note: We don't need a scroll listener here because 'absolute' positioning
    // in the body will naturally follow the document scroll.
    const handleResize = () => {
      window.requestAnimationFrame(updateMenuPosition);
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, updateMenuPosition]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    
    setIsUploading(true);
    try {
      await saveCustomFont(nameWithoutExt, file);
      await onRefreshCustomFonts();
      toast.success("Font uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload font");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (e: React.MouseEvent, font: CustomFont) => {
    e.stopPropagation();
    try {
      await deleteCustomFontAndCleanup(font.id);
      toast.success("Font deleted");
    } catch (err: any) {
      toast.error("Failed to delete font");
    }
  };

  return (
    <div ref={rootRef} className="space-y-1.5 w-full">
      {label && (
        <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground ml-1">
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-border/40 bg-card px-3.5 text-left text-sm text-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 liquid-glass ${
          isOpen ? "border-primary/50 ring-2 ring-primary/10 bg-card" : ""
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <Type className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? "text-primary" : "text-muted-foreground"}`} />
          <span className="truncate font-medium">{selectedFont?.name || placeholder}</span>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <>
          <div 
            className="fixed inset-0 z-[199] bg-transparent" 
            onClick={() => setIsOpen(false)} 
          />
          <div
            ref={menuRef}
            style={menuStyle}
            className="flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-[0_24px_70px_rgba(0,0,0,0.22)] liquid-glass animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 max-h-[320px] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {/* Built-in Fonts */}
              {filteredBuiltins.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => {
                    onChange(font.id);
                    setIsOpen(false);
                  }}
                  style={{ fontFamily: font.familyStyle }}
                  className={`flex w-full items-center justify-between px-3 py-2 rounded-xl transition-all text-left group ${
                    value === font.id
                      ? "bg-primary/10 text-primary ring-1 ring-primary/15"
                      : "text-foreground hover:bg-accent/80"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{font.name}</span>
                    <span className="text-[9px] opacity-60 font-sans tracking-wider uppercase">{(font as any).desc}</span>
                  </div>
                  {value === font.id && (
                    <Check className="w-4 h-4 shrink-0 text-primary" />
                  )}
                </button>
              ))}

              {/* Custom Fonts Section */}
              {customFonts.length > 0 && (
                <>
                  <div className="flex items-center gap-2 py-2 px-3">
                    <div className="h-px bg-border/20 flex-1" />
                    <span className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/50">Custom</span>
                    <div className="h-px bg-border/20 flex-1" />
                  </div>

                  {customFonts.map((font) => (
                    <div
                      key={font.id}
                      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-all group/item ${
                        value === font.id
                          ? "bg-primary/10 text-primary ring-1 ring-primary/15"
                          : "text-foreground hover:bg-accent/80"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onChange(font.id);
                          setIsOpen(false);
                        }}
                        style={{ fontFamily: getFontFamilyStyle(font.id, customFonts) }}
                        className="flex-1 text-left flex flex-col"
                      >
                        <span className="text-sm font-medium">{font.name}</span>
                        <span className="text-[9px] opacity-60 font-sans tracking-wider uppercase">User Font</span>
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {value === font.id && (
                          <Check className="w-4 h-4 shrink-0 text-primary" />
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, font)}
                          className="opacity-0 group-hover/item:opacity-100 p-1.5 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all text-muted-foreground"
                          title="Delete font"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Upload Button at Footer of Menu */}
            <div className="p-1.5 border-t border-border/10 bg-accent/5">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl border border-dashed border-border/40 hover:border-primary/50 hover:bg-card transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center border border-border/20 group-hover:border-primary/30 transition-all shadow-sm shrink-0">
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all" />
                  )}
                </div>
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-all">Upload New Font</span>
                  <span className="text-[8px] text-muted-foreground font-sans truncate uppercase tracking-tighter">TTF, OTF, WOFF2</span>
                </div>
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".ttf,.otf,.woff,.woff2"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
