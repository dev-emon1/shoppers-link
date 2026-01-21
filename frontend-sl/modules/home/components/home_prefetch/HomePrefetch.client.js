"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePrefetchClient() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/brands");
    router.prefetch("/products");
  }, [router]);

  return null;
  z;
}
