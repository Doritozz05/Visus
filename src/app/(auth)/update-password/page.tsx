"use client";

import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { UpdatePasswordForm } from "@/features/auth/components/UpdatePasswordForm";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Wait a bit so the user can see the success message
    setTimeout(() => {
      router.push("/library");
    }, 2000);
  };

  return (
    <AuthLayout 
      title="Update Password" 
      subtitle="Enter your new password below to secure your account"
    >
      <div className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
        <UpdatePasswordForm onSuccess={handleSuccess} />
      </div>
    </AuthLayout>
  );
}
