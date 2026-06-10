"use client";

import { Sidebar } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/features/auth/context/auth-context";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Determine if we need the default mobile header or a specialized one
  const isReader = pathname.startsWith("/reader");

  const userInitial = user?.email?.charAt(0).toUpperCase() || "V";

  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col md:flex-row antialiased transition-all duration-300">
      <Sidebar activePath={pathname} />

      {/* Standard Mobile Nav (for Library, Dashboard, Settings) */}
      {!isReader && (
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
      <div className={`flex-1 flex flex-col md:ml-64 ${isReader ? "h-screen overflow-hidden overscroll-none" : "min-h-screen"}`}>
        {children}
      </div>
    </div>
  );
}
