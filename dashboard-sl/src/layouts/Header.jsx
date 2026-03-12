import React, { useEffect, useRef, useState } from "react";
import { FaBell, FaList } from "react-icons/fa";
import SearchInput from "../components/common/SearchInput";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import API, { IMAGE_URL } from "../utils/api";

const Header = ({ showSidebar, setShowSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [data, setData] = useState(null);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const notifications = user?.notifications || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Load profile
  useEffect(() => {
    API.get("/profile", { withCredentials: true })
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logo = user?.vendor?.logo
    ? `${IMAGE_URL}${user.vendor.logo}`
    : "/images/user.jpg";

  return (
    <div className="fixed top-0 left-0 w-full z-[80] bg-bgSurface dark:bg-bgDark shadow-sm h-[70px]">
      <div className="ml-0 lg:ml-[260px] h-[70px] flex justify-between items-center px-5">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle */}
          <div
            onClick={() => setShowSidebar(!showSidebar)}
            className="w-9 h-9 flex lg:hidden rounded-full items-center justify-center cursor-pointer hover:bg-[#f7941d]/90 transition"
          >
            <FaList />
          </div>

          {/* Search */}
          <div className="hidden md:block">
            <SearchInput placeholderText="Search..." />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 relative">
          {/* 🔔 NOTIFICATIONS */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative text-gray-600 hover:text-gray-800 transition"
            >
              <FaBell className="w-5 h-5" />

              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-[2px] flex items-center justify-center rounded-full bg-red text-white text-[9px] w-4 h-4">
                  {notifications.length}
                </span>
              )}
            </button>

            <div
              className={`absolute top-12 right-0 w-[260px] h-[220px] bg-white text-black text-xs p-4 shadow-lg rounded-md overflow-y-auto z-[999]
              transition-all duration-200 ease-out transform
              ${
                notificationOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <div className="flex justify-between items-center mb-2 pb-1 text-xs font-medium text-gray-600 border-b">
                <span>Notifications</span>
                <span className="cursor-pointer text-orange-600">
                  Clear all
                </span>
              </div>

              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center mt-8">
                  No notifications
                </p>
              ) : (
                notifications.map((note, idx) => (
                  <div key={idx} className="border-b py-1 text-gray-700">
                    {note.message}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 👤 PROFILE */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2"
            >
              <img
                src={logo}
                alt="profile"
                className="w-10 h-10 rounded-full border object-contain"
              />

              <div className="hidden md:block text-left">
                <p className="text-sm font-medium capitalize">
                  {user?.user_name || "Admin"}
                </p>

                <p className="text-xs text-gray-500 capitalize">
                  {user?.type === "vendor" ? "partner" : "admin"}
                </p>
              </div>
            </button>

            <div
              className={`absolute top-12 right-0 w-[160px] bg-white shadow-lg rounded-md p-2 z-[999]
              transition-all duration-200 ease-out transform
              ${
                profileOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <button
                onClick={() =>
                  navigate(
                    user?.type === "admin"
                      ? "/admin/profile"
                      : "/vendor/profile",
                  )
                }
                className="block w-full text-left px-2 py-2 hover:bg-gray-100 rounded text-sm"
              >
                Profile
              </button>

              <button className="block w-full text-left px-2 py-2 hover:bg-gray-100 rounded text-sm">
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-2 py-2 hover:bg-gray-100 rounded text-sm text-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
