"use client";

import { usersApi } from "@/core/api/endpoints/UsersApi";
import { authService } from "@/features/auth/service/AuthService";
import { refreshAccessTokenService } from "@/features/auth/service/RefreshAccessTokenService";
import axios from "axios";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

export interface AuthUser {
    userId: number;
    email: string;
    roles: string[];
    permissions: string[];
    preferredLanguageCode: string | null;
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

    // =========================================================
    // RESTAURAR SESIÓN
    // =========================================================

    useEffect(() => {

        if (initialized.current) return;

        initialized.current = true;

        let cancelled = false;

        const restoreSession = async () => {

            console.log("🔵 AUTH: restoreSession INICIO");

            try {

                // =================================================
                // 1. Intentar directamente con accessToken
                // =================================================

                console.log("🔵 AUTH: llamando /auth/me");

                const me = await authService.me();

                console.log("🟢 AUTH: /auth/me respondió OK", me);

                if (cancelled) {
                    console.log(
                        "🟠 AUTH: respuesta ignorada porque cancelled=true"
                    );
                    return;
                }

                setUser({
                    userId: me.userId,
                    email: me.email,
                    roles: me.roles,
                    permissions: me.permissions ?? [],
                    preferredLanguageCode:
                        me.preferredLanguageCode ?? null,
                });

                console.log("🟢 AUTH: sesión restaurada directamente");

                setStatus("authenticated");

            } catch (err: unknown) {

                console.log("🔴 AUTH: /auth/me FALLÓ", err);

                if (cancelled) {
                    console.log(
                        "🟠 AUTH: error ignorado porque cancelled=true"
                    );
                    return;
                }

                // =================================================
                // 2. Analizar error
                // =================================================

                if (!axios.isAxiosError(err)) {

                    setUser(null);
                    setStatus("error");

                    return;
                }

                const responseStatus = err.response?.status;
                const responseCode = err.response?.data?.code;

                console.log(
                    "🔴 AUTH: status =",
                    responseStatus
                );

                console.log(
                    "🔴 AUTH: code =",
                    responseCode
                );

                // =================================================
                // 3. Access token no válido
                //
                // Intentamos recuperar la sesión usando
                // refreshToken.
                // =================================================

                if (responseStatus === 401) {

                    try {

                        console.log(
                            "🔄 AUTH: intentando refresh del accessToken"
                        );

                        await refreshAccessTokenService();

                        console.log(
                            "✅ AUTH: refresh exitoso"
                        );

                        if (cancelled) {
                            console.log(
                                "🟠 AUTH: refresh cancelado"
                            );
                            return;
                        }

                        // =================================================
                        // 4. El backend acaba de crear un nuevo
                        // accessToken en cookie HttpOnly.
                        //
                        // Ahora volvemos a pedir /auth/me.
                        // =================================================

                        console.log(
                            "🔁 AUTH: llamando /auth/me después del refresh"
                        );

                        const me = await authService.me();

                        console.log(
                            "🟢 AUTH: /auth/me después del refresh OK",
                            me
                        );

                        if (cancelled) {
                            console.log(
                                "🟠 AUTH: respuesta ignorada porque cancelled=true"
                            );
                            return;
                        }

                        setUser({
                            userId: me.userId,
                            email: me.email,
                            roles: me.roles,
                            permissions: me.permissions ?? [],
                            preferredLanguageCode:
                                me.preferredLanguageCode ?? null,
                        });

                        console.log(
                            "🟢 AUTH: sesión restaurada mediante refresh"
                        );

                        setStatus("authenticated");

                        return;

                    } catch (refreshError) {

                        console.log(
                            "❌ AUTH: refresh FALLÓ",
                            refreshError
                        );

                        if (cancelled) {
                            return;
                        }

                        // =================================================
                        // No existe una sesión recuperable.
                        // =================================================

                        setUser(null);
                        setStatus("anonymous");

                        return;
                    }
                }

                // =================================================
                // Otros errores
                // =================================================

                setUser(null);

                if (responseStatus === 403) {
                    setStatus("anonymous");
                } else {
                    setStatus("error");
                }
            }

            console.log("🔵 AUTH: restoreSession FIN");
        };

        restoreSession();

        return () => {
            cancelled = true;
        };

    }, []);


    // =========================================================
    // ESTABLECER AUTH MANUALMENTE
    // =========================================================

    const setAuth = (user: AuthUser) => {

        setUser(prev => {

            if (prev?.userId === user.userId) {
                return prev;
            }

            return user;
        });

        setStatus("authenticated");
    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const logout = async () => {

        try {

            await usersApi.logout();

        } catch {

            // Ignorar errores en logout

        } finally {

            window.dispatchEvent(
                new Event("auth:logout")
            );
        }
    };


    // =========================================================
    // EVENTOS DE AUTENTICACIÓN
    // =========================================================

    useEffect(() => {

        const clearAuth = () => {

            console.log(
                "🧹 AUTH: limpiando sesión"
            );

            setUser(null);
            setStatus("anonymous");
        };

        window.addEventListener(
            "auth:logout",
            clearAuth
        );

        window.addEventListener(
            "auth:session-expired",
            clearAuth
        );

        return () => {

            window.removeEventListener(
                "auth:logout",
                clearAuth
            );

            window.removeEventListener(
                "auth:session-expired",
                clearAuth
            );
        };

    }, []);


    return (
        <AuthContext.Provider
            value={{
                user,
                status,
                loading,
                setAuth,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {

    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error(
            "useAuth debe usarse dentro de AuthProvider"
        );
    }

    return ctx;
};