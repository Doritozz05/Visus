"use client";

import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { UpdatePasswordForm } from "@/features/auth/components/UpdatePasswordForm";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Wait a bit so the user can see the success message
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <AuthLayout 
      title="Update Password" 
      subtitle="Enter your new password below to secure your account"
      showBackButton={false}
    >
      <UpdatePasswordForm onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
