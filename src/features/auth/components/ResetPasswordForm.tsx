"use client";

import React, { useState } from "react";
import { authService } from "@/core/config/services";
import { FormField } from "@/components/ui/FormField";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setIsLoading(true);

    try {
      await authService.resetPasswordForEmail(email);
      setSuccess(true);
    } catch (err) {
      // To prevent account enumeration, we show success even if the email doesn't exist
      // Only show error for real issues like invalid email format or rate limiting
      const message = err instanceof Error ? err.message : "";
      if (message.includes("User not found") || message.includes("not registered")) {
        setSuccess(true);
      } else {
        toast.error(err instanceof Error && err.message ? err.message : "Failed to send recovery email.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 animate-fade-in">
        <div className="mx-auto w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-foreground">Recovery Email Sent</h3>
        <p className="text-muted-foreground text-sm">
          If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Email address" id="email">
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="your@email.com"
        />
      </FormField>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Sending..." : "Send recovery link"}
      </button>
    </form>
  );
}
