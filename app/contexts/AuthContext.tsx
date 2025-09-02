"use client";

import { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
    isLogin: boolean;
    login: (token: string) => void;
    logout: () => void;
    authLoading: boolean;
    setLogin: (status: boolean) => void;
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLogin, setIsLogin] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const router = useRouter();

    const validateToken = (token: string) => {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    };


    useEffect(() => {
        const storeToken = localStorage.getItem("token");

        if (storeToken && validateToken(storeToken)) {
            setIsLogin(true);
        } else {
            localStorage.removeItem("token");
            setIsLogin(false);
        }

        setAuthLoading(false);
    }, []);

    const setLogin = useCallback((status: boolean) => {
        setIsLogin(status);
    }, []);

    const login = useCallback((token: string) => {
        localStorage.setItem("token", token);
        setIsLogin(true);
        router.push("/");
    }, [router]);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setIsLogin(false);
        router.push("/");
    }, [router]);



    const contextValue = useMemo(
        () => ({ isLogin, login, logout, authLoading, setLogin }),
        [isLogin, authLoading, login, logout, setLogin]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
