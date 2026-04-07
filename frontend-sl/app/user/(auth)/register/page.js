"use client";
import AuthLayout from "@/modules/user/components/AuthLayout";
import OtpModal from "@/modules/user/components/OtpModal";
import AuthFormWrapper from "@/modules/user/components/AuthFormWrapper";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthFormWrapper mode="register" />
      <OtpModal />
    </AuthLayout>
  );
}
