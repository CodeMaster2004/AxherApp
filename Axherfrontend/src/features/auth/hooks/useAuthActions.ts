import { UserAuthResponse, UserLoginRequest, UserRegisterRequest } from "@/entities/types";
import { useAuth } from "@/features/auth/context/AuthContext";
import { authService } from "@/features/auth/service/AuthService";
import axios from "axios";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (response: UserAuthResponse) => void;
    onError?: (error: unknown) => void;
}

export const useAuthActions = (options?: Options) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setAuth } = useAuth();
    
    const getErrorMessage = (err: unknown): string => {

        if (axios.isAxiosError(err)) {
            return err.response?.data?.message ?? "Error del servidor";
        }

        if (err instanceof Error) {
            return err.message;
        }

        return "Ocurrió un error inesperado";
    };

    const register = useCallback(
        async (registerRequest: UserRegisterRequest) => {
            setLoading(true);
            setError(null);
            try {
                const response = await authService.register(registerRequest)
                options?.onSuccess?.(response)
                return response;
            }catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                options?.onError?.(err);

                return null;
            }finally {
                setLoading(false);
            }
        },
        [options]
    );

    const confirmEmail = useCallback(
        async (email: string, otp: string) => {
            setLoading(true);
            setError(null);
            try {
                const response = await authService.confirmEmail(email, otp);
                options?.onSuccess?.(response)
                return response;
            }catch (err) {
                const message = getErrorMessage(err);
                setError(message);
                options?.onError?.(err);
                throw err;
            }finally{
                setLoading(false);
            }
        },
        [options]
    );

    const login = useCallback(
        async (loginRequest: UserLoginRequest) => {
            setLoading(true);
            setError(null);
            try{
                await authService.login(loginRequest);

                const me = await authService.me();
                setAuth({ userId: me.userId, email: me.email, roles: me.roles, permissions: me.permissions ?? [], preferredLanguageCode: me.preferredLanguageCode ?? null });
                return me;
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const status = err.response?.status;
                    const backendMessage = err.response?.data?.message;

                    if (status === 401) {
                        setError("Credenciales inválidas");
                    } else {
                        setError(backendMessage ?? "Error al iniciar sesión");
                    }
                } else {
                    setError("Error inesperado");
                }
                options?.onError?.(err);
                throw err;
            }finally {
                setLoading(false);
            }
        },
        [options, setAuth]
    );

    const generate2FAOtp = useCallback(
        async (userId: number) => {
            setLoading(true);
            setError(null);
            try{
                const otp = await authService.generate2FAOtp(userId);
                return otp;
            }catch (err){
                const message = getErrorMessage(err);
                setError(message);
                options?.onError?.(err);
                throw err;
            }finally{
                setLoading(false);
            }
        },
        [options]
    );

    const resendOtp = useCallback(
        async (email: string) => {
            setLoading(true);
            setError(null);
            try{
                await authService.resendOtpEmail(email);
            }catch (err){
                const message = getErrorMessage(err);
                setError(message);
                throw err;
            }finally{
                setLoading(false);
            }
        },
        []
    );

    return {
        register,
        confirmEmail,
        login,
        generate2FAOtp,
        resendOtp,
        loading,
        error,
    };
};