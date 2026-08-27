"use client";

import styles from "@/features/auth/components/AuthCard.module.css";
import UserLoginForm from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { authService } from "@/features/auth/service/AuthService";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAuth } = useAuth();
    const {login, loading, error } = useAuthActions();
    const sessionClearedRef = useRef(false);

    useEffect(() => {
        const reason = searchParams.get("reason");
        if (reason !== "session-expired" || sessionClearedRef.current) return;

        sessionClearedRef.current = true;
        window.dispatchEvent(new Event("auth:session-expired"));
        router.replace("/login");
    }, [router, searchParams]);

    const handleLogin = async (loginStr: string, pwd: string) => {
         console.log("Intentando login con:", loginStr); // 🔹 log inicial
        try {
           // 1️ Llamas login solo para que el backend cree la cookie HttpOnly
            await login({ login: loginStr, password: pwd });
            console.log("login() terminó, llamando a /me");
            // 2️ Llamas /auth/me para obtener los datos del usuario
            const me = await authService.me();
            console.log("Datos de /me:", me);
            // 3️ Guardas la sesión en tu contexto
            setAuth({ userId: me.userId, email: me.email, roles: me.roles, permissions: me.permissions ?? [], preferredLanguageCode: me.preferredLanguageCode ?? null });

            // 4️ Rediriges al usuario
            router.push("/");
           
        }catch (err) {
            
            if (axios.isAxiosError(err)) {
            const msg = err.response?.data?.message;
            if (msg?.includes("confirmar tu email")) {
                // Redirige a la página de OTP
                const email = err.response?.data?.email; // Asegúrate de que backend lo devuelva
                console.log("Redirigiendo a confirm page, userId=", email);
                router.push(`/confirm?email=${encodeURIComponent(email)}`);
                return;
                
            }
            console.error("Login failed response:", err.response?.data);
        }
        console.error("Login failed: ", err);
        }
    };


    return (
        <div className={styles.authContainer}>
            <UserLoginForm
                onSubmit={handleLogin}
                saving={loading}
                error={error ?? null}
            />
        </div>
    )
   
}