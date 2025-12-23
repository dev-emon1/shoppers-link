import React, { useEffect, useRef, useState } from "react";
import { FaBell, FaList } from "react-icons/fa";
import SearchInput from "../components/common/SearchInput";
import { useOutsideClick } from "../helpers/outSideClick";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import API, { IMAGE_URL } from "../utils/api";

const Header = ({ showSidebar, setShowSidebar }) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const notificationRef = useRef(null);
  const notifications = user?.notifications || []; // Example dynamic notifications
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();          // clear context and localStorage
    navigate("/login"); // redirect to login page
  };
  const [data, setData] = useState(null);
  const logo = data?.vendor?.logo || 'images/user.jpg';
  useEffect(() => {
    // await API.post('/vendor/register', payload);
    API.get('/profile', { withCredentials: true })   // sanctum cookie
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, []);
  // console.log(data.vendor.logo);
  // Close dropdown on outside click
  useOutsideClick(notificationRef, () => setOpen(false));

  return (
    <div className="fixed top-0 left-0 w-full z-[80] bg-bgSurface dark:bg-bgDark shadow-sm h-[70px]">
      <div className="ml-0 lg:ml-[260px] rounded-md h-[70px] flex justify-between items-center px-5 shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] transition-all">
        {/* Left: Sidebar Toggle & Search */}
        <div className="flex items-center justify-between gap-4">
          <div
            onClick={() => setShowSidebar(!showSidebar)}
            className="w-9 h-9 flex lg:hidden rounded-full items-center justify-center bg-transparent dark:text-white text-black cursor-pointer hover:bg-[#f7941d]/90 transition-all duration-300"
          >
            <FaList />
          </div>
          <div className="hidden md:block flex-1">
            <SearchInput placeholderText="Search..." />
          </div>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-4 relative">
          {/* Notifications */}
          <div className="mr-1 text-gray-600 hover:text-gray-800 transition-colors duration-150">
            <span
              className="cursor-pointer relative"
              onClick={() => setOpen(!open)}
            >
              <FaBell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-[2px] flex justify-center items-center rounded-full bg-red text-white text-[9px] p-[3px] w-4 h-4">
                  {notifications.length}
                </span>
              )}
            </span>
            {open && (
              <div
                ref={notificationRef}
                className="absolute top-12 right-0 w-[250px] h-[200px] bg-white text-black text-xs p-4 shadow-sm overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-2 pb-1 text-xs font-medium text-gray-600 shadow-sm">
                  <span>Notifications</span>
                  <span className="cursor-pointer text-orange-600 hover:text-orange-500">Clear all</span>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-center mt-8">No notifications</p>
                ) : (
                  notifications.map((note, idx) => (
                    <div key={idx} className="border-b py-1 text-gray-700">
                      {note.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
            <img
              src={
                user?.vendor?.logo
                  ? `${IMAGE_URL}${user.vendor.logo}`
                  : '/images/user.jpg'
              }
              alt="profile"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex justify-center items-center gap-1 group cursor-pointer text-slate-800 text-sm relative">
            <div className="hidden md:block">
              <p className="text-sm font-medium capitalize">{user?.user_name || 'Admin'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.type === 'vendor' ? 'partner' : 'admin'}</p>
            </div>

            <ul className="absolute top-[35px] right-0 rounded-md text-black p-3 w-36 flex flex-col gap-2 bg-white shadow-md opacity-0 invisible pointer-events-none transform translate-y-3 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 z-50">
              <li onClick={() => navigate(user?.type === "admin" ? "/admin/profile" : "/vendor/profile")} className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded">
                Profile
              </li>
              <li className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded">
                Settings
              </li>
              <li
                onClick={handleLogout}
                className="text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
