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

  // Sync activeTab if searchParam changes
  React.useEffect(() => {
    if (tabParam && ["general", "reader", "rsvp", "cluster", "account"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 md:p-12 pb-24 md:pb-12 max-w-5xl mx-auto w-full"
    >
      <motion.header 
        variants={headerVariants}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">Configuration</h2>
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
        className="flex border-b border-border/40 mb-8 overflow-x-auto scrollbar-none gap-2 relative"
      >
        {[
          { id: "general", name: "General & UI", icon: Settings },
          { id: "reader", name: "Reader", icon: BookOpen },
          { id: "rsvp", name: "RSVP", icon: Zap },
          { id: "cluster", name: "Cluster", icon: Columns },
          { id: "account", name: "Account & Sync", icon: UserCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-sans text-xs uppercase tracking-wider transition-all shrink-0 relative ${
                isActive
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
      </motion.div>

      <div className="w-full overflow-visible">
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
