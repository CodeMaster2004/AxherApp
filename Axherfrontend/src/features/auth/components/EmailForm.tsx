"use client";

import AuthButtons from "@/features/auth/components/AuthButton";
import AuthCard from "@/features/auth/components/AuthCard";
import OtpInputs from "@/features/auth/components/OtpCodeInput";
import formStyles from "@/shared/styles/shared/Form.module.css";
import { useTranslations } from "next-intl";
import { SyntheticEvent, useState } from "react";

interface Props {
    onSubmit: (opt: string) => Promise<unknown> | void;
    onResendOtp?: () => void;
    saving?: boolean;
    loading?: boolean;
    error?: unknown;
}

export default function UserConfirmEmailForm({onSubmit, onResendOtp, saving = false, loading = false, error}: Props){
    const [otp, setOtp] = useState("");
    const t = useTranslations("auth");

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(otp);
    };

    return (

        <AuthCard title={t("confirmEmail.title")} onSubmit={handleSubmit} >
            <h2>{t("confirmEmail.heading")}</h2>
            <p>{t("confirmEmail.description")}</p>

            <OtpInputs
                length={6}
                onChange={setOtp}
                disabled={saving}
                
            />

            <div className={formStyles.formActions}>

                <AuthButtons
                    type="submit"
                    disabled={saving}
                    loadingText={t("confirmEmail.loading")}
                >
                    {t("confirmEmail.submit")}
                </AuthButtons>

                {onResendOtp && (
                    <AuthButtons
                        type="button"
                        onClick={onResendOtp}
                        disabled={saving}
                    >
                        {t("confirmEmail.resend")}
                    </AuthButtons>
                )}
            </div>
        </AuthCard>
    );
}