"use client";

import * as React from "react";
import { useSettings } from "@/features/settings/context/settings-context";
import { GeneralSettingsForm } from "@/features/settings/components/GeneralSettingsForm";
import { ReaderSettingsForm } from "@/features/settings/components/ReaderSettingsForm";
import { RsvpSettingsForm } from "@/features/settings/components/RsvpSettingsForm";
import { ClusterSettingsForm } from "@/features/settings/components/ClusterSettingsForm";
import { AccountSettingsForm } from "@/features/settings/components/AccountSettingsForm";
import { Settings, Zap, Columns, UserCircle, BookOpen } from "lucide-react";

export default function SettingsClient() {
  const { resetSettings } = useSettings();
  const [activeTab, setActiveTab] = React.useState<"general" | "reader" | "rsvp" | "cluster" | "account">("general");

  return (
    <div className="p-6 md:p-12 pb-24 md:pb-12 max-w-5xl mx-auto w-full transition-all duration-300">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">Configuration</h2>
          <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider mt-2 max-w-2xl">
            Adjust global visual engine parameters and manage your account security.
          </p>
        </div>
        <button
          onClick={resetSettings}
          className="px-4 py-2 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary rounded font-mono text-[10px] uppercase tracking-wider transition-all"
        >
          Reset defaults
        </button>
      </header>

      {/* Dynamic Inner Configuration Tabs */}
      <div className="flex border-b border-border/40 mb-8 overflow-x-auto scrollbar-none gap-2">
        {[
          { id: "general", name: "General & UI", icon: Settings },
          { id: "reader", name: "Reader", icon: BookOpen },
          { id: "rsvp", name: "RSVP", icon: Zap },
          { id: "cluster", name: "Cluster", icon: Columns },
          { id: "account", name: "Account & Sync", icon: UserCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all shrink-0 ${activeTab === tab.id
                ? "border-primary text-primary font-bold bg-accent/40"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/10"
                }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {tab.name}
            </button>
          );
        })}
      </div>

      <div className="w-full">
        {activeTab === "general" && <GeneralSettingsForm />}
        {activeTab === "reader" && <ReaderSettingsForm />}
        {activeTab === "rsvp" && <RsvpSettingsForm />}
        {activeTab === "cluster" && <ClusterSettingsForm />}
        {activeTab === "account" && <AccountSettingsForm />}
      </div>
    </div>
  );
}
