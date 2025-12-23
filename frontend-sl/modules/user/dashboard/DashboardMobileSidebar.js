"use client";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  MapPin,
  LogOut,
  Headphones,
  Heart,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/modules/user/store/authReducer";
import { useDispatch } from "react-redux";

export default function DashboardMobileSidebar({ open, onClose }) {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const menu = [
    {
      label: "Dashboard",
      href: "/user/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "My Orders",
      href: "/user/dashboard/orders",
      icon: <ShoppingBag size={18} />,
    },
    {
      label: "My Wishlist",
      href: "/user/dashboard/wishlist",
      icon: <Heart size={18} />,
    },
    {
      label: "Profile",
      href: "/user/dashboard/profile",
      icon: <User size={18} />,
    },
    {
      label: "Address Book",
      href: "/user/dashboard/address",
      icon: <MapPin size={18} />,
    },
    {
      label: "Support",
      href: "/user/dashboard/support",
      icon: <Headphones size={18} />,
    },
  ];

  return (
    <div
      className={`fixed inset-0 bg-black/40 z-[999] transition-opacity ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`absolute left-0 top-0 h-full w-72 bg-white shadow-xl p-5 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Account</h2>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <ul className="space-y-1">
          {menu.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm 
                hover:bg-gray-100 transition
                ${
                  pathname === item.href
                    ? "bg-main/10 text-main font-medium"
                    : "text-textPrimary"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}

          <li className="pt-4 mt-4 border-t">
            <button
              onClick={() => {
                dispatch(logout());
                onClose();
              }}
              className="flex items-center w-full text-left gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} /> Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
