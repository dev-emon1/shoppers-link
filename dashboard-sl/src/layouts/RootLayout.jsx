// src/layouts/RootLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </main>
    </div>
  );
};

export default RootLayout;
