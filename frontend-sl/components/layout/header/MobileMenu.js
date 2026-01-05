"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useMediaQuery from "@/core/hooks/useMediaQuery";
import MobileMenuPanel from "./MobileMenuPanel";

const TABS = ["Shop", "Help"];

export default function MobileMenu({
  isOpen,
  onClose,
  menuItems = [],
  offsetTop = 0,
}) {
  const router = useRouter();

  /* ----------------------------------
     Responsive drawer width
  ---------------------------------- */
  const isTablet = useMediaQuery("(min-width: 768px)");
  const drawerWidthClass = isTablet ? "w-[70%]" : "w-full";

  /* ----------------------------------
     Animation state
  ---------------------------------- */
  const [mounted, setMounted] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [closing, setClosing] = useState(false);

  /* ----------------------------------
     Open / Close lifecycle
  ---------------------------------- */
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
    }, 300);
  };

  /* ----------------------------------
     ESC close
  ---------------------------------- */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && mounted && handleClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [mounted]);

  /* ----------------------------------
     Lock scroll
  ---------------------------------- */
  useEffect(() => {
    const html = document.documentElement;
    if (mounted || closing) html.classList.add("overflow-hidden");
    else html.classList.remove("overflow-hidden");
    return () => html.classList.remove("overflow-hidden");
  }, [mounted, closing]);

  /* ----------------------------------
     ROOT BUILDERS
  ---------------------------------- */
  const buildShopRoot = () => {
    const categories = Array.isArray(menuItems) ? menuItems : [];
    return {
      title: null,
      items: categories.map((cat) => ({
        type: "group",
        label: cat.name,
        payload: { cat },
      })),
    };
  };

  const ROOTS = useMemo(
    () => ({
      Shop: buildShopRoot(),
      Help: {
        title: "Help",
        items: [
          { type: "link", label: "Contact Us" },
          { type: "link", label: "FAQs" },
        ],
      },
    }),
    [menuItems]
  );

  /* ----------------------------------
     Stack navigation
  ---------------------------------- */
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

  /* ----------------------------------
     MAIN CLICK HANDLER (CORE LOGIC)
  ---------------------------------- */
  const handleItemClick = (item) => {
    if (!item) return;

    /* ---------- CHILD (FINAL LEAF) ---------- */
    if (item.type === "link" && item.payload?.child) {
      const { cat, sub, child } = item.payload;

      if (sub) {
        router.push(`/${cat.slug}/${sub.slug}/${child.slug}`);
      } else {
        router.push(`/${cat.slug}/${child.slug}`);
      }

      handleClose();
      return;
    }

    /* ---------- SUB CATEGORY ---------- */
    if (item.payload?.sub) {
      const { cat, sub } = item.payload;
      const children = sub.child_categories || [];

      if (!children.length) return;

      pushPanel({
        title: sub.name,
        items: children.map((child) => ({
          type: "link",
          label: child.name,
          payload: { cat, sub, child },
        })),
      });
      return;
    }

    /* ---------- CATEGORY ---------- */
    if (item.payload?.cat) {
      const cat = item.payload.cat;
      const subs = cat.sub_categories || [];
      const directChildren = cat.child_categories || [];

      // Case 1: has sub categories
      if (subs.length) {
        pushPanel({
          title: cat.name,
          items: subs.map((sub) => ({
            type: "group",
            label: sub.name,
            payload: { cat, sub },
          })),
        });
        return;
      }

      // Case 2: NO sub, direct children
      if (directChildren.length) {
        pushPanel({
          title: cat.name,
          items: directChildren.map((child) => ({
            type: "link",
            label: child.name,
            payload: { cat, child },
          })),
        });
        return;
      }
    }
  };

  if (!mounted && !closing) return null;

  return (
    <div className="fixed inset-0 z-[1001] pointer-events-none">
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`absolute left-0 right-0 bottom-0 bg-black/40
    transition-opacity duration-300
    ${animIn && !closing ? "opacity-100" : "opacity-0"}
    pointer-events-auto`}
        style={{ top: offsetTop }}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 bottom-0 bg-white shadow-xl
    flex flex-col ${drawerWidthClass}
    transition-transform duration-300
    ${animIn && !closing ? "translate-x-0" : "translate-x-full"}
    pointer-events-auto`}
        style={{
          top: offsetTop,
          height: `calc(100vh - ${offsetTop}px)`,
        }}
      >
        {/* Tabs */}
        <div className="bg-neutral-100 border-b">
          <div className="flex gap-6 px-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-sm ${
                  activeTab === tab
                    ? "font-semibold text-black"
                    : "text-neutral-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div key={panelKey} className="flex-1 overflow-hidden">
          <MobileMenuPanel
            title={currentPanel?.title}
            items={currentPanel?.items}
            onItemClick={handleItemClick}
            onBack={stack.length > 1 ? popPanel : null}
          />
        </div>
      </div>
    </div>
  );
}
