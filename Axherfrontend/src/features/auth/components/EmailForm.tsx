"use client";

import AuthButtons from "@/features/auth/components/AuthButton";
import AuthCard from "@/features/auth/components/AuthCard";
import OtpInputs from "@/features/auth/components/OtpCodeInput";
import formStyles from "@/shared/styles/shared/Form.module.css";
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

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(otp);
    };

    return (

        <AuthCard title="Confirmar Email" onSubmit={handleSubmit} >
            <h2>Confirmar Email</h2>
            <p>Ingresa el codigo de verificacion que enviamos a su correo</p>

            <OtpInputs
                length={6}
                onChange={setOtp}
                disabled={saving}
                
            />

            <div className={formStyles.formActions}>

                <AuthButtons
                    type="submit"
                    disabled={saving}
                    loadingText="Verificando..."
                >
                    Confirmar
                </AuthButtons>

                {onResendOtp && (
                    <AuthButtons
                        type="button"
                        onClick={onResendOtp}
                        disabled={saving}
                    >
                        Reenviar Código
                    </AuthButtons>
                )}
            </div>
        </AuthCard>
    );
}