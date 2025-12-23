"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);

  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      router.replace("/user/login");
    } else {
      setAllowed(true);
    }
  }, [user, token]);

  if (!allowed) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return children;
}
