"use client";

import { useEffect, useRef } from "react";

export default function useSmartPolling({
  enabled,
  callback,
  fastInterval = 15000,
  slowInterval = 60000,
}) {
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const runPolling = () => {
      clearInterval(intervalRef.current);

      const interval = document.hidden ? slowInterval : fastInterval;

      intervalRef.current = setInterval(() => {
        if (document.hidden) return; // 🔥 no polling in background
        callback();
      }, interval);
    };

    runPolling();

    document.addEventListener("visibilitychange", runPolling);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", runPolling);
    };
  }, [enabled, callback, fastInterval, slowInterval]);
}
