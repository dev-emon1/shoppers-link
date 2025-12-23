'use client';
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token") || null);
    // console.log(user);

    // Load user from localStorage when token exists
    useEffect(() => {
        if (token) {
            try {
                const storedUser = localStorage.getItem("partner"); // match your login storage key
                if (storedUser) setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                logout();
            }
        }
    }, [token]);

    const login = (tokenValue, userData) => {
        setUser(userData);
        setToken(tokenValue);
        localStorage.setItem("token", tokenValue);
        localStorage.setItem("partner", JSON.stringify(userData)); // match key with login
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("partner");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
