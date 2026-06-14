"use client";

import React, { useState, useEffect } from "react";
import { authService } from "@/core/config/services";
import { UserIdentity } from "@/core/services/interfaces";
import { toast } from "sonner";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { Mail, Globe, Trash2, Link as LinkIcon } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function IdentityManagement() {
  const [identities, setIdentities] = useState<UserIdentity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unlinkConfirm, setUnlinkConfirm] = useState<{ id: string, provider: string } | null>(null);

  useEffect(() => {
    loadIdentities();
  }, []);

  const loadIdentities = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getUserIdentities();
      setIdentities(data);
    } catch (err) {
      console.error("Failed to load identities", err);
      toast.error("Failed to load account connections");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkGoogle = async () => {
    try {
      await authService.linkIdentity('google');
    } catch (err) {
      console.error("Failed to link Google account:", err);
      toast.error("Failed to link Google account", {
        description: err instanceof Error ? err.message : "An unexpected error occurred."
      });
    }
  };

  const handleUnlink = async (identityId: string, provider: string) => {
    if (identities.length <= 1) {
      toast.error("You cannot unlink your only login method.");
      return;
    }

    setUnlinkConfirm({ id: identityId, provider });
  };

  if (isLoading) {
    return <div className="animate-pulse text-xs text-muted-foreground font-mono">Loading identities...</div>;
  }

  const hasGoogle = identities.some(id => id.provider === 'google');
  const hasEmail = identities.some(id => id.provider === 'email');

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {identities.map((identity) => (
          <div 
            key={identity.id}
            className="flex items-center justify-between p-4 bg-accent/20 border border-border/50 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border/50">
                {identity.provider === 'google' ? (
                  <Globe className="h-4 w-4 text-primary" />
                ) : (
                  <Mail className="h-4 w-4 text-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold font-heading capitalize">{identity.provider} Account</p>
                <p className="text-[10px] text-muted-foreground font-mono">
                  Linked: {identity.last_sign_in_at ? new Date(identity.last_sign_in_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleUnlink(identity.id, identity.provider)}
              disabled={identities.length <= 1}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
              title="Unlink identity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {!hasGoogle && (
        <button
          onClick={handleLinkGoogle}
          className="w-full flex items-center justify-center gap-2 py-3 bg-secondary text-secondary-foreground text-[10px] font-mono uppercase tracking-wider font-bold rounded-xl hover:brightness-110 transition-all border border-border/50"
        >
          <LinkIcon className="h-3 w-3" />
          Link Google Account
        </button>
      )}

      {identities.length === 1 && (
        <p className="text-[10px] text-muted-foreground font-mono leading-relaxed italic">
          * You must have at least one identity linked to access your account. Link another method before unlinking the current one.
        </p>
      )}

      {/* Unlink Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!unlinkConfirm}
        onClose={() => setUnlinkConfirm(null)}
        onConfirm={async () => {
          if (!unlinkConfirm) return;
          try {
            await authService.unlinkIdentity(unlinkConfirm.id);
            toast.success(`${unlinkConfirm.provider} unlinked successfully`);
            loadIdentities();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to unlink identity");
          }
        }}
        title={`Remove ${unlinkConfirm?.provider} connection?`}
        description="You will no longer be able to sign in using this method. Make sure you have another way to access your account."
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  );
}
