"use client";

import React from "react";

export default function HelpLine() {
  return (
    <a
      href="https://wa.me/+8801401446644"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-3 right-0 z-50"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png"
        alt="WhatsApp"
        width={40}
        height={40}
        className=" hover:scale-110 transition-transform duration-300"
      />
    </a>
  );
}
