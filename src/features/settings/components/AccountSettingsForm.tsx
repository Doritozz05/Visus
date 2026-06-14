"use client";

import React from "react";
import { useAuth } from "@/features/auth/context/auth-context";
import { MfaSetup } from "@/features/auth/components/MfaSetup";
import { IdentityManagement } from "@/features/auth/components/IdentityManagement";
import { UpdateEmailForm } from "@/features/auth/components/UpdateEmailForm";
import { UpdatePasswordForm } from "@/features/auth/components/UpdatePasswordForm";
import { User, ShieldCheck, Mail, Lock, LogOut, RefreshCw, UserCircle, CheckCircle, AlertTriangle, Cloud, Fingerprint } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLibrary } from "@/features/library/context/library-context";

export function AccountSettingsForm() {
  const { user, logout } = useAuth();
  const { forceSync } = useLibrary();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncStatus, setSyncStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [syncError, setSyncError] = React.useState<string | null>(null);

  // Logic for UI states
  const hasGoogleLinked = user?.provider === 'google' || false;
  const hasPasswordIdentity = user?.hasPassword === true;

  const handleSync = async () => {
    if (!user) return;
    
    setIsSyncing(true);
    setSyncStatus("idle");
    setSyncError(null);

    try {
      await forceSync();
      setSyncStatus("success");
    } catch (err) {
      setSyncStatus("error");
      setSyncError(err instanceof Error ? err.message : "Unknown synchronization error.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-12">
      
      {/* Profile & Sync Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile Card */}
        <section className="bg-card border border-border/20 rounded-2xl p-6 shadow-md liquid-glass relative overflow-hidden flex flex-col h-full">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
            <UserCircle className="text-primary h-5 w-5" />
            <h3 className="text-lg font-bold font-heading">{user ? "User Profile" : "Local Profile"}</h3>
          </div>
          
          <div className="flex items-center gap-4 mb-8 flex-1">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden shrink-0">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name || "User"}
                  width={64}
                  height={64}
                  sizes="64px"
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-primary h-8 w-8" />
              )}
            </div>
            <div>
              <h4 className="text-base font-bold font-heading">{user?.name || user?.email || "Guest Reader"}</h4>
              <p className="text-sm text-muted-foreground mb-1">{user?.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[9px] font-sans text-muted-foreground uppercase tracking-wider bg-accent/50 px-2 py-0.5 rounded">
                  {user ? "Authenticated Session" : "Unregistered Account"}
                </span>
                {user && (
                  <span className="text-[9px] font-sans text-primary uppercase tracking-wider font-bold bg-primary/10 px-2 py-0.5 rounded">
                    {user.provider === 'google' ? "Google" : "Email"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {user ? (
            <button 
              onClick={logout}
              className="w-full py-2.5 mt-auto bg-destructive/10 text-destructive border border-destructive/20 rounded-lg font-sans text-xs uppercase tracking-wider hover:bg-destructive hover:text-destructive-foreground transition-all font-bold flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="w-full mt-auto py-2.5 bg-primary text-primary-foreground rounded-lg font-sans text-xs uppercase tracking-wider hover:brightness-110 transition-all font-bold text-center"
            >
              Login / Register
            </Link>
          )}
        </section>

        {/* Cloud Sync Card */}
        <section className="bg-card border border-border/20 rounded-2xl p-6 shadow-md liquid-glass flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
            <RefreshCw className="text-primary h-5 w-5" />
            <h3 className="text-lg font-bold font-heading text-foreground">Storage Sync</h3>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-sans uppercase tracking-wider text-muted-foreground">Cloud Sync Status</span>
            <span className={`text-xs font-mono flex items-center gap-1.5 ${user ? "text-emerald-500" : "text-amber-500"}`}>
              <span className={`w-2 h-2 rounded-full inline-block animate-pulse ${user ? "bg-emerald-500" : "bg-amber-500"}`}></span>
              {user ? "Ready to sync" : "Local only"}
            </span>
          </div>
          
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed flex-1">
            {user 
              ? "Your library and reading progress are safely backed up to the cloud. You can manually force a synchronization if you use Visus on multiple devices."
              : "Settings and books are safely cached locally in your browser storage. Log in to synchronize automatically across mobile and desktop."
            }
          </p>

          {syncStatus === "success" && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-500 text-xs font-mono animate-in fade-in duration-300">
              <CheckCircle className="h-4 w-4" />
              Synchronization completed successfully!
            </div>
          )}

          {syncStatus === "error" && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-xs font-mono animate-in fade-in duration-300">
              <AlertTriangle className="h-4 w-4" />
              {syncError}
            </div>
          )}

          <div className="mt-auto">
            <button 
              onClick={handleSync}
              disabled={isSyncing || !user}
              className="w-full py-3 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 rounded-xl font-sans text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-bold group"
            >
              <Cloud className={`h-5 w-5 ${isSyncing ? "animate-spin" : "group-hover:scale-110 transition-transform"}`} />
              {isSyncing ? "Synchronizing..." : "Synchronize Library Now"}
            </button>
          </div>
        </section>

      </div>

      {/* Security Settings (Only if logged in) */}
      {user && (
        <div className="pt-8 border-t border-border/30">
          <h2 className="text-2xl font-extrabold font-heading text-foreground tracking-tight mb-2">Security & Credentials</h2>
          <p className="text-muted-foreground text-[10px] font-sans uppercase tracking-wider mb-8">
            Manage your authentication methods and data privacy.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Identity Management Section */}
            <section className="bg-card border border-border/20 rounded-2xl p-6 shadow-md liquid-glass md:col-span-2">
              <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
                <Fingerprint className="text-primary h-5 w-5" />
                <h3 className="text-lg font-bold font-heading">Login Methods</h3>
              </div>
              <IdentityManagement />
            </section>

            {/* MFA Section */}
            <section className="bg-card border border-border/20 rounded-2xl p-6 shadow-md liquid-glass relative overflow-hidden md:col-span-2">
              <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
                <ShieldCheck className="text-primary h-5 w-5" />
                <h3 className="text-lg font-bold font-heading">Two-Factor Authentication</h3>
              </div>
              <MfaSetup />
            </section>

            {/* Email Management */}
            <section className="bg-card border border-border/20 rounded-2xl p-6 shadow-md liquid-glass">
              <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
                <Mail className="text-primary h-5 w-5" />
                <h3 className="text-lg font-bold font-heading">Email Address</h3>
              </div>
              <UpdateEmailForm currentEmail={user?.email || ""} disabled={hasGoogleLinked} />
              {hasGoogleLinked && (
                <p className="text-[10px] text-muted-foreground mt-3 italic">
                  * Email management is disabled while a social account is linked.
                </p>
              )}
            </section>

            {/* Password Management */}
            <section className="bg-card border border-border/20 rounded-2xl p-6 shadow-md liquid-glass">
              <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
                <Lock className="text-primary h-5 w-5" />
                <h3 className="text-lg font-bold font-heading">Password</h3>
              </div>
              <UpdatePasswordForm requireCurrentPassword={hasPasswordIdentity} />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
