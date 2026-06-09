import { IAuthService, Session, User } from "@/core/services/interfaces";
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

  // --- Security and Recovery ---

  async resetPasswordForEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/reset-password` : undefined,
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
    const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (error) throw new Error(error.message);

    const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) throw new Error(factorsError.message);

    const allFactors = [...(factorsData.totp || []), ...(factorsData.phone || [])];
    const verifiedFactor = allFactors.find(factor => factor.status === 'verified');

    return {
      currentLevel: data?.currentLevel || 'aal1',
      nextLevel: data?.nextLevel || 'aal1',
      factorId: verifiedFactor?.id,
    };
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
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.full_name,
      avatarUrl: user.user_metadata?.avatar_url,
    };
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name,
          avatarUrl: session.user.user_metadata?.avatar_url,
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
