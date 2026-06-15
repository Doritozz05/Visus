"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  dividerBefore?: boolean;
  tone?: "default" | "danger";
  style?: React.CSSProperties;
}

interface FancyDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
  ariaLabel: string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  align?: "start" | "end";
  maxMenuHeightClassName?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchInputClassName?: string;
  keepSelectedVisibleWhenFiltered?: boolean;
  menuZIndex?: number;
  renderTrigger?: (selectedOption: DropdownOption | undefined, isOpen: boolean) => React.ReactNode;
}

export function FancyDropdown({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  className,
  triggerClassName,
  menuClassName,
  optionClassName,
  align = "start",
  maxMenuHeightClassName = "max-h-72",
  searchable = false,
  searchPlaceholder = "Search...",
  searchInputClassName,
  keepSelectedVisibleWhenFiltered = true,
  menuZIndex = 60,
  renderTrigger,
}: FancyDropdownProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>({});
  const [isMenuPositioned, setIsMenuPositioned] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [maxOptionsHeight, setMaxOptionsHeight] = React.useState<number>(288);

  const selectedOption = options.find((option) => option.value === value);
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredOptions = React.useMemo(() => {
    if (!searchable || normalizedSearchQuery.length === 0) return options;

    return options.filter((option) => {
      if (keepSelectedVisibleWhenFiltered && option.value === value) return true;

      const haystack = `${option.label} ${option.description ?? ""}`.toLowerCase();
      return haystack.includes(normalizedSearchQuery);
    });
  }, [keepSelectedVisibleWhenFiltered, normalizedSearchQuery, options, searchable, value]);

  const updateMenuPosition = React.useCallback(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();
    const menuEl = menuRef.current;
    const menuWidth = menuEl ? menuEl.getBoundingClientRect().width : (align === "end" ? 220 : rect.width);
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const desiredLeft = align === "end" ? rect.right - menuWidth : rect.left;
    const left = Math.max(8, Math.min(desiredLeft, viewportWidth - menuWidth - 8));

    const spaceBelow = viewportHeight - rect.bottom - 16;
    const spaceAbove = rect.top - 16;
    const preferAbove = spaceBelow < 280 && spaceAbove > spaceBelow;

    const searchHeight = searchable ? 58 : 0;
    const computedMaxHeight = preferAbove
      ? Math.min(288, Math.max(80, spaceAbove - searchHeight - 24))
      : Math.min(288, Math.max(80, spaceBelow - searchHeight - 24));

    setMaxOptionsHeight(computedMaxHeight);

    const style: React.CSSProperties = {
      position: "fixed",
      left,
      width: align === "end" ? undefined : rect.width,
      zIndex: menuZIndex,
    };

    if (preferAbove) {
      style.bottom = viewportHeight - rect.top + 8;
    } else {
      style.top = rect.bottom + 8;
    }

    setMenuStyle(style);
    setIsMenuPositioned(true);
  }, [align, menuZIndex, searchable]);

  React.useLayoutEffect(() => {
    if (!isOpen) return;

    setIsMenuPositioned(false);
    updateMenuPosition();

    if (searchable) {
      window.requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setIsOpen(false);
    };

    const handleResizeOrScroll = () => updateMenuPosition();

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
    };
  }, [isOpen, searchable, updateMenuPosition]);

  React.useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setIsMenuPositioned(false);
    }
  }, [isOpen]);

  return (
    <div ref={rootRef} className={className}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={
          triggerClassName ??
          "group flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-border/40 bg-card px-3.5 text-left text-sm text-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 liquid-glass"
        }
      >
        {renderTrigger ? (
          renderTrigger(selectedOption, isOpen)
        ) : (
          <>
            <span className="min-w-0 flex-1 truncate text-sm flex items-center gap-1.5">
              {selectedOption?.icon && <span className="shrink-0 flex items-center justify-center">{selectedOption.icon}</span>}
              <span className="truncate">{selectedOption?.label ?? placeholder}</span>
            </span>
            <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </>
        )}
      </button>

      {isOpen && typeof document !== "undefined"
        ? createPortal(
            <>
              <div 
                className="fixed inset-0 bg-transparent" 
                style={{ zIndex: menuZIndex - 1 }}
                onClick={() => setIsOpen(false)} 
              />
              <div
                ref={menuRef}
                role="listbox"
                style={menuStyle}
                data-positioned={isMenuPositioned ? "true" : "false"}
                className={
                  menuClassName ??
                  `overflow-hidden rounded-2xl border border-border/40 bg-card shadow-[0_24px_70px_rgba(0,0,0,0.22)] liquid-glass ${maxMenuHeightClassName}`
                }
                aria-hidden={!isMenuPositioned}
              >
                {searchable && (
                  <div className="border-b border-border/10 p-2">
                    <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-background/70 px-3 h-10 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <input
                        ref={searchInputRef}
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                        className={
                          searchInputClassName ??
                          "w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                        }
                      />
                    </div>
                  </div>
                )}
                <div
                  className="overflow-y-auto p-1.5 flex flex-col gap-0.5"
                  style={{
                    maxHeight: `${maxOptionsHeight}px`,
                    visibility: isMenuPositioned ? "visible" : "hidden",
                  }}
                >
                  {filteredOptions.length === 0 ? (
                    <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                      No results found
                    </div>
                  ) : (
                    filteredOptions.map((option) => {
                    const isSelected = option.value === value;

                    return (
                      <React.Fragment key={option.value || "__empty__"}>
                        {option.dividerBefore && <div className="my-1 h-px bg-border/50" />}
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            onChange(option.value);
                            setIsOpen(false);
                          }}
                          style={option.style}
                          className={
                            optionClassName ??
                            `flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all ${
                              option.tone === "danger"
                                ? "text-rose-500 hover:bg-rose-500/10"
                                : "text-foreground hover:bg-accent/80"
                            } ${isSelected ? "bg-primary/10 ring-1 ring-primary/15" : ""}`
                          }
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/70 border border-border/40 text-muted-foreground">
                            {option.icon ?? <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">{option.label.slice(0, 2)}</span>}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2 text-sm font-medium">
                              <span className="truncate">{option.label}</span>
                              {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                            </span>
                            {option.description && (
                              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{option.description}</span>
                            )}
                          </span>
                        </button>
                      </React.Fragment>
                    );
                  })
                  )}
                </div>
              </div>
            </>,
            document.body,
          )
        : null}
    </div>
  );
}