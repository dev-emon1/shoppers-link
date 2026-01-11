"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function HelpLine() {
  const [mounted, setMounted] = useState(false);

  //  hydration-safe
  useEffect(() => {
    setMounted(true);
  }, []);

  //  server & first render
  if (!mounted) return null;

  return (
    <a
      href="https://wa.me/8801401446644"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-3 right-3 z-50
                 w-11 h-11 rounded-full
                 bg-[#25D366] text-white
                 flex items-center justify-center
                 shadow-lg hover:scale-110 transition"
    >
      <FaWhatsapp size={24} />
    </a>
  );
}
