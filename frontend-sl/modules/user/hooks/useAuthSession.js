"use client";
import { useState, useEffect } from "react";

export const useAuthSession = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const saveUser = (data) => {
    setUser(data);
    sessionStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return { user, setUser: saveUser, logout };
};
