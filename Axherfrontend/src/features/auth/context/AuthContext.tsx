"use client";

import { usersApi } from "@/core/api/endpoints/UsersApi";
import { authService } from "@/features/auth/service/AuthService";
import axios from "axios";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";

export interface AuthUser {
    userId: number;
    email: string;
    roles: string[];
    permissions: string[];
}

type AuthStatus = "checking" | "authenticated" | "anonymous" | "error";

interface AuthContextProps {
    user: AuthUser | null;
    loading: boolean;
    status: AuthStatus;
    setAuth: (user: AuthUser) => void;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [status, setStatus] = useState<AuthStatus>("checking");
    const loading = status === "checking";
    const isAuthenticated = status === "authenticated";
    const initialized = useRef(false);

    // Restaurar sesión al cargar la app
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        let cancelled = false;

        const restoreSession = async () => {
            
            try {
                
                const me = await authService.me();
                if (cancelled) return;

                setUser({
                    userId: me.userId,
                    email: me.email,
                    roles: me.roles,
                    permissions: me.permissions ?? [],
                });
                setStatus("authenticated");
            } catch (err: unknown) {

                if (cancelled) return;
                
                if (axios.isAxiosError(err)) {
                    const code = err.response?.status;
                    setUser(null);
                    setStatus(code === 401 || code === 403 ? "anonymous" : "error");
                } else {
                    setUser(null);
                    setStatus("error");
                }
            }
        };

        restoreSession();
            return () => {
                cancelled = true;
            };
    }, []);

    // Establecer auth manualmente
    const setAuth = (user: AuthUser) => {
        setUser(prev => {
            if (prev?.userId === user.userId) return prev;
            return user;
        });
        setStatus("authenticated");
    };

    // Logout
    const logout = async () => {
        try {
        await usersApi.logout();
        } catch {
        // Ignorar errores en logout
        } finally {
            window.dispatchEvent(new Event("auth:logout"));
        }
    };

    useEffect(() => {
        const clearAuth = () => {
            setUser(null);
            setStatus("anonymous");
        };

        window.addEventListener("auth:logout", clearAuth);
        window.addEventListener("auth:session-expired", clearAuth);

        return () => {
            window.removeEventListener("auth:logout", clearAuth);
            window.removeEventListener("auth:session-expired", clearAuth);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, status, loading, setAuth, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return ctx;
};