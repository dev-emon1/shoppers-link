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
            href={`${process.env.NEXT_PUBLIC_PARTNER_PORTAL_URL || "#"}/login`}
            target="_blank"
            prefetch={false}
            className="text-white flex items-center gap-2 hover:text-secondary"
          >
            <Handshake size={14} />
            Partner Access
          </Link>

          {/* HELP */}
          {/* <div
            className="relative"
            onMouseEnter={openHelp}
            onMouseLeave={() => setIsHelpOpen(false)}
          >
            <div
              ref={helpRef}
              className="text-white flex items-center gap-1 cursor-pointer hover:text-secondary"
            >
              Help <ChevronDown size={15} />
            </div>

            {isHelpOpen &&
              getPortal() &&
              createPortal(
                <div
                  className="fixed w-48 bg-bgPage shadow-md text-secondary animate-fadeIn z-[999999]"
                  style={{
                    top: helpPos.top,
                    right: helpPos.right,
                  }}
                >
                  <ul className="flex flex-col py-2">
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 hover:underline"
                      >
                        Customer services
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 hover:underline"
                      >
                        Track your order
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 hover:underline"
                      >
                        Returns and refunds
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 hover:underline"
                      >
                        Delivery and collection
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 hover:underline"
                      >
                        Product support
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 hover:underline"
                      >
                        Contact us
                      </Link>
                    </li>
                  </ul>
                </div>,
                getPortal()
              )}
          </div> */}

          {/* WAYS TO SHOP */}
          {/* <div
            className="relative"
            onMouseEnter={openWays}
            onMouseLeave={() => setIsWayStoreOpen(false)}
          >
            <div
              ref={waysRef}
              className="text-white flex items-center gap-1 cursor-pointer hover:text-secondary"
            >
              Ways to shop <ChevronDown size={15} />
            </div>

            {isWayStoreOpen &&
              getPortal() &&
              createPortal(
                <div
                  className="fixed w-48 bg-bgPage shadow-md text-secondary animate-fadeIn z-[999999]"
                  style={{
                    top: waysPos.top,
                    right: waysPos.right,
                  }}
                >
                  <ul className="flex flex-col py-2">
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 hover:underline"
                      >
                        Service & experiences
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 hover:underline"
                      >
                        Gift cards
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 hover:underline"
                      >
                        Our app
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="block px-4 py-2 hover:underline"
                      >
                        Brand A-Z
                      </Link>
                    </li>
                  </ul>
                </div>,
                getPortal()
              )}
          </div> */}

          {/* Our Store */}
          {/* <div className="text-white flex items-center gap-2 cursor-pointer hover:text-secondary">
            <House size={14} />
            Our store
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
