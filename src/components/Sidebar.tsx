"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Library, Glasses, TrendingUp, Settings, Sun, Moon, Flame, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/features/settings/context/settings-context";
import { useAuth } from "@/features/auth/context/auth-context";
import { useLibrary } from "@/features/library/context/library-context";
import { StatsService } from "@/core/services/stats-service";
import { BUILTIN_THEMES } from "@/core/config/themes";
import * as React from "react";

interface SidebarProps {
  activePath?: string;
}

export function Sidebar({ activePath }: SidebarProps) {
  const pathname = usePathname();
  const currentPath = activePath || pathname;
  const { settings, updateGeneralSettings } = useSettings();
  const { user } = useAuth();
  const { books, activeBookId } = useLibrary();

  const isCustomTheme = settings.general.customThemes?.some(t => t.id === settings.general.theme);
  const activeCustomTheme = settings.general.customThemes?.find(t => t.id === settings.general.theme);
  const shouldApplyLiquidGlass = isCustomTheme ? activeCustomTheme?.sidebarLiquidGlass : false;

  const [summary, setSummary] = React.useState({ currentStreakDays: 0 });

  const activeBooksCount = React.useMemo(
    () => books.filter((b) => b.status === "active").length,
    [books]
  );

  const completedBooksCount = React.useMemo(
    () => books.filter((b) => b.status === "completed").length,
    [books]
  );

  const activeBook = React.useMemo(() => {
    if (!activeBookId) return null;
    return books.find((b) => b.id === activeBookId) || null;
  }, [activeBookId, books]);

  React.useEffect(() => {
    const fetchStats = async () => {
      const statsSummary = await StatsService.getStatsSummary(completedBooksCount);
      setSummary({ currentStreakDays: statsSummary.currentStreakDays });
    };
    fetchStats();
  }, [completedBooksCount]);

  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    const name = user?.name || user?.email?.split("@")[0] || "Reader";

    if (hour >= 5 && hour < 12) return `Good morning, ${name}`;
    if (hour >= 12 && hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  }, [user]);

  const userInitial = React.useMemo(() => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "V";
  }, [user]);

  const yearlyReadingGoal = settings.general.yearlyReadingGoal || 24;
  const goalProgressPercentage = Math.min(Math.round((completedBooksCount / yearlyReadingGoal) * 100), 100);

  const currentThemeIsDark = React.useMemo(() => {
    const builtin = BUILTIN_THEMES.find((t) => t.id === settings.general.theme);
    if (builtin) return builtin.isDark;
    const custom = settings.general.customThemes?.find((t) => t.id === settings.general.theme);
    return custom?.isDark ?? false;
  }, [settings.general.theme, settings.general.customThemes]);

  const cycleTheme = React.useCallback(() => {
    const builtinIds = BUILTIN_THEMES.map((t) => t.id);
    const customThemeIds = settings.general.customThemes?.map((t) => t.id) || [];
    const allThemeIds = [...builtinIds, ...customThemeIds];
    const currentIndex = allThemeIds.indexOf(settings.general.theme);
    const nextIndex = (currentIndex + 1) % allThemeIds.length;
    updateGeneralSettings({ theme: allThemeIds[nextIndex] });
  }, [settings.general.theme, settings.general.customThemes, updateGeneralSettings]);

  const navItems = [
    {
      name: "Library",
      path: "/library",
      icon: Library,
      badge: activeBooksCount > 0 ? activeBooksCount : null,
      hoverAnim: { y: -4 },
    },
    {
      name: "Reading room",
      path: "/reader",
      icon: Glasses,
      badge: activeBookId ? 1 : null,
      hoverAnim: { scale: 1.15, rotate: 5 },
    },
    {
      name: "Performance",
      path: "/dashboard",
      icon: TrendingUp,
      badge: null,
      hoverAnim: { y: -3, scale: 1.1, transition: { repeat: Infinity, repeatType: "mirror", duration: 0.5 } },
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      badge: null,
      hoverAnim: { rotate: 180 },
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const iconVariants = (hoverAnim: Record<string, unknown>) => ({
    initial: { x: 0, y: 0, scale: 1, rotate: 0 },
    hover: {
      ...hoverAnim,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  });

  const ctaText = activeBook ? "Continue reading" : "Start reading";
  const ctaHref = activeBook ? "/reader" : "/library";

  return (
    <>
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-full flex-col z-40 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border)/0.5)] w-64 text-[hsl(var(--sidebar-foreground))] transition-all duration-300 ${shouldApplyLiquidGlass ? "liquid-glass" : ""}`}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="p-4 border-b border-[hsl(var(--sidebar-border)/0.5)]"
        >
          <Link href="/">
            <h1 className="text-xl font-extrabold tracking-tight text-primary font-heading">
              Visus
            </h1>
          </Link>
          <p className="text-[10px] font-sans text-muted-foreground mt-0.5 opacity-70 uppercase tracking-widest">
            High-performance reading
          </p>
        </motion.div>

        <motion.nav
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-none py-6 flex flex-col gap-1.5"
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
                  className={`flex items-center gap-4 px-6 py-4 transition-all font-sans text-xs uppercase tracking-wider group relative ${
                    isActive
                      ? "text-[hsl(var(--sidebar-active-background))] bg-[hsl(var(--sidebar-active-background)/0.12)]"
                      : "text-[hsl(var(--sidebar-foreground)/0.65)] hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-active-background)/0.08)]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-8 bg-[hsl(var(--sidebar-active-background))] rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  <motion.div variants={iconVariants(item.hoverAnim)}>
                    <Icon className="w-5 h-5 transition-colors" />
                  </motion.div>

                  <span className="relative z-10 font-bold">{item.name}</span>

                  {item.badge !== null && item.badge > 0 && (
                    <span className="ml-auto relative z-10 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary/10 text-[10px] font-mono font-bold text-primary leading-none">
                      {item.path === "/reader" ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      ) : (
                        item.badge
                      )}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        <AnimatePresence>
          {activeBook && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden flex-none"
            >
              <div className="mx-3 mb-2 p-3 rounded-lg border border-[hsl(var(--sidebar-border)/0.25)] bg-[hsl(var(--sidebar-active-background)/0.04)]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-heading font-bold truncate text-[hsl(var(--sidebar-foreground))]">
                    {activeBook.title}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/70 ml-2 shrink-0">
                    {activeBook.progress}%
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate mb-2">
                  {activeBook.author}
                </p>
                <div className="w-full h-1 bg-[hsl(var(--sidebar-border)/0.2)] rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${activeBook.progress}%` }}
                  />
                </div>
                <Link
                  href="/reader"
                  className="inline-block text-[10px] font-mono uppercase tracking-wider text-primary font-bold hover:brightness-110 transition-all"
                >
                  Continue reading
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1" />

        <div className="flex-none px-4 py-2">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              <Flame
                className={`w-3.5 h-3.5 transition-colors ${
                  summary.currentStreakDays > 0
                    ? "text-orange-500"
                    : "text-[hsl(var(--sidebar-foreground)/0.35)]"
                }`}
              />
              <span className="text-[11px] font-mono text-[hsl(var(--sidebar-foreground)/0.75)] font-medium">
                {summary.currentStreakDays}-day streak
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[hsl(var(--sidebar-foreground)/0.4)]" />
              <span className="text-[11px] font-mono text-[hsl(var(--sidebar-foreground)/0.75)] font-medium">
                {completedBooksCount}/{yearlyReadingGoal}
              </span>
            </div>
          </div>
          <div className="w-full h-0.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-primary/60 rounded-full transition-all duration-500"
              style={{ width: `${goalProgressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex-none px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold shrink-0">
                {userInitial}
              </div>
              <span className="text-[11px] text-[hsl(var(--sidebar-foreground)/0.7)]">
                {greeting}
              </span>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={cycleTheme}
                title="Switch theme"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[hsl(var(--sidebar-foreground)/0.35)] hover:text-primary hover:bg-primary/5 transition-all"
              >
                {currentThemeIsDark ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="p-4"
        >
          <Link href={ctaHref}>
            <button className="w-full py-3 bg-[hsl(var(--sidebar-active-background))] text-[hsl(var(--sidebar-active-foreground))] rounded font-sans text-xs uppercase tracking-wider hover:brightness-110 transition-all font-bold shadow-[0_0_15px_rgba(var(--primary),0.15)] overflow-hidden group relative">
              <motion.span
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {ctaText}
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
