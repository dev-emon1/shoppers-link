"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MobileMenuPanel from "./MobileMenuPanel";
import { useRouter } from "next/navigation";

const TABS = ["Shop", "Brands", "Services", "Help", "Money"];

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);

    setMatches(m.matches);

    try {
      m.addEventListener("change", onChange);
    } catch {
      m.addListener(onChange);
    }

    return () => {
      try {
        m.removeEventListener("change", onChange);
      } catch {
        m.removeListener(onChange);
      }
    };
  }, [query]);

  return matches;
}

export default function MobileMenu({ isOpen, onClose, menuItems = [] }) {
  const router = useRouter();

  const isMin600 = useMediaQuery("(min-width: 600px)");
  const drawerWidthClass = isMin600 ? "w-[70%]" : "w-full";
  const showOverlay = isMin600;

  const [mounted, setMounted] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [closing, setClosing] = useState(false);
  const blockReopenRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      if (!closing) {
        const t = setTimeout(() => setAnimIn(true), 0);
        return () => clearTimeout(t);
      }
    } else {
      if (!closing) {
        setMounted(false);
        setAnimIn(false);
      }
    }
  }, [isOpen, closing]);

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setAnimIn(false);
    blockReopenRef.current = true;

    const t = setTimeout(() => {
      setClosing(false);
      setMounted(false);
      blockReopenRef.current = false;
      onClose?.();
    }, 350);
    return () => clearTimeout(t);
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

  // ---------- Panel builders ----------
  // এই লাইনটা পুরোপুরি রিপ্লেস করো
  const buildRootForShop = () => {
    // নতুন লজিক: menuItems যদি array হয় → সেটা নাও, না হলে [menuItems] করো
    const categories = Array.isArray(menuItems)
      ? menuItems
      : menuItems && typeof menuItems === "object"
      ? [menuItems]
      : [];

    return {
      title: null,
      items: categories.map((cat) => ({
        type: "group",
        label: cat.name || "Unknown",
        payload: { cat },
      })),
    };
  };

  const buildSimpleList = (title, arr) => ({
    title,
    items: arr.map((label) => ({ type: "group", label, payload: { label } })),
  });

  const ROOTS = useMemo(
    () => ({
      Shop: buildRootForShop(),
      Brands: buildSimpleList("Brands", [
        "Our top brands",
        "Trending brands",
        "All brands",
      ]),
      Services: buildSimpleList("Services", [
        "Customer services",
        "Delivery",
        "Returns",
        "Gift cards",
      ]),
      Help: buildSimpleList("Help", ["Contact us", "Track order", "FAQs"]),
      Money: buildSimpleList("Money", [
        "Credit cards",
        "Finance options",
        "Insurance",
      ]),
    }),
    [menuItems]
  );

  const [activeTab, setActiveTab] = useState("Shop");
  const [stack, setStack] = useState([ROOTS["Shop"]]);

  // panelKey to force remount animation when panels change
  const [panelKey, setPanelKey] = useState(0);
  const bumpPanelKey = () => setPanelKey((k) => k + 1);

  // reset stack when activeTab or ROOTS change
  useEffect(() => {
    setStack([ROOTS[activeTab]]);
    bumpPanelKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, ROOTS]);

  // push / pop operations (NOT memoized to avoid stale closures)
  const pushPanel = (panel) => {
    setStack((prev) => {
      const next = [...prev, panel];
      return next;
    });
    bumpPanelKey();
  };

  const popPanel = () => {
    setStack((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
    bumpPanelKey();
  };

  // helper: find nearest category object present in the stack (fallback)
  const findCatInStack = () => {
    for (let i = stack.length - 1; i >= 0; i--) {
      const p = stack[i];
      if (!p || !Array.isArray(p.items)) continue;
      for (const it of p.items) {
        if (it?.payload?.cat) return it.payload.cat;
      }
    }
    return null;
  };

  // ---------- Main click handler ----------
  const handleItemClick = (item) => {
    if (!item) return;

    // 1) leaf link => navigate (payload must contain child + slugs)
    if (item.type === "link") {
      const child = item.payload?.child;
      const catSlug = item.payload?.catSlug;
      const subSlug = item.payload?.subSlug;

      if (child && catSlug && subSlug) {
        router.push(`/${catSlug}/${subSlug}/${child.slug}`);
        handleClose();
        return;
      }

      // fallback: try to infer from stack
      if (child) {
        const fallbackCat = findCatInStack();
        if (fallbackCat) {
          let fallbackSub = null;
          for (let i = stack.length - 1; i >= 0 && !fallbackSub; i--) {
            const panel = stack[i];
            if (!panel || !Array.isArray(panel.items)) continue;
            for (const it of panel.items) {
              if (it?.payload?.section) {
                const sect = it.payload.section;
                const childs = sect.child_categories || sect.children || [];
                if (
                  childs.some((c) => c.slug === child.slug || c.id === child.id)
                ) {
                  fallbackSub = sect.slug;
                  break;
                }
              }
            }
          }
          if (fallbackSub) {
            router.push(`/${fallbackCat.slug}/${fallbackSub}/${child.slug}`);
            handleClose();
            return;
          }
        }
      }

      handleClose();
      return;
    }

    // 2) SHOP flow: category -> sub -> child
    if (activeTab === "Shop") {
      if (item.payload?.section) {
        const section = item.payload.section;
        const catFromPayload = item.payload?.cat || findCatInStack();
        const children = section.child_categories || section.children || [];

        const leafItems = children.map((child) => ({
          type: "link",
          label: child.name,
          payload: {
            catSlug: catFromPayload?.slug,
            subSlug: section.slug,
            child,
          },
          _key: child.id ?? child.slug ?? child.name,
        }));

        pushPanel({
          title: section.name,
          items: leafItems,
        });
        return;
      }

      // Then check for CATEGORY
      if (item.payload?.cat) {
        const cat = item.payload.cat;
        const subs = cat.sub_categories || cat.subcategories || [];

        const nextItems = subs.map((section) => ({
          type: "group",
          label: section.name,
          payload: { cat, section },
          _key: section.id ?? section.slug ?? section.name,
        }));

        pushPanel({
          title: cat.name,
          items: nextItems,
        });
        return;
      }
    }

    // 3) other tabs
    const label = item.payload?.label || item.label;
    const demo = ["Item A", "Item B", "Item C"].map((x) => ({
      type: "link",
      label: `${label} – ${x}`,
    }));
    pushPanel({ title: item.label, items: demo });
  };

  const currentPanel = stack[stack.length - 1];

  if (!mounted && !closing) return null;

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      {showOverlay && (
        <div
          onClick={() => !closing && handleClose()}
          className={`absolute left-0 right-0 top-[119.44px] bottom-0 bg-black/40 
                      transition-opacity duration-300 ease-out
                      ${animIn && !closing ? "opacity-100" : "opacity-0"}
                      pointer-events-auto`}
        />
      )}

      <div
        className={`absolute right-0 top-[119.44px] h-[calc(100%-119.44px)] bg-white shadow-xl
                    flex flex-col ${drawerWidthClass}
                    transition-transform duration-300 ease-out
                    ${animIn && !closing ? "translate-x-0" : "translate-x-full"}
                    pointer-events-auto`}
        style={{ pointerEvents: closing ? "none" : "auto" }}
      >
        <div className="bg-neutral-100 border-b">
          <div className="flex items-center gap-5 overflow-x-auto px-4">
            {TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => !closing && setActiveTab(tab)}
                  className={`relative py-3 text-[15px] whitespace-nowrap ${
                    active ? "font-semibold" : "text-neutral-600"
                  }`}
                >
                  {tab}
                  {active && (
                    <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-black" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div
          key={panelKey}
          className="flex-1 overflow-hidden animate-[fadeIn_250ms_ease-out] opacity-100"
        >
          <MobileMenuPanel
            title={currentPanel?.title ?? null}
            items={currentPanel?.items ?? []}
            onItemClick={handleItemClick}
            onBack={stack.length > 1 ? popPanel : null}
          />
        </div>
      </div>
    </div>
  );
}
