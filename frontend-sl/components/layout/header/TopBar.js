"use client";
import React, { useState, useRef } from "react";
import { ChevronDown, Handshake, House } from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";

const TopBar = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isWayStoreOpen, setIsWayStoreOpen] = useState(false);

  const [helpPos, setHelpPos] = useState({ top: 0, right: 0 });
  const [waysPos, setWaysPos] = useState({ top: 0, right: 0 });

  const helpRef = useRef(null);
  const waysRef = useRef(null);

  const getPortal = () => {
    if (typeof window === "undefined") return null;
    return document.getElementById("topbar-portal");
  };

  const openHelp = () => {
    if (helpRef.current) {
      const rect = helpRef.current.getBoundingClientRect();
      setHelpPos({
        top: rect.bottom + 2,
        right: window.innerWidth - rect.right,
      });
    }
    setIsHelpOpen(true);
  };

  const openWays = () => {
    if (waysRef.current) {
      const rect = waysRef.current.getBoundingClientRect();
      setWaysPos({
        top: rect.bottom + 2,
        right: window.innerWidth - rect.right,
      });
    }
    setIsWayStoreOpen(true);
  };

  return (
    <div className="hidden lg:block bg-main text-textWhite text-sm py-1 relative z-40">
      <div className="container flex justify-between items-center">
        {/* Left Text */}
        <div>
          <Link
            href="#"
            prefetch={false}
            className="text-white uppercase text-xs font-medium hover:underline"
          >
            Always Worth What You Pay For
          </Link>
        </div>

        {/* Right links */}
        <div className="flex gap-6 font-medium text-xs">
          {/* Partner Access */}
          <Link
            href={`${process.env.NEXT_PUBLIC_PARTNER_PORTAL_URL || "#"}`}
            target="_blank"
            prefetch={false}
            className="text-white flex items-center gap-2 hover:text-secondary"
          >
            <Handshake size={14} />
            Partner Access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
