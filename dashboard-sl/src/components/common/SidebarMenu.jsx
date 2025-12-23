import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { icons } from "lucide-react"; // যদি lucide-react icons ব্যবহার করো

const SidebarMenu = ({ items }) => {
  const router = useRouter();

  return (
    <aside className="bg-white border-r border-border w-64 min-h-screen p-3">
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = icons[item.icon] || null;
          const isActive = router.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "bg-main text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {Icon && <Icon size={18} />}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default SidebarMenu;
