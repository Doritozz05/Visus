"use client";

import * as React from "react";
import { useSettings } from "@/features/settings/context/settings-context";
import { GeneralSettingsForm } from "@/features/settings/components/GeneralSettingsForm";
import { ReaderSettingsForm } from "@/features/settings/components/ReaderSettingsForm";
import { RsvpSettingsForm } from "@/features/settings/components/RsvpSettingsForm";
import { ClusterSettingsForm } from "@/features/settings/components/ClusterSettingsForm";
import { AccountSettingsForm } from "@/features/settings/components/AccountSettingsForm";
import { Settings, Zap, Columns, UserCircle, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 25 }
  }
};

const tabsContainerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 25 }
  }
};

const formVariants = {
  enter: { opacity: 0 },
  center: {
    opacity: 1,
    transition: { duration: 0.15, ease: "easeInOut" }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12, ease: "easeInOut" }
  }
};

export default function SettingsClient() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as "general" | "reader" | "rsvp" | "cluster" | "account";

  const { resetSettings } = useSettings();
  const [activeTab, setActiveTab] = React.useState<"general" | "reader" | "rsvp" | "cluster" | "account">(tabParam || "general");
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Sync activeTab if searchParam changes
  React.useEffect(() => {
    if (tabParam && ["general", "reader", "rsvp", "cluster", "account"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  React.useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const check = () => setCanScrollRight(el.scrollWidth > el.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    el.addEventListener("scroll", check);
    return () => { ro.disconnect(); el.removeEventListener("scroll", check); };
  }, []);

  const TABS = [
    { id: "general", name: "General", icon: Settings },
    { id: "reader", name: "Reader", icon: BookOpen },
    { id: "rsvp", name: "RSVP", icon: Zap },
    { id: "cluster", name: "Cluster", icon: Columns },
    { id: "account", name: "Account", icon: UserCircle },
  ] as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-full w-full"
    >
      <div className="flex-none bg-background-adaptive z-30 pt-6 md:pt-12 mb-4 px-6 md:px-12 max-w-5xl mx-auto w-full">
        <motion.header
          variants={headerVariants}
          className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h2 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">Settings</h2>
            <p className="text-muted-foreground text-xs font-sans uppercase tracking-wider mt-2 max-w-2xl">
              Adjust global visual engine parameters and manage your account security.
            </p>
          </div>
          <button
            onClick={resetSettings}
            className="px-4 py-2 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary rounded font-sans text-[10px] uppercase tracking-wider transition-all"
          >
            Reset defaults
          </button>
        </motion.header>

        {/* Dynamic Inner Configuration Tabs */}
        <motion.div
          variants={tabsContainerVariants}
          className="relative"
        >
          <div
            ref={tabsRef}
            className="flex border-b border-border/40 mb-0 overflow-x-auto scrollbar-none gap-2 relative"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-sans text-xs uppercase tracking-wider transition-all shrink-0 relative ${isActive
                      ? "text-primary font-bold bg-accent/40"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                    }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {tab.name}
                  {isActive && (
                    <motion.div
                      layoutId="active-settings-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent" />
          )}
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-24 md:pb-12 max-w-5xl mx-auto w-full scrollbar-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={formVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            {activeTab === "general" && <GeneralSettingsForm />}
            {activeTab === "reader" && <ReaderSettingsForm />}
            {activeTab === "rsvp" && <RsvpSettingsForm />}
            {activeTab === "cluster" && <ClusterSettingsForm />}
            {activeTab === "account" && <AccountSettingsForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
