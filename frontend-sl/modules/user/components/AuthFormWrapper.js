"use client";

import Link from "next/link";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Facebook, FacebookIcon } from "lucide-react";
import { FaFacebook, FaGoogle } from "react-icons/fa6";

export default function AuthWrapper({ mode }) {
  const isLogin = mode === "login";

  return (
    <div className="min-h-[calc(100vh-150px)]  flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isLogin
              ? "Sign in to access your account"
              : "Join us to start shopping"}
          </p>
        </div>

        {/* FORM */}
        {isLogin ? <LoginForm /> : <RegisterForm />}

        {/* SOCIAL LOGIN */}
        <div className="mt-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="w-full py-2 border rounded-lg flex items-center justify-center hover:bg-gray-100">
              <span className="mr-2">
                <FaGoogle />
              </span>
              <span className="pl-2">Google</span>
            </button>

            <button className="w-full py-2 border rounded-lg flex items-center justify-center hover:bg-gray-100">
              <span className="text-blue-400 mr-2">
                <FaFacebook />
              </span>
              <span className="pl-2">Facebook</span>
            </button>
          </div>
        </div>

        {/* FOOTER LINK */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}

            {isLogin ? (
              <Link
                href="/user/register"
                prefetch
                className="ml-1 text-main font-medium"
              >
                Sign up
              </Link>
            ) : (
              <Link
                prefetch
                href="/user/login"
                className="ml-1 text-main font-medium"
              >
                Sign in
              </Link>
            )}
          </p>
        </div>

        {/* TERMS */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
