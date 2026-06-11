"use client";

import { useState } from "react";
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
      <LoginForm onMfaStateChange={setIsMfa} />
    </AuthLayout>
  );
}
