"use client";

import React, { useState } from "react";
import { authService } from "@/core/config/services";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormField } from "@/components/ui/FormField";
import { toast } from "sonner";

export function UpdatePasswordForm({ 
  disabled, 
  onSuccess,
  requireCurrentPassword = true
}: { 
  disabled?: boolean, 
  onSuccess?: () => void,
  requireCurrentPassword?: boolean
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (requireCurrentPassword && !currentPassword) {
      toast.error("Current password is required.");
      return;
    }

    setIsLoading(true);

    try {
      if (requireCurrentPassword) {
        await authService.reauthenticate(currentPassword);
      }

      await authService.updatePassword(newPassword);
      toast.success("Password updated successfully. You will be redirected to login.");
      
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      
      // Force logout after update so they have to log in with new password
      await authService.logout();
      
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err instanceof Error && err.message ? err.message : "Could not update password.");
    } finally {
      setIsLoading(false);
    }
  };

  if (disabled) {
    return (
      <div className="space-y-4 opacity-70">
        <h3 className="text-sm font-bold font-heading text-foreground uppercase tracking-tight">Security Credentials</h3>
        <p className="text-xs text-muted-foreground">
          You cannot change the password for an account managed by a social provider (Google).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {requireCurrentPassword && (
          <FormField label="Current Password" id="current-password">
            <PasswordInput
              id="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="text-sm font-mono border-border/50 rounded-lg focus:ring-1 focus:border-primary"
              placeholder="••••••••"
            />
          </FormField>
        )}

        <FormField label="New Password" id="new-password">
          <PasswordInput
            id="new-password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="text-sm font-mono border-border/50 rounded-lg focus:ring-1 focus:border-primary"
            placeholder="••••••••"
          />
        </FormField>

        <FormField label="Confirm New Password" id="confirm-password">
          <PasswordInput
            id="confirm-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-sm font-mono border-border/50 rounded-lg focus:ring-1 focus:border-primary"
            placeholder="••••••••"
          />
        </FormField>
      </div>

      <button
        type="submit"
        disabled={isLoading || !newPassword || !confirmPassword || (requireCurrentPassword && !currentPassword)}
        className="w-full py-3 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-wider font-bold rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
