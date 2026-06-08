"use client";

import * as React from "react";
import { Sidebar } from "@/components/Sidebar";
import { useSettings } from "@/features/settings/context/settings-context";
import { GeneralSettingsForm } from "@/features/settings/components/GeneralSettingsForm";
import { RsvpSettingsForm } from "@/features/settings/components/RsvpSettingsForm";
import { ClusterSettingsForm } from "@/features/settings/components/ClusterSettingsForm";
import { Settings, Zap, Columns, Flame, UserCircle, User, RefreshCw } from "lucide-react";

export default function SettingsClient() {
  const { resetSettings } = useSettings();
  const [activeTab, setActiveTab] = React.useState<"general" | "rsvp" | "cluster">("general");
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1200);
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen flex flex-col md:flex-row antialiased transition-all duration-300">
      <Sidebar activePath="/settings" />

      {/* Mobile TopNav */}
      <nav className="md:hidden bg-card border-b border-border/50 flex justify-between items-center w-full px-6 py-4 z-50 sticky top-0 transition-colors">
        <div className="text-xl font-bold tracking-tight text-foreground">Visus</div>
        <div className="flex items-center gap-4">
          <Flame className="text-primary h-5 w-5 fill-primary/20" />
          <div className="w-8 h-8 rounded-full bg-accent border border-border/30 overflow-hidden">
            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              VP
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-12 pb-24 md:pb-12 max-w-5xl mx-auto w-full transition-all duration-300">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">Configuration</h2>
            <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider mt-2 max-w-2xl">
              Adjust global visual engine parameters. Changes are applied in real-time across all views.
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
            { id: "rsvp", name: "RSVP engine", icon: Zap },
            { id: "cluster", name: "Cluster canvas", icon: Columns },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 font-mono text-xs uppercase tracking-wider transition-all shrink-0 ${
                  activeTab === tab.id
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Controls Panel */}
          <div className="lg:col-span-8">
            {activeTab === "general" && <GeneralSettingsForm />}
            {activeTab === "rsvp" && <RsvpSettingsForm />}
            {activeTab === "cluster" && <ClusterSettingsForm />}
          </div>

          {/* Right Column: Account Status and Data Management */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Account Status Card */}
            <section className="bg-card border border-border/20 rounded-xl p-6 shadow-md glass-panel relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8 blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
                <UserCircle className="text-primary h-5 w-5" />
                <h3 className="text-lg font-bold font-heading text-foreground">Local profile</h3>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="text-primary h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Guest reader</h4>
                  <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">Unregistered account</span>
                </div>
              </div>
              <button className="w-full py-2.5 bg-primary text-primary-foreground rounded font-mono text-xs uppercase tracking-wider hover:brightness-110 transition-all font-bold">
                Login / register
              </button>
            </section>

            {/* Cloud and Local Backup Integration */}
            <section className="bg-card border border-border/20 rounded-xl p-6 shadow-md glass-panel">
              <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
                <RefreshCw className="text-primary h-5 w-5" />
                <h3 className="text-lg font-bold font-heading text-foreground">Storage sync</h3>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Cloud sync status</span>
                <span className="text-xs font-mono text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Ready to sync
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground mb-6 leading-relaxed">
                Settings are safely cached locally in your secure browser storage. Log in to synchronize automatically across mobile and desktop.
              </div>

              <div className="space-y-2">
                <button 
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="w-full py-2.5 border border-border/30 text-foreground rounded font-mono text-[10px] uppercase tracking-wider hover:bg-accent hover:border-primary transition-all disabled:opacity-50"
                >
                  {isSyncing ? "Syncing configs..." : "Force DB synchronize"}
                </button>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
