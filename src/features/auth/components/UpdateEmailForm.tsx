"use client";

import React, { useState } from "react";
import { authService } from "@/core/config/services";
import { PasswordInput } from "@/components/ui/PasswordInput";

export function UpdateEmailForm({ currentEmail, disabled }: { currentEmail: string, disabled?: boolean }) {
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      await authService.reauthenticate(currentPassword);
      await authService.updateEmail(newEmail);
      setSuccess(true);
      setNewEmail("");
      setCurrentPassword("");
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Could not update email address.");
    } finally {
      setIsLoading(false);
    }
  };

  if (disabled) {
    return (
      <div className="space-y-4 opacity-70">
        <h3 className="text-sm font-bold font-heading text-foreground">Email Address</h3>
        <p className="text-xs text-muted-foreground">
          Your email is managed by your social authentication provider (Google).
        </p>
        <div className="p-3 bg-accent/30 rounded-lg border border-border/30 text-xs font-mono text-muted-foreground">
          {currentEmail}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold font-heading text-foreground uppercase tracking-tight">Update Email</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Confirmations will be sent to both your current and new email addresses.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-[10px] font-mono uppercase tracking-wider text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-[10px] font-mono uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            Confirmation links have been sent to both email addresses.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-foreground" htmlFor="new-email">
              New Email Address
            </label>
            <input
              id="new-email"
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-mono"
              placeholder="new@email.com"
            />
          </div>

          <PasswordInput
            id="current-password-email"
            label="Current Password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="text-sm font-mono border-border/50 rounded-lg focus:ring-1 focus:border-primary"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !newEmail || !currentPassword}
          className="px-6 py-2 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-wider font-bold rounded hover:brightness-110 transition-all disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Change Email"}
        </button>
      </form>
    </div>
  );
}
