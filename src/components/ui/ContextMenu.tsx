"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  ChevronRight,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Home,
  Library,
  Settings,
  Copy,
  ExternalLink,
  Search
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  divider?: boolean;
  tone?: "default" | "danger";
  shortcut?: string;
  children?: ContextMenuItem[];
}

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
}

interface ContextMenuContextType {
  showMenu: (event: MouseEvent | React.MouseEvent, items?: ContextMenuItem[]) => void;
  hideMenu: () => void;
}

const ContextMenuContext = React.createContext<ContextMenuContextType | undefined>(undefined);

export function useContextMenu() {
  const context = React.useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider");
  }
  return context;
}

export function ContextMenuProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    items: [],
  });
  const router = useRouter();
  const pathname = usePathname();

  const hideMenu = React.useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const getDefaultItems = React.useCallback((): ContextMenuItem[] => {
    const isDashboard = pathname === "/dashboard";
    const isLibrary = pathname === "/library";
    const isSettings = pathname === "/settings";
    const isReader = pathname.startsWith("/reader");

    const items: ContextMenuItem[] = [
      {
        id: "back",
        label: "Back",
        icon: <ArrowLeft className="w-4 h-4" />,
        onClick: () => window.history.back(),
        shortcut: "Alt + ←",
      },
      {
        id: "forward",
        label: "Forward",
        icon: <ArrowRight className="w-4 h-4" />,
        onClick: () => window.history.forward(),
        shortcut: "Alt + →",
      },
      {
        id: "reload",
        label: "Reload",
        icon: <RotateCcw className="w-4 h-4" />,
        onClick: () => window.location.reload(),
        shortcut: "Ctrl + R",
      },
      { id: "divider-1", label: "", divider: true },
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <Home className={`w-4 h-4 ${isDashboard ? "text-primary" : ""}`} />,
        onClick: () => router.push("/dashboard"),
        disabled: isDashboard,
      },
      {
        id: "library",
        label: "Library",
        icon: <Library className={`w-4 h-4 ${isLibrary ? "text-primary" : ""}`} />,
        onClick: () => router.push("/library"),
        disabled: isLibrary,
      },
      {
        id: "settings",
        label: "Settings",
        icon: <Settings className={`w-4 h-4 ${isSettings ? "text-primary" : ""}`} />,
        onClick: () => router.push("/settings"),
        disabled: isSettings,
      },
    ];

    if (isReader) {
      items.push(
        { id: "divider-reader", label: "", divider: true },
        {
          id: "exit-reader",
          label: "Exit reader",
          icon: <ExternalLink className="w-4 h-4" />,
          onClick: () => router.push("/library"),
          tone: "danger",
        }
      );
    }

    // Add Copy if text is selected
    if (typeof window !== "undefined" && window.getSelection()?.toString()) {
      items.unshift(
        {
          id: "copy",
          label: "Copy",
          icon: <Copy className="w-4 h-4" />,
          onClick: () => {
            const text = window.getSelection()?.toString();
            if (text) navigator.clipboard.writeText(text);
          },
          shortcut: "Ctrl+C",
        },
        {
          id: "search",
          label: "Search on Google",
          icon: <Search className="w-4 h-4" />,
          onClick: () => {
            const text = window.getSelection()?.toString();
            if (text) window.open(`https://www.google.com/search?q=${encodeURIComponent(text)}`, "_blank");
          },
        },
        { id: "divider-selection", label: "", divider: true }
      );
    }

    return items;
  }, [router, pathname]);

  const showMenu = React.useCallback(
    (event: MouseEvent | React.MouseEvent, customItems?: ContextMenuItem[]) => {
      event.preventDefault();

      const x = event.clientX;
      const y = event.clientY;

      setState({
        isOpen: true,
        x,
        y,
        items: customItems || getDefaultItems(),
      });
    },
    [getDefaultItems]
  );

  React.useEffect(() => {
    const handleGlobalContextMenu = (e: MouseEvent) => {
      // Check if we should ignore context menu (e.g. on specific elements)
      // For now, let's just show it everywhere
      showMenu(e);
    };

    const handleGlobalClick = () => {
      if (state.isOpen) hideMenu();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideMenu();
    };

    window.addEventListener("contextmenu", handleGlobalContextMenu);
    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", hideMenu, true);

    return () => {
      window.removeEventListener("contextmenu", handleGlobalContextMenu);
      window.removeEventListener("click", handleGlobalClick);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", hideMenu, true);
    };
  }, [showMenu, hideMenu, state.isOpen]);

  return (
    <ContextMenuContext.Provider value={{ showMenu, hideMenu }}>
      {children}
      {state.isOpen && (
        <ContextMenuUI
          x={state.x}
          y={state.y}
          items={state.items}
          onClose={hideMenu}
        />
      )}
    </ContextMenuContext.Provider>
  );
}

interface ContextMenuUIProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

function ContextMenuUI({ x, y, items, onClose }: ContextMenuUIProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: y, left: x });

  React.useLayoutEffect(() => {
    if (!menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let nextX = x;
    let nextY = y;

    if (x + rect.width > viewportWidth) {
      nextX = viewportWidth - rect.width - 8;
    }

    if (y + rect.height > viewportHeight) {
      nextY = viewportHeight - rect.height - 8;
    }

    setPosition({ top: nextY, left: nextX });
  }, [x, y]);

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        zIndex: 1000,
      }}
      className="w-64 overflow-hidden rounded-xl border border-border/40 bg-card p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] liquid-glass animate-in fade-in zoom-in-95 duration-100"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="flex flex-col gap-0.5">
        {items.map((item, index) => (
          <React.Fragment key={item.id || index}>
            {item.divider ? (
              <div className="my-1 h-px bg-border/50" />
            ) : (
              <button
                disabled={item.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  item.onClick?.();
                  onClose();
                }}
                className={`
                  group flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-all
                  ${item.tone === "danger"
                    ? "text-foreground hover:bg-rose-500/10 hover:text-rose-500"
                    : "text-foreground hover:bg-accent/80"}
                  ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-default"}
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`
                    flex h-5 w-5 shrink-0 items-center justify-center transition-colors
                    ${item.tone === "danger"
                      ? "text-rose-500 group-hover:text-rose-600"
                      : "text-muted-foreground group-hover:text-foreground"}
                  `}>
                    {item.icon}
                  </span>
                  <span className="truncate text-sm font-medium">{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-[10px] text-muted-foreground/60 font-mono tracking-tighter">
                    {item.shortcut}
                  </span>
                )}
                {item.children && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>,
    document.body
  );
}
