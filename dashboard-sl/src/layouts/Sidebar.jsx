import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { getNavigation } from "../navigation";
import { useAuth } from "../utils/AuthContext";

const Sidebar = ({ showSidebar, setShowSidebar }) => {
  const [menu, setMenu] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const location = useLocation();
  const { user } = useAuth();
  const role = user?.type
  // console.log(role);
  useEffect(() => {
    const nav = getNavigation(role);
    setMenu(nav);

    const currentPath = location.pathname;

    const openIdx = nav.findIndex((item) => {
      // Parent path match
      if (currentPath.startsWith(item.path)) return true;

      // Children path match
      return item.children?.some((child) =>
        currentPath.startsWith(child.path)
      );
    });

    setOpenIndex(openIdx !== -1 ? openIdx : null);
  }, [location.pathname, role]);


  const toggleMenu = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div>
      <div
        onClick={() => setShowSidebar(false)}
        className={`flex duration-200 ${!showSidebar ? "invisible" : "visible"
          } w-screen h-screen bg-slate-500 fixed left-0 top-0 z-10`}
      ></div>

      <aside
        className={`w-[260px] fixed bg-bgDark text-textLight z-[99] top-0 h-screen 
        shadow-[0_0_15px_0_rgb(34_41_47_/_5%)] transition-all ${showSidebar ? "left-0" : "-left-[260px] lg:left-0"
          }`}
      >
        {/* Header */}
        <div className="h-[70px] flex items-center justify-center border-b border-slate-700">
          <Link
            to="/"
            className="w-[180px] h-[50px] flex items-center justify-center"
          >
            <span className="text-lg font-semibold capitalize">{role === 'vendor' ? 'partner' : 'admin'} Panel</span>
          </Link>
        </div>

        {/* Menu List */}
        <ul className="scroll-hidden space-y-2 h-[calc(100vh-70px)] px-1">
          {menu.map((item, index) => {
            const isParentActive = item.children?.some((child) =>
              location.pathname.startsWith(child.path)
            );
            return (
              <li key={index} className="relative">
                <div
                  onClick={() => toggleMenu(index)}
                  className={`relative flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition group
                    ${isParentActive
                      ? "text-textWhite dark:text-black font-medium"
                      : "hover:bg-[#1c2232]"
                    }`}
                >
                  {isParentActive && (
                    <span className="absolute left-0 top-0 h-full w-[3px] bg-main rounded-r-md"></span>
                  )}

                  <div className="flex items-center gap-2 pl-[6px]">
                    {item.icon && <item.icon size={18} />}
                    <span>{item.name}</span>
                  </div>

                  {item.children && (
                    <span className="text-xs pr-1">
                      {openIndex === index ? "▲" : "▼"}
                    </span>
                  )}
                </div>
                {/* Submenu */}
                {item.children && openIndex === index && (
                  <ul className="ml-6 mt-1 space-y-1 transition-all">
                    {item.children.map((child, idx) => (
                      <li key={idx} className="relative">
                        <NavLink
                          to={child.path}
                          className={({ isActive }) =>
                            `relative block px-3 py-1 text-sm rounded-md ${isActive
                              ? "bg-[#2f3b54] text-textWhite dark:text-black font-medium before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[2px] before:bg-main"
                              : "hover:bg-[#1c2232]"
                            }`
                          }
                        >
                          {child.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
