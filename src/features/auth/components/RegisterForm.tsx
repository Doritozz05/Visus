"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authService } from "@/core/config/services";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { PasswordInput } from "@/components/ui/PasswordInput";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightGoogle, setHighlightGoogle] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setHighlightGoogle(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.signUp(email, password);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("already registered") || message.includes("already exists")) {
        setError("An account with this email already exists. Try signing in with Google.");
        setHighlightGoogle(true);
      } else {
        setError(err instanceof Error && err.message ? err.message : "Error creating account.");
      }
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6 animate-fade-in">
        <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">Check your inbox</h3>
          <p className="text-muted-foreground text-sm">
            We've sent a confirmation link to <strong>{email}</strong>.
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-xl space-y-3 border border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Already have an account?
          </p>
          <p className="text-sm text-foreground">
            If you didn't receive the email, you might have signed up with Google before.
          </p>
          <GoogleSignInButton />
        </div>

        <div className="pt-2">
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={highlightGoogle ? "animate-bounce ring-2 ring-primary rounded-xl p-0.5" : ""}>
        <GoogleSignInButton />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">Or sign up with email</span>
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

        <div className="space-y-4">
          <div className="space-y-2">
            <PasswordInput
              id="password"
              label="Password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 chars"
            />
          </div>

          <div className="space-y-2">
            <PasswordInput
              id="confirm-password"
              label="Confirm Password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
