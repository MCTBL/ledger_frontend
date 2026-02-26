import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { STATIC_FIELDS } from "../assets/StaticData";
import type { User } from "../types/defines";

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem(STATIC_FIELDS.auth_token),
    );

    const login = (userData: User, token: string) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem(STATIC_FIELDS.auth_token, token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STATIC_FIELDS.auth_token);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
