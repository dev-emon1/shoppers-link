"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

/**
 * TreeSidebar – Premium Retail Navigation
 *
 * Props:
 * - category
 * - tree
 * - active: { sub, child }
 *
 * tree shape:
 * [
 *   {
 *     slug,
 *     name,
 *     children: [{ slug, name, product_count }]
 *   }
 * ]
 */
export default function TreeSidebar({ category, tree = [], active = {} }) {
  const subcategories = useMemo(() => {
    if (Array.isArray(tree)) return tree;
    return tree?.subcategories || [];
  }, [tree]);

  /* -------------------------------
     Collapse state (auto expand)
  -------------------------------- */
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    if (active?.sub) {
      setCollapsed((prev) => ({ ...prev, [active.sub]: false }));
    }
  }, [active?.sub]);

  const toggle = (key) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  return (
    <aside className="bg-white rounded-lg border border-border p-5 sticky top-[100px]">
      {/* Sidebar title */}
      <h3 className="text-xs font-semibold text-textPrimary mb-4 uppercase tracking-wider">
        {category?.name}
      </h3>

      <ul className="space-y-3">
        {subcategories.map((sub) => {
          const key = sub.slug;
          const children = sub.children || [];
          const isActiveSub = active.sub === sub.slug;
          const isCollapsed = collapsed[key] ?? !isActiveSub;

          return (
            <li key={key}>
              {/* Subcategory row */}
              <div
                className={`flex items-center justify-between rounded-md px-2 py-1 transition
                  ${isActiveSub ? "bg-bgPage" : "hover:bg-bgPage"}
                `}
              >
                <Link
                  href={`/${category.slug}/${sub.slug}`}
                  prefetch
                  className={`text-sm font-medium flex-1
                    ${isActiveSub ? "text-main" : "text-textPrimary"}
                  `}
                >
                  {sub.name}
                </Link>

                {children.length > 0 && (
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="ml-2 p-1 text-textLight hover:text-textPrimary"
                    aria-label="Toggle"
                  >
                    {isCollapsed ? (
                      <ChevronRight size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                )}
              </div>

              {/* Animated children container */}
              {children.length > 0 && (
                <div
                  className={`
                    grid transition-[grid-template-rows,opacity] duration-300 ease-in-out
                    ${
                      isCollapsed
                        ? "grid-rows-[0fr] opacity-0"
                        : "grid-rows-[1fr] opacity-100"
                    }
                  `}
                >
                  <div className="overflow-hidden">
                    <ul className="mt-2 ml-4 space-y-1">
                      {children.map((child) => {
                        const isActiveChild = active.child === child.slug;

                        return (
                          <li key={child.slug}>
                            <Link
                              href={`/${category.slug}/${sub.slug}/${child.slug}`}
                              className={`flex items-center justify-between rounded-md px-2 py-1 text-sm transition
                                ${
                                  isActiveChild
                                    ? "bg-main/10 text-main font-semibold"
                                    : "text-textLight hover:bg-bgPage hover:text-textPrimary"
                                }
                              `}
                            >
                              <span>{child.name}</span>

                              {/* Product count */}
                              {typeof child.product_count === "number" && (
                                <span className="text-xs text-textLight">
                                  ({child.product_count})
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}

                      {/* View all link */}
                      <li className="pt-1">
                        <Link
                          href={`/${category.slug}/${sub.slug}`}
                          prefetch
                          className="text-xs font-medium text-main hover:underline px-2 block"
                        >
                          View all
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
