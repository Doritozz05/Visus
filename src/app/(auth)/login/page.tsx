import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to continue reading where you left off"
    >
      <LoginForm />
    </AuthLayout>
  );
}
