"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authService } from "@/core/config/services";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/PasswordInput";

interface LoginFormProps {
  onMfaStateChange?: (isMfa: boolean) => void;
}

export function LoginForm({ onMfaStateChange }: LoginFormProps) {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onMfaStateChange?.(!!mfaFactorId);
  }, [mfaFactorId, onMfaStateChange]);

  useEffect(() => {
    if (oauthError === "OauthFailed") {
      toast.error("Authentication failed", {
        description: "There was a problem signing in with Google. Please try again.",
      });
    }
  }, [oauthError]);

  // Check for existing AAL1 session that needs AAL2 (e.g., after Google Login or Middleware redirect)
  useEffect(() => {
    async function checkExistingMfaChallenge() {
      try {
        const session = await authService.getSession();
        if (!session) {
          return;
        }

        const { currentLevel, factorId } = await authService.getAALStatus();
        
        // If we are logged in but not at AAL2, and we have a verified factor, trigger MFA challenge.
        if (currentLevel !== 'aal2' && factorId) {
          setMfaFactorId(factorId);
        }
      } catch (err) {
        // Silently fail
      }
    }
    checkExistingMfaChallenge();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mfaFactorId) {
        // Step 2: Verify MFA code
        await authService.verifyMFA(mfaFactorId, mfaCode);
        window.location.href = "/library";
        return;
      }

      // Step 1: Initial password sign in
      await authService.signInWithPassword(email, password);
      
      // Check if MFA challenge is needed
      const { currentLevel, factorId } = await authService.getAALStatus();
      
      if (currentLevel !== 'aal2' && factorId) {
        // MFA is enrolled but not yet verified for this session
        setMfaFactorId(factorId);
        setIsLoading(false);
      } else {
        // No MFA or already verified
        window.location.href = "/library";
      }
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Error signing in.");
      setIsLoading(false);
    }
  };

  if (mfaFactorId) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Two-Step Verification</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the 6-digit code from your authenticator app.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <input
              type="text"
              required
              maxLength={6}
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
              className="w-full px-3 py-3 text-center tracking-[0.5em] text-2xl font-mono bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="000000"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || mfaCode.length !== 6}
            className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              try {
                await authService.logout();
                setMfaFactorId(null);
                setMfaCode("");
                setError(null);
              } catch (err) {
                setError("Error cancelling login.");
              } finally {
                setIsLoading(false);
              }
            }}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {isLoading ? "Cancelling..." : "Back to login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GoogleSignInButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="you@email.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground" htmlFor="password">
              Password
            </label>
            <Link href="/reset-password" className="text-xs font-medium text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Sign up for free
        </Link>
      </div>
    </div>
  );
}
