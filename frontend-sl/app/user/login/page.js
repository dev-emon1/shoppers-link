"use client";
import AuthLayout from "@/modules/user/components/AuthLayout";
import AuthFormWrapper from "@/modules/user/components/AuthFormWrapper";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthFormWrapper mode="login" />
    </AuthLayout>
  );
}
