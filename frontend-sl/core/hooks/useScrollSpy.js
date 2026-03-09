"use client";

import { useEffect, useState } from "react";

export default function useScrollSpy(ids = []) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!ids.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
      },
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
