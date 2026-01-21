"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useInViewOnce
 * Renders content only once when it enters viewport
 */
export default function useInViewOnce(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "120px", // preload before visible
        threshold: 0.1,
        ...options,
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isVisible, options]);

  return { ref, isVisible };
}
