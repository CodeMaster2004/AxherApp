"use client";

import AuthButtons from "@/features/auth/components/AuthButton";
import AuthCard from "@/features/auth/components/AuthCard";
import AuthInput from "@/features/auth/components/AuthInput";
import formStyles from "@/shared/styles/shared/Form.module.css";
import Link from "next/link";
import { SyntheticEvent, useState } from "react";
import GoogleLoginButton from "./GoogleLoginButton";
import { useTranslations } from "next-intl";

interface Props {
    onSubmit: (login: string, password: string) => void;
    saving?: boolean;
    loading?: boolean;
    error?: string | null;
}

export default function UserLoginForm({ onSubmit, saving = false, loading = false, error }: Props) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const t = useTranslations("auth");

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(login, password);
    }

    return(

        <AuthCard title={t("login.title")} onSubmit={handleSubmit} >
            
            <h2>{t("login.heading")}</h2>
            {error && (
                <p className={formStyles.errorMessage}>
                {error}
                </p>
            )}
            
            <AuthInput
                value={login}
                onChange={setLogin}
                placeholder={t("login.emailPlaceholder")}
                required
                disabled={saving}
                autoFocus
            />

            <AuthInput
                type="password"
                value={password}
                onChange={setPassword}
                placeholder={t("login.passwordPlaceholder")}
                required
                disabled={saving}
            />

            <div className={formStyles.formActions}>

                <AuthButtons
                    type="submit"
                    disabled={saving}
                    loadingText={t("login.loading")}
                >
                    Iniciar Sesión

                </AuthButtons>
                
                <Link href="/register">
                    <AuthButtons type="button">
                        {t("login.register")}
                    </AuthButtons>
                </Link>

            </div>

            {/* Separador opcional */}
            <div style={{ textAlign: "center", margin: "1em 0", color: "#888" }}>
                {t("login.continueWith")}
            </div>
            <GoogleLoginButton />      

        </AuthCard>
    );
}