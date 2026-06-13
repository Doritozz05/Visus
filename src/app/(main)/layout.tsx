"use client";

import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/features/auth/context/auth-context";
import { useReadingStore } from "@/features/reader/stores/reading-store";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isFocusMode = useReadingStore((state) => state.isFocusMode);

  // Determine if we need the default mobile header or a specialized one
  const isReader = pathname.startsWith("/reader");
  const isThemeDesigner = pathname.startsWith("/settings/theme");

  const userInitial = user?.email?.charAt(0).toUpperCase() || "V";

  const hideSidebar = (isReader && isFocusMode) || isThemeDesigner;
  const hideMobileNav = isReader || isThemeDesigner;

  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col md:flex-row antialiased transition-all duration-300">
      <div className={`transition-all duration-300 ${hideSidebar ? 'w-0 overflow-hidden opacity-0 translate-x-[-100%]' : ''}`}>
        <Sidebar activePath={pathname} />
      </div>

      {/* Standard Mobile Nav (for Library, Dashboard, Settings) */}
      {!hideMobileNav && (
        <nav className="md:hidden bg-card border-b border-border/50 flex justify-between items-center w-full px-6 py-4 z-50 sticky top-0 transition-all duration-300">
          <div className="text-xl font-bold tracking-tight text-foreground">Visus</div>
          <div className="flex items-center gap-4">
            <Flame className="text-primary w-6 h-6" />
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-border/30 overflow-hidden">
              {user?.avatarUrl ? (
                <Image src={user.avatarUrl} alt={user.name || "User"} width={32} height={32} className="w-full h-full object-cover" />
              ) : (
                userInitial
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Content Wrapper */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isReader || isThemeDesigner ? "h-screen overflow-hidden overscroll-none" : "min-h-screen"} ${!isFocusMode && isReader ? "md:ml-64" : ""}`}>
        {children}
      </div>
    </div>
  );
}
