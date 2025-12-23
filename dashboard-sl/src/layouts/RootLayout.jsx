// src/layouts/RootLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const RootLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="w-full min-h-screen bg-bgPage">
      <Sidebar
        role="admin"
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <main className="ml-0 lg:ml-[260px] bg-bgPage dark:bg-bgSurfaceDark pt-24 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
