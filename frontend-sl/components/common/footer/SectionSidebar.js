"use client";

import Link from "next/link";
import useScrollSpy from "@/core/hooks/useScrollSpy";

export default function LegalSidebar({ sections }) {
  const ids = sections.map((s) => s.id);
  const activeId = useScrollSpy(ids);

  return (
    <aside className="bg-bgSurface border border-border rounded-xl p-6 h-fit sticky top-24">
      <p className="text-xs text-textLight mb-4 uppercase">Legal Sections</p>

      <nav className="space-y-2">
        {sections.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            className={`block px-4 py-2 rounded-lg text-sm transition
              
              ${
                activeId === item.id
                  ? "bg-main text-white"
                  : "text-textSecondary hover:bg-mainSoft hover:text-main"
              }
              
            `}
          >
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="mt-8 bg-secondary text-white p-4 rounded-lg text-sm">
        Transparency and fairness are the foundation of our marketplace.
      </div>
    </aside>
  );
}
