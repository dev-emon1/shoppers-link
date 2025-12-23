"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function useDropdownController({
  isOpen,
  setIsOpen,
  closeOnRouteChange = true,
} = {}) {
  const ref = useRef(null);
  const pathname = usePathname();

  /* 🔹 Close dropdown */
  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  /* 🔹 Toggle */
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  /* 🔹 Outside click */
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  /* 🔹 Route change close */
  useEffect(() => {
    if (closeOnRouteChange) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /* 🔹 Menu item helper */
  const bindMenuItem = (callback) => {
    return (e) => {
      callback?.(e);
      close();
    };
  };

  return {
    ref,
    isOpen,
    toggle,
    close,
    bindMenuItem,
  };
}
