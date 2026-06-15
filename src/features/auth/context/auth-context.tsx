"use client";

import * as React from "react";
import { User } from "@/core/services/interfaces";
import { authService } from "@/core/config/services";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isMfaPending: boolean;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isMfaPending, setIsMfaPending] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    // Initial check
    const initAuth = async () => {
      try {
        const currentUser = await authService.getUser();
        setUser(currentUser);
        
        if (currentUser) {
          const aal = await authService.getAALStatus();
          const mfaRequired = aal.currentLevel !== 'aal2' && !!aal.factorId;
          setIsMfaPending(mfaRequired);

          // Client-side MFA Guard
          const protectedPaths = ['/library', '/settings', '/dashboard', '/reader'];
          const isProtectedRoute = protectedPaths.some(path => window.location.pathname.startsWith(path));

          if (isProtectedRoute && mfaRequired) {
            setIsRedirecting(true);
            window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
            return;
          }
        }
      } catch (error) {
        // Use console.warn for initialization errors to avoid Next.js dev overlay in offline mode
        console.warn("Auth initialization warning (expected if offline):", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for changes
    const unsubscribe = authService.onAuthStateChange(async (updatedUser) => {
      setUser(updatedUser);
      if (updatedUser) {
        try {
          const aal = await authService.getAALStatus();
          const mfaRequired = aal.currentLevel !== 'aal2' && !!aal.factorId;
          setIsMfaPending(mfaRequired);

          // Client-side MFA Guard on state change
          const protectedPaths = ['/library', '/settings', '/dashboard', '/reader'];
          const isProtectedRoute = protectedPaths.some(path => window.location.pathname.startsWith(path));

          if (isProtectedRoute && mfaRequired) {
            setIsRedirecting(true);
            window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
          }
        } catch (aalErr) {
          console.warn("Could not verify AAL status (offline):", aalErr);
        }
      } else {
        setIsMfaPending(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsMfaPending(false);
  };

  // On the server, we MUST render children to allow SEO crawlers to see the content.
  // The loading/redirecting state should only block rendering on the client.
  if (isMounted && (isLoading || isRedirecting)) {
    // If it's a protected route, we can show null/spinner, 
    // but for the landing page (which is public), we should ideally show the content.
    // To be safe for SEO, we only block if we are SURE we are on a protected route.
    const protectedPaths = ['/library', '/settings', '/dashboard', '/reader'];
    const isProtectedRoute = typeof window !== 'undefined' && protectedPaths.some(path => window.location.pathname.startsWith(path));
    
    if (isProtectedRoute) {
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isMfaPending, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
