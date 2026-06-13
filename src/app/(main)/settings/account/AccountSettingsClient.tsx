"use client";

import React from "react";
import { useAuth } from "@/features/auth/context/auth-context";
import { MfaSetup } from "@/features/auth/components/MfaSetup";
import { IdentityManagement } from "@/features/auth/components/IdentityManagement";
import { UpdateEmailForm } from "@/features/auth/components/UpdateEmailForm";
import { UpdatePasswordForm } from "@/features/auth/components/UpdatePasswordForm";
import { User, ShieldCheck, Mail, Lock, ArrowLeft, Fingerprint } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function AccountSettingsClient() {
  const { user, isLoading } = useAuth();

  // Determine if the user is using Google OAuth or other social providers
  const isSocialUser = !!(user?.provider && user.provider !== 'email');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto w-full">
      <header className="mb-10">
        <Link 
          href="/settings" 
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-mono uppercase tracking-wider mb-6 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to settings
        </Link>
        <h2 className="text-3xl font-extrabold font-heading text-foreground tracking-tight">Account & Security</h2>
        <p className="text-muted-foreground text-xs font-mono uppercase tracking-wider mt-2">
          Manage your credentials and protect your library with MFA.
        </p>
      </header>

      <div className="space-y-8 pb-24">
        
        {/* Profile Overview */}
        <section className="bg-card border border-border/20 rounded-2xl p-6 shadow-md liquid-glass flex flex-col md:flex-row gap-6 items-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden shrink-0">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name || "User"}
                width={80}
                height={80}
                sizes="80px"
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-primary h-10 w-10" />
            )}
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold font-heading">{user?.name || "Guest Reader"}</h3>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
              <span className="px-2 py-0.5 rounded bg-accent text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                ID: {user?.id.substring(0, 8)}...
              </span>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-wider font-bold">
                {isSocialUser ? `${user?.provider} Authenticated` : "Email & Password"}
              </span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Identity Management Section */}
          <section className="bg-card border border-border/20 rounded-2xl p-6 shadow-md liquid-glass">
            <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
              <Fingerprint className="text-primary h-5 w-5" />
              <h3 className="text-lg font-bold font-heading">Login Methods</h3>
            </div>
            <IdentityManagement />
          </section>

          {/* MFA Section */}
          <section className="bg-card border border-border/20 rounded-2xl p-6 shadow-md liquid-glass relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
              <ShieldCheck className="text-primary h-5 w-5" />
              <h3 className="text-lg font-bold font-heading">Security (MFA)</h3>
            </div>
            <MfaSetup />
          </section>

          {/* Email Management */}
          <section className="bg-card border border-border/20 rounded-2xl p-6 shadow-md liquid-glass">
            <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
              <Mail className="text-primary h-5 w-5" />
              <h3 className="text-lg font-bold font-heading">Email Address</h3>
            </div>
            <UpdateEmailForm currentEmail={user?.email || ""} disabled={isSocialUser} />
          </section>

          {/* Password Management */}
          <section className="bg-card border border-border/20 rounded-2xl p-6 shadow-md liquid-glass">
            <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
              <Lock className="text-primary h-5 w-5" />
              <h3 className="text-lg font-bold font-heading">Password</h3>
            </div>
            <UpdatePasswordForm disabled={isSocialUser} requireCurrentPassword={!isSocialUser} />
          </section>

        </div>
      </div>
    </div>
  );
}
