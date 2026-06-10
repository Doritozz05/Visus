"use client";

import * as React from "react";
import { User } from "@/core/services/interfaces";
import { authService } from "@/core/config/services";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  React.useEffect(() => {
    // Initial check
    const initAuth = async () => {
      try {
        const currentUser = await authService.getUser();
        setUser(currentUser);
        
        if (currentUser) {
          const aal = await authService.getAALStatus();

          // Client-side MFA Guard
          const protectedPaths = ['/library', '/settings', '/dashboard', '/reader'];
          const isProtectedRoute = protectedPaths.some(path => window.location.pathname.startsWith(path));

          if (isProtectedRoute && aal.currentLevel !== 'aal2' && aal.factorId) {
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

          // Client-side MFA Guard on state change
          const protectedPaths = ['/library', '/settings', '/dashboard', '/reader'];
          const isProtectedRoute = protectedPaths.some(path => window.location.pathname.startsWith(path));

          if (isProtectedRoute && aal.currentLevel !== 'aal2' && aal.factorId) {
            setIsRedirecting(true);
            window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
          }
        } catch (aalErr) {
          console.warn("Could not verify AAL status (offline):", aalErr);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (isLoading || isRedirecting) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
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
