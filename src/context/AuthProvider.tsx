import { useEffect, useState, type ReactNode } from "react";
import { STATIC_FIELDS } from "../assets/StaticData";
import type { User } from "../types/defines";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    // 从 localStorage 初始化（若没有，保持 null）
    const [user, setUser] = useState<User | null>(() => {
        try {
            const raw = localStorage.getItem(STATIC_FIELDS.auth_user);
            return raw ? (JSON.parse(raw) as User) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem(STATIC_FIELDS.auth_token),
    );

    const login = (userData: User, token: string) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem(STATIC_FIELDS.auth_token, token);
        localStorage.setItem(STATIC_FIELDS.auth_user, JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STATIC_FIELDS.auth_token);
        localStorage.removeItem(STATIC_FIELDS.auth_user);
    };

    // 可选：当 localStorage 在同一域的另一个窗口变化时同步（storage event）
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === STATIC_FIELDS.auth_token) {
                setToken(e.newValue);
            }
            if (e.key === STATIC_FIELDS.auth_user) {
                try {
                    setUser(e.newValue ? JSON.parse(e.newValue) : null);
                } catch {
                    setUser(null);
                }
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
