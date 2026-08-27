"use client";

import AuthButtons from "@/features/auth/components/AuthButton";
import AuthCard from "@/features/auth/components/AuthCard";
import AuthInput from "@/features/auth/components/AuthInput";
import { useCheckEmail } from "@/features/users/hooks/useCheckEmail";
import formStyles from "@/shared/styles/shared/Form.module.css";
import { validatePassword } from "@/shared/utils/ValidatePassword";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { SyntheticEvent, useEffect, useState } from "react";

interface Props {
    onSubmit: (email: string, password: string, confirmPassword: string, ) => void;
    saving?: boolean;
    loading?: boolean;
    error?: string | null;
}

export default function UserRegisterForm({ onSubmit, saving = false, loading = false, error }: Props){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null);
    const { exists: emailExists, loading: checkingEmail } = useCheckEmail(email);
    const t = useTranslations("auth");

    useEffect(() => {
        if (confirmPassword.length > 0 && password !== confirmPassword) {
            setConfirmError("Las contraseñas no coinciden");
        } else {
            setConfirmError(null);
        }
    }, [password, confirmPassword]);

    useEffect(() => {
        if (password.length > 0) {
            setPasswordError(validatePassword(password));
        } else {
            setPasswordError(null);
        }
    }, [password]);

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const pwdError = validatePassword(password);
        setPasswordError(pwdError);

        if (pwdError || password !== confirmPassword || emailExists === true) return;
        onSubmit(email, password, confirmPassword);
    };

    return (

        <AuthCard title={t("register.title")} onSubmit={handleSubmit} >
            <h2>{t("form.heading")}</h2>

            {error && (
                <p className={formStyles.errorMessage}>
                {error}
                </p>
            )}

            <AuthInput
                type="email"
                value={email}
                onChange={setEmail}
                placeholder={t("register.emailPlaceholder")}
                disabled={saving}
                autoFocus
            />
            {emailExists === true && !checkingEmail &&(
                <p className={formStyles.errorMessage}>
                    {t("register.emailExists")}
                </p>
            )}
        

            <AuthInput
                type="password"
                value={password}
                onChange={setPassword}
                placeholder={t("register.passwordPlaceholder")}
                required
                disabled={saving}
            />
            {passwordError && <div className={formStyles.errorMessage}>{passwordError}</div>}

            <AuthInput
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder={t("register.confirmPasswordPlaceholder")}
                required
                disabled={saving}
            />
            {confirmError && <div className={formStyles.errorMessage}>{confirmError}</div>}

            <div className={formStyles.formActions}>
                <AuthButtons
                    type="submit"
                    disabled={saving || checkingEmail || emailExists === true || !!passwordError || !!confirmError}
                    loadingText={t("register.loading")}
                >
                    {t("register.submit")}
                </AuthButtons>

            </div>
            <p className={formStyles.switchFormText}>
                {t("register.alreadyHaveAccount")} <Link href="/login">{t("register.login")}</Link>
            </p>

        </AuthCard>
    );
}