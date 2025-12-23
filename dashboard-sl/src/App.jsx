import React, { useEffect, useState } from "react";
import Router from "./router/Router";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes";
import { AuthProvider } from "./utils/AuthContext";

const App = () => {
  const [allRoutes, setAllRoutes] = useState([...publicRoutes]);

  useEffect(() => {
    const routes = getRoutes(); // must return an array
    setAllRoutes(prev => [...prev, ...routes]); // correctly append and flatten
  }, []);

  return (
    <AuthProvider>
      <Router allRoutes={allRoutes} />
    </AuthProvider>
  );
};

export default App;
