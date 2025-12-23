"use client";
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-main/50 via-main-20 to-indigo-100 p-4">
      {children}
    </div>
  );
}
