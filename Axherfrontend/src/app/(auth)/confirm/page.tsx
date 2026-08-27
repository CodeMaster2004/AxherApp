"use client";

import UserConfirmEmailForm from "@/features/auth/components/EmailForm";
import { useAuth } from "@/features/auth/context/AuthContext";
import styles from "@/features/auth/components/AuthCard.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";

export default function ConfirmPage() {
    const { confirmEmail, resendOtp, loading, error } = useAuthActions();
    const { setAuth } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");
    const t = useTranslations("auth");

    if(email == null){
        return <div>{t("confirmEmail.userNotFound")}</div>;
    }

    const handleConfirm = async (otp: string) => {
        try {
            const me = await confirmEmail(email, otp);
            setAuth({ userId: me.userId, email: me.email, roles: me.roles, permissions: me.permissions ?? [], preferredLanguageCode: me.preferredLanguageCode ?? null });
            router.push("/");
            /*const resp = await confirmEmail(email, otp);
            if(resp?.token){
                setAccessToken(resp.token);
                setAuth(resp.userId, resp.token, resp.roles);
                router.push("/")
            }*/
        }catch (err) {
            console.error("Error confirmado email ", err)
        }
    }

    const handleResendOtp = async () => {
        try {
            await resendOtp(email);
            alert(t("confirmEmail.resendSuccess"));
        }catch (err) {
            console.error(t("errors.resendCode"), err)
        }
    }
    return (

        <div className={styles.authContainer}>
            <UserConfirmEmailForm
                onSubmit={handleConfirm}
                onResendOtp={handleResendOtp}
                loading={loading}
                error={error}
            />
        </div>
        
    );
}