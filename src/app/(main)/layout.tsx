"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { useReadingStore } from "@/features/reader/stores/reading-store";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFocusMode = useReadingStore((state) => state.isFocusMode);
  const activeBookId = useReadingStore((state) => state.activeBookId);

  const isReader = pathname.startsWith("/reader");
  const isThemeDesigner = pathname.startsWith("/settings/theme");

  const hideSidebar = (isReader && (isFocusMode || !!activeBookId)) || isThemeDesigner;

  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col md:flex-row antialiased transition-all duration-300 main-layout-wrapper">
      <div className={`transition-all duration-300 ${hideSidebar ? 'w-0 overflow-hidden opacity-0 translate-x-[-100%]' : ''}`}>
        <Sidebar activePath={pathname} />
      </div>

      {/* Content Wrapper */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isReader || isThemeDesigner ? "h-dvh overflow-hidden overscroll-none" : "min-h-screen"} ${!hideSidebar ? "md:ml-64" : ""}`}>
        {children}
      </div>
    </div>
  );
}
