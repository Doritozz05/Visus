"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  activePath?: string;
}

export function Sidebar({ activePath }: SidebarProps) {
  const pathname = usePathname();
  const currentPath = activePath || pathname;

  const navItems = [
    { name: "Library", path: "/library", icon: "library_books" },
    { name: "Reading Room", path: "/reader", icon: "speed" },
    { name: "Performance", path: "/dashboard", icon: "insights" },
    { name: "Settings", path: "/settings", icon: "settings" },
  ];

  return (
    <>
      {/* Desktop SideNav */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full flex-col z-40 bg-[#171f33] border-r border-[#464554]/20 w-64 text-slate-100">
        <div className="p-6 border-b border-[#464554]/20">
          <Link href="/">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#c0c1ff] font-heading flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c0c1ff] text-3xl">visibility</span>
              Visus
            </h1>
          </Link>
          <p className="text-[10px] font-mono text-[#c7c4d7] mt-1 opacity-70 uppercase tracking-widest">
            High-Performance Reading
          </p>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-all font-mono text-xs uppercase tracking-wider group ${
                  isActive
                    ? "text-[#c0c1ff] border-l-4 border-[#c0c1ff] bg-[#222a3d]/50"
                    : "text-[#c7c4d7] hover:text-slate-100 hover:bg-[#222a3d]/20"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-lg transition-colors ${
                    isActive ? "text-[#c0c1ff]" : "group-hover:text-[#c0c1ff]"
                  }`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#464554]/20">
          <Link href="/reader">
            <button className="w-full py-3 bg-[#c0c1ff] text-[#1000a9] rounded font-mono text-xs uppercase tracking-wider hover:brightness-110 transition-all font-bold shadow-[0_0_15px_rgba(192,193,255,0.15)]">
              Start Session
            </button>
          </Link>
        </div>
      </aside>

      {/* Mobile BottomNav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#171f33] border-t border-[#464554]/20 z-50 flex justify-around items-center h-16 pb-safe">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center w-1/4 h-full transition-all ${
                isActive ? "text-[#c0c1ff]" : "text-[#c7c4d7]"
              }`}
            >
              <div className={`${isActive ? "bg-[#222a3d] px-4 py-1 rounded-full" : ""}`}>
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0'" }}
                >
                  {item.icon}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
