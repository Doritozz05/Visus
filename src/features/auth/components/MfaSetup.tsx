"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { authService } from "@/core/config/services";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/auth-context";
import { PasswordInput } from "@/components/ui/PasswordInput";

export function MfaSetup() {
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [mfaStatus, setMfaStatus] = useState<{ enabled: boolean; factorId?: string }>({ enabled: false });
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isUnenrolling, setIsUnenrolling] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ id: string; uri: string; secret: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Robust check: Does the user have an email/password identity?
  const hasPassword = user?.hasPassword === true;

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      setIsChecking(true);
      const status = await authService.checkMFAStatus();
      setMfaStatus(status);
    } catch (err) {
      console.error("Failed to check MFA status", err);
    } finally {
      setIsChecking(false);
    }
  };

  const startEnrollment = async () => {
    try {
      setIsEnrolling(true);
      setError(null);
      const data = await authService.enrollMFA();
      setQrCodeData(data);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Could not start MFA setup.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!qrCodeData || !verificationCode) return;
    try {
      setIsEnrolling(true);
      setError(null);
      await authService.verifyMFA(qrCodeData.id, verificationCode);
      setQrCodeData(null);
      setVerificationCode("");
      await checkStatus(); // Refresh status to show the enabled UI
    } catch (err) {
      setError("Incorrect code. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const executeDisableMfa = async () => {
    if (!mfaStatus.factorId) return;
    
    try {
      setIsUnenrolling(true);
      setError(null);

      // 1. Re-authenticate ONLY if user has a password identity
      if (hasPassword) {
        if (!confirmPassword) {
          setError("Password is required to disable MFA.");
          setIsUnenrolling(false);
          return;
        }
        await authService.reauthenticate(confirmPassword);
      }

      // 2. Unenroll
      await authService.unenrollMFA(mfaStatus.factorId);
      await checkStatus();
      setShowPasswordConfirm(false);
      setConfirmPassword("");
      toast.success("MFA has been disabled");
    } catch (err) {
      const message = err instanceof Error && err.message ? err.message : "Could not disable MFA.";
      setError(message);
      toast.error("Failed to disable MFA", { description: message });
    } finally {
      setIsUnenrolling(false);
    }
  };

  const startDisableMfa = async () => {
    if (!mfaStatus.factorId) return;

    // Safety check: AAL2 level is required to modify MFA settings
    try {
      const { currentLevel } = await authService.getAALStatus();
      if (currentLevel !== 'aal2') {
        setError("For security, you must verify your MFA code before disabling it. Please log out and log in again.");
        return;
      }
    } catch (err) {
      // Proceed and let service fail if necessary
    }

    if (!hasPassword) {
      // For Google-only users, we rely on their active AAL2 session
      toast.warning("Disable Two-Factor Authentication?", {
        description: "Your account will be less secure. This action cannot be undone.",
        action: {
          label: "Disable",
          onClick: () => executeDisableMfa(),
        },
      });
    } else {
      // For Email/Password users, we require their password as an extra proof
      setShowPasswordConfirm(true);
    }
  };

  if (isChecking) {
    return <div className="text-xs text-muted-foreground animate-pulse">Checking security status...</div>;
  }

  // ALREADY ENABLED STATE
  if (mfaStatus.enabled) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl mb-4">
            {error}
          </div>
        )}
        
        {!showPasswordConfirm ? (
          <div className="liquid-glass p-5 rounded-2xl border border-border/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-foreground font-heading">Two-Factor Authentication Active</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your account is protected by an authenticator app.
                </p>
              </div>
            </div>
            
            <button
              onClick={startDisableMfa}
              disabled={isUnenrolling}
              className="w-full md:w-auto px-5 py-2 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 border border-border hover:border-destructive/30 rounded-xl transition-all disabled:opacity-50"
            >
              {isUnenrolling ? "Disabling..." : "Disable MFA"}
            </button>
          </div>
        ) : (
          <div className="liquid-glass p-6 rounded-2xl border border-destructive/30 bg-destructive/5 space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <h4 className="text-sm font-bold text-foreground">Confirm Password to Disable MFA</h4>
            <p className="text-xs text-muted-foreground">
              This is a sensitive action. Please enter your password to confirm.
            </p>
            <div className="max-w-sm">
              <PasswordInput
                id="disable-mfa-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your current password"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={executeDisableMfa}
                disabled={isUnenrolling || !confirmPassword}
                className="px-4 py-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-lg hover:brightness-110 disabled:opacity-50"
              >
                {isUnenrolling ? "Disabling..." : "Confirm & Disable"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordConfirm(false);
                  setConfirmPassword("");
                  setError(null);
                }}
                className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // NOT ENABLED STATE
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold font-heading text-foreground">Multi-Factor Auth (MFA)</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Add an extra layer of security using an authenticator app like Google Authenticator or Authy.
          </p>
        </div>
        {!qrCodeData && (
          <button
            onClick={startEnrollment}
            disabled={isEnrolling}
            className="w-full md:w-auto px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium text-sm shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
          >
            {isEnrolling ? "Initialing..." : "Setup MFA"}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
          {error}
        </div>
      )}

      {qrCodeData && (
        <div className="liquid-glass p-6 rounded-2xl border border-border/50 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Step 1</span>
                <h4 className="text-base font-bold font-heading">Scan QR Code</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Open your app and scan the code. If you can&apos;t scan, use this manual key:
                </p>
                <div className="group relative">
                  <code className="block w-full bg-secondary/50 p-3 rounded-xl text-[11px] font-mono break-all border border-border group-hover:border-primary/30 transition-colors select-all">
                    {qrCodeData.secret}
                  </code>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-2xl shadow-xl border border-border">
                <QRCodeSVG value={qrCodeData.uri} size={160} />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Step 2</span>
              <label className="block text-base font-bold font-heading" htmlFor="mfa-code">
                Enter Verification Code
              </label>
              <input
                id="mfa-code"
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-4 py-4 text-center tracking-[0.5em] text-2xl font-mono bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            
            <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-2">
              <button
                onClick={async () => {
                  if (qrCodeData?.id) {
                    try {
                      await authService.unenrollMFA(qrCodeData.id);
                    } catch (err) {
                      // Silently fail if we can't unenroll
                      console.debug("Failed to unenroll MFA during cancellation:", err);
                    }
                  }
                  setQrCodeData(null);
                  await checkStatus(); // Refresh status
                }}
                className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={verifyAndEnable}
                disabled={isEnrolling || verificationCode.length !== 6}
                className="px-8 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify and Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
