import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email address and we'll send you instructions"
    >
      <div className="space-y-6">
        <ResetPasswordForm />
        
        <div className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
