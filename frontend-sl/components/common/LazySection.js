"use client";

import { useEffect, useState } from "react";
import useInViewOnce from "@/core/hooks/useInViewOnce";

export default function LazySection({ children }) {
  const [isReload, setIsReload] = useState(false);
  const { ref, isVisible } = useInViewOnce();

  useEffect(() => {
    // detect reload
    if (performance?.navigation?.type === 1) {
      setIsReload(true);
    }
  }, []);

  // Reload- lazy disable
  if (isReload) {
    return <>{children}</>;
  }

  return <div ref={ref}>{isVisible ? children : null}</div>;
}
