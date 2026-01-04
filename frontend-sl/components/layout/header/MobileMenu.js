"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import MobileMenuPanel from "./MobileMenuPanel";
import { useRouter } from "next/navigation";
import useMediaQuery from "@/core/hooks/useMediaQuery";

const TABS = ["Shop", "Help"];

export default function MobileMenu({ isOpen, onClose, menuItems = [] }) {
  const router = useRouter();

  // Tablet gets 70%, mobile full
  const isTablet = useMediaQuery("(min-width: 768px)");
  const drawerWidthClass = isTablet ? "w-[70%]" : "w-full";
  const showOverlay = true;

  const [mounted, setMounted] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const t = setTimeout(() => setAnimIn(true), 0);
      return () => clearTimeout(t);
    } else if (!closing) {
      setMounted(false);
      setAnimIn(false);
    }
  }, [isOpen, closing]);

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setAnimIn(false);

    setTimeout(() => {
      setClosing(false);
      setMounted(false);
      onClose?.();
    }, 350);
  };

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && mounted && handleClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [mounted]);

  useEffect(() => {
    const html = document.documentElement;
    if (mounted || closing) html.classList.add("overflow-hidden");
    else html.classList.remove("overflow-hidden");
    return () => html.classList.remove("overflow-hidden");
  }, [mounted, closing]);

  // ---------- ROOT BUILDERS ----------
  const buildRootForShop = () => {
    const categories = Array.isArray(menuItems) ? menuItems : [];
    return {
      title: null,
      items: categories.map((cat) => ({
        type: "group",
        label: cat.name || "Unknown",
        payload: { cat },
      })),
    };
  };

  const ROOTS = useMemo(
    () => ({
      Shop: buildRootForShop(),
    }),
    [menuItems]
  );

  const [activeTab, setActiveTab] = useState("Shop");
  const [stack, setStack] = useState([ROOTS["Shop"]]);
  const [panelKey, setPanelKey] = useState(0);

  useEffect(() => {
    setStack([ROOTS[activeTab]]);
    setPanelKey((k) => k + 1);
  }, [activeTab, ROOTS]);

  const pushPanel = (panel) => {
    setStack((prev) => [...prev, panel]);
    setPanelKey((k) => k + 1);
  };

  const popPanel = () => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
    setPanelKey((k) => k + 1);
  };

  const currentPanel = stack[stack.length - 1];

  if (!mounted && !closing) return null;

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      {showOverlay && (
        <div
          onClick={handleClose}
          className={`absolute left-0 right-0 top-[119.44px] bottom-0 bg-black/40
            transition-opacity duration-300
            ${animIn && !closing ? "opacity-100" : "opacity-0"}
            pointer-events-auto`}
        />
      )}

      <div
        className={`absolute right-0 top-[119.44px] h-[calc(100%-119.44px)]
          bg-white shadow-xl flex flex-col ${drawerWidthClass}
          transition-transform duration-300
          ${animIn && !closing ? "translate-x-0" : "translate-x-full"}
          pointer-events-auto`}
      >
        {/* Tabs */}
        <div className="bg-neutral-100 border-b">
          <div className="flex gap-5 px-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 ${
                  activeTab === tab ? "font-semibold" : "text-neutral-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div key={panelKey} className="flex-1 overflow-hidden">
          <MobileMenuPanel
            title={currentPanel?.title}
            items={currentPanel?.items}
            onItemClick={(item) => pushPanel(item)}
            onBack={stack.length > 1 ? popPanel : null}
          />
        </div>
      </div>
    </div>
  );
}
