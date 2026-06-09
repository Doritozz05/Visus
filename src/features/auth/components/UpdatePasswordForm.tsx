"use client";

import React, { useState } from "react";
import { authService } from "@/core/config/services";

export function UpdatePasswordForm({ disabled }: { disabled?: boolean }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.updatePassword(newPassword);
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Could not update password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (disabled) {
    return (
      <div className="space-y-4 opacity-70">
        <h3 className="text-sm font-bold font-heading text-foreground uppercase tracking-tight">Security Credentials</h3>
        <p className="text-xs text-muted-foreground">
          You cannot change the password for an account linked to Google from here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold font-heading text-foreground uppercase tracking-tight">Update Password</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Choose a strong, unique password for your account.
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
            Password updated successfully.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-foreground" htmlFor="new-password">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-mono"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-foreground" htmlFor="confirm-password">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm font-mono"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !newPassword || !confirmPassword}
          className="px-6 py-2 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-wider font-bold rounded hover:brightness-110 transition-all disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
