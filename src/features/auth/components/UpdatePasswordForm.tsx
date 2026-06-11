"use client";

import React, { useState } from "react";
import { authService } from "@/core/config/services";
import { PasswordInput } from "@/components/ui/PasswordInput";

export function UpdatePasswordForm({ disabled, onSuccess }: { disabled?: boolean, onSuccess?: () => void }) {
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
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Could not update password.");
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
          <PasswordInput
            id="new-password"
            label="New Password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="text-sm font-mono border-border/50 rounded-lg focus:ring-1 focus:border-primary"
            placeholder="••••••••"
          />

          <PasswordInput
            id="confirm-password"
            label="Confirm New Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-sm font-mono border-border/50 rounded-lg focus:ring-1 focus:border-primary"
            placeholder="••••••••"
          />
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
