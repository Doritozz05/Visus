"use client";

import { useState, Suspense } from "react";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const [isMfa, setIsMfa] = useState(false);

  return (
    <AuthLayout 
      title={isMfa ? "Security Verification" : "Welcome back"} 
      subtitle={isMfa ? "Protect your account with two-step verification" : "Sign in to continue reading where you left off"}
      showBackButton={!isMfa}
    >
      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
        <LoginForm onMfaStateChange={setIsMfa} />
      </Suspense>
    </AuthLayout>
  );
}
