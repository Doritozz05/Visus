"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, Glasses, TrendingUp, Settings, Eye } from "lucide-react";

interface SidebarProps {
  activePath?: string;
}

export function Sidebar({ activePath }: SidebarProps) {
  const pathname = usePathname();
  const currentPath = activePath || pathname;

  const navItems = [
    { name: "Library", path: "/library", icon: Library },
    { name: "Reading room", path: "/reader", icon: Glasses },
    { name: "Performance", path: "/dashboard", icon: TrendingUp },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop SideNav */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full flex-col z-40 bg-card border-r border-border/50 w-64 text-foreground transition-all duration-300">
        <div className="p-6 border-b border-border/50">
          <Link href="/">
            <h1 className="text-2xl font-extrabold tracking-tight text-primary font-heading flex items-center gap-2">
              <Eye className="w-8 h-8 text-primary" />
              Visus
            </h1>
          </Link>
          <p className="text-[10px] font-mono text-muted-foreground mt-1 opacity-70 uppercase tracking-widest">
            High-performance reading
          </p>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-all font-mono text-xs uppercase tracking-wider group ${
                  isActive
                    ? "text-primary border-l-4 border-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-primary" : "group-hover:text-primary"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border/50">
          <Link href="/reader">
            <button className="w-full py-3 bg-primary text-primary-foreground rounded font-mono text-xs uppercase tracking-wider hover:brightness-110 transition-all font-bold shadow-[0_0_15px_rgba(var(--primary),0.15)]">
              Start session
            </button>
          </Link>
        </div>
      </aside>

      {/* Mobile BottomNav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-card border-t border-border/50 z-50 h-16 pb-safe transition-all duration-300">
        <ul className="flex justify-around items-center h-full w-full m-0 p-0">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path} className="w-1/4 h-full">
                <Link
                  href={item.path}
                  aria-label={item.name}
                  className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className={`${isActive ? "bg-accent px-4 py-1.5 rounded-full" : ""}`}>
                    <Icon
                      className={`w-6 h-6 transition-colors ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
