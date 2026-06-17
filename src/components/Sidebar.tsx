"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, Glasses, TrendingUp, Settings, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useSettings } from "@/features/settings/context/settings-context";

interface SidebarProps {
  activePath?: string;
}

export function Sidebar({ activePath }: SidebarProps) {
  const pathname = usePathname();
  const currentPath = activePath || pathname;
  const { settings } = useSettings();

  const isCustomTheme = settings.general.customThemes?.some(t => t.id === settings.general.theme);
  const activeCustomTheme = settings.general.customThemes?.find(t => t.id === settings.general.theme);
  const shouldApplyLiquidGlass = isCustomTheme ? activeCustomTheme?.sidebarLiquidGlass : false;

  const navItems = [
    { name: "Library", path: "/library", icon: Library, hoverAnim: { y: -4 } },
    { name: "Reading room", path: "/reader", icon: Glasses, hoverAnim: { scale: 1.15, rotate: 5 } },
    { name: "Performance", path: "/dashboard", icon: TrendingUp, hoverAnim: { y: -3, scale: 1.1, transition: { repeat: Infinity, repeatType: "mirror", duration: 0.5 } } },
    { name: "Settings", path: "/settings", icon: Settings, hoverAnim: { rotate: 180 } },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const iconVariants = (hoverAnim: any) => ({
    initial: { x: 0, y: 0, scale: 1, rotate: 0 },
    hover: { 
      ...hoverAnim,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  });

  return (
    <>
      {/* Desktop SideNav */}
      <aside className={`hidden md:flex fixed left-0 top-0 h-full flex-col z-40 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border)/0.5)] w-64 text-[hsl(var(--sidebar-foreground))] transition-all duration-300 ${shouldApplyLiquidGlass ? 'liquid-glass' : ''}`}>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="p-6 border-b border-[hsl(var(--sidebar-border)/0.5)]"
        >
          <Link href="/">
            <h1 className="text-2xl font-extrabold tracking-tight text-primary font-heading flex items-center gap-2">
              Visus
            </h1>
          </Link>
          <p className="text-[10px] font-sans text-muted-foreground mt-1 opacity-70 uppercase tracking-widest">
            High-performance reading
          </p>
        </motion.div>

        <motion.nav 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 py-6 flex flex-col gap-2"
        >
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.path}
                variants={itemVariants}
                whileHover="hover"
                initial="initial"
              >
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-6 py-3 transition-all font-sans text-xs uppercase tracking-wider group relative ${
                    isActive
                      ? "text-[hsl(var(--sidebar-active-background))] bg-[hsl(var(--sidebar-active-background)/0.12)]"
                      : "text-[hsl(var(--sidebar-foreground)/0.65)] hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-active-background)/0.08)]"
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-[hsl(var(--sidebar-active-background))] rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <motion.div
                    variants={iconVariants(item.hoverAnim)}
                  >
                    <Icon
                      className="w-5 h-5 transition-colors"
                    />
                  </motion.div>
                  <span className="relative z-10 font-bold">{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="p-4 border-t border-[hsl(var(--sidebar-border)/0.5)]"
        >
          <Link href="/reader">
            <button className="w-full py-3 bg-[hsl(var(--sidebar-active-background))] text-[hsl(var(--sidebar-active-foreground))] rounded font-sans text-xs uppercase tracking-wider hover:brightness-110 transition-all font-bold shadow-[0_0_15px_rgba(var(--primary),0.15)] overflow-hidden group relative">
              <motion.span 
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start session
              </motion.span>
              <motion.div 
                className="absolute inset-0 bg-white/20 translate-x-[-100%]"
                whileHover={{ translateX: "100%" }}
                transition={{ duration: 0.4 }}
              />
            </button>
          </Link>
        </motion.div>
      </aside>

      {/* Mobile BottomNav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-card border-t border-border/50 z-50 h-16 pb-safe transition-all duration-300">
        <motion.ul 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-around items-center h-full w-full m-0 p-0"
        >
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <motion.li 
                key={item.path} 
                variants={itemVariants}
                className="w-1/4 h-full"
              >
                <Link
                  href={item.path}
                  aria-label={item.name}
                  className={`flex flex-col items-center justify-center w-full h-full transition-all ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <motion.div 
                    whileTap={{ scale: 0.8 }}
                    className={`${isActive ? "bg-accent px-4 py-1.5 rounded-full" : ""}`}
                  >
                    <Icon
                      className={`w-6 h-6 transition-colors ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </motion.div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>
    </>
  );
}

