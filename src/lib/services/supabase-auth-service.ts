import { IAuthService, Session, User, UserIdentity } from "@/core/services/interfaces";
import { supabase } from "@/lib/supabase";

export class SupabaseAuthService implements IAuthService {
  
  // --- Traditional & Social ---

  async signUp(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // In local development or if you don't want temporary email confirmation,
        // you can manage the redirection URLs here.
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
      }
    });
    if (error) throw new Error(error.message);
  }

  async signInWithPassword(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  }

  async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
      },
    });
    if (error) throw new Error(error.message);
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  // --- Account Linking ---

  async linkIdentity(provider: 'google'): Promise<void> {
    const { error } = await supabase.auth.linkIdentity({
      provider,
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback?next=/settings?tab=account` : undefined,
      }
    });
    if (error) throw new Error(error.message);
  }

  async unlinkIdentity(identityId: string): Promise<void> {
    // Note: To unlink, user must have at least 2 identities.
    // Supabase will throw error otherwise.
    const { data: identities, error: fetchError } = await supabase.auth.getUserIdentities();
    if (fetchError) throw new Error(fetchError.message);

    const identity = identities.identities.find(id => id.id === identityId);
    if (!identity) throw new Error("Identity not found.");

    const { error } = await supabase.auth.unlinkIdentity(identity);
    if (error) throw new Error(error.message);
  }

  async getUserIdentities(): Promise<UserIdentity[]> {
    const { data, error } = await supabase.auth.getUserIdentities();
    if (error) throw new Error(error.message);
    
    return data.identities.map(id => ({
      id: id.id,
      provider: id.provider,
      identity_data: id.identity_data,
      last_sign_in_at: id.last_sign_in_at,
    }));
  }

  // --- Security and Recovery ---

  async reauthenticate(password: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) throw new Error("No user session found.");

    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });
    
    if (error) throw new Error("Invalid current password.");
  }

  async resetPasswordForEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback?next=/update-password` : undefined,
    });
    if (error) throw new Error(error.message);
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
  }

  async updateEmail(newEmail: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) throw new Error(error.message);
  }

  // --- MFA (TOTP) ---

  async checkMFAStatus(): Promise<{ enabled: boolean; factorId?: string }> {
    const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) throw new Error(factorsError.message);

    const allFactors = [...(factorsData.totp || []), ...(factorsData.phone || [])];
    const verifiedFactors = allFactors.filter(factor => factor.status === 'verified');
    
    if (verifiedFactors.length > 0) {
       return { enabled: true, factorId: verifiedFactors[0].id };
    }

    return { enabled: false };
  }

  async getAALStatus(): Promise<{ currentLevel: string; nextLevel: string; factorId?: string }> {
    try {
      // Pre-emptive offline check to avoid "Failed to fetch" noise
      if (typeof window !== 'undefined' && !window.navigator.onLine) {
        return { currentLevel: 'aal1', nextLevel: 'aal1' };
      }

      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error) throw error;

      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) throw factorsError;

      const allFactors = [...(factorsData.totp || []), ...(factorsData.phone || [])];
      const verifiedFactor = allFactors.find(factor => factor.status === 'verified');

      return {
        currentLevel: data?.currentLevel || 'aal1',
        nextLevel: data?.nextLevel || 'aal1',
        factorId: verifiedFactor?.id,
      };
    } catch (err) {
      // Fail silently for network errors
      return {
        currentLevel: 'aal1',
        nextLevel: 'aal1',
      };
    }
  }

  async enrollMFA(): Promise<{ id: string; uri: string; secret: string }> {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
    });
    if (error) throw new Error(error.message);
    
    return {
      id: data.id,
      uri: data.totp.uri,
      secret: data.totp.secret,
    };
  }

  async verifyMFA(factorId: string, code: string): Promise<void> {
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError) throw new Error(challengeError.message);

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });
    if (verifyError) throw new Error(verifyError.message);
  }

  async unenrollMFA(factorId: string): Promise<void> {
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) throw new Error(error.message);
  }

  // --- Session and State ---

  async getSession(): Promise<Session | null> {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at || 0,
    };
  }

  async getUser(): Promise<User | null> {
    const isOffline = typeof window !== 'undefined' && !window.navigator.onLine;

    const getLocalSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const hasPassword = session.user.identities?.some(id => id.provider === 'email') || false;
          return {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name,
            avatarUrl: session.user.user_metadata?.avatar_url,
            provider: session.user.app_metadata?.provider || session.user.identities?.[0]?.provider,
            hasPassword,
          };
        }
      } catch (_) { /* silent */ }
      return null;
    };

    if (isOffline) return getLocalSession();

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return getLocalSession();
      
      const hasPassword = user.identities?.some(id => id.provider === 'email') || false;

      return {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.full_name,
        avatarUrl: user.user_metadata?.avatar_url,
        provider: user.app_metadata?.provider || user.identities?.[0]?.provider,
        hasPassword,
      };
    } catch (err) {
      // Capture all network/fetch errors silently and fallback
      return getLocalSession();
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const hasPassword = session.user.identities?.some(id => id.provider === 'email') || false;
        callback({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name,
          avatarUrl: session.user.user_metadata?.avatar_url,
          provider: session.user.app_metadata?.provider || session.user.identities?.[0]?.provider,
          hasPassword,
        });
      } else {
        callback(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }
}
