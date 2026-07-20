import { Page, PaginationParams, UserAuthResponse, UserList, UserLoginRequest, UserRegisterRequest } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

export const usersApi = {

    register: (registerRequest: UserRegisterRequest, config?: AxiosRequestConfig) =>
        axiosClient.post<UserAuthResponse>("/auth/register", registerRequest, config),

    confirmEmail: (email: string, otp: string, config?: AxiosRequestConfig) =>
        axiosClient.post<UserAuthResponse>("/auth/confirm-email", null, {
            params: { email, otp },
            ...config
        }),

    login: (loginRequest: UserLoginRequest, config?: AxiosRequestConfig) =>
        axiosClient.post<UserAuthResponse>("/auth/login", loginRequest, config),

    generate2FAOtp: (userId: number, config?: AxiosRequestConfig) =>
        axiosClient.post<void>("/auth/2fa/generate", null, {
            params: { userId },
            ...config
        }),

    getAll: (params: PaginationParams, search?: string, config?: AxiosRequestConfig) =>
        axiosClient.get<Page<UserList>>("/users", {
            params: { ...params, search },
            ...config
        }),
    
    // usersApi.ts
    logout: (config?: AxiosRequestConfig) =>
        axiosClient.post("/auth/logout", {}, config),

    
    resendEmailOtp: (email: string, config?: AxiosRequestConfig) =>
    axiosClient.post("/auth/email/resend", null, {
        params: { email },
        ...config
    }),

    me: (config?: AxiosRequestConfig) =>
        axiosClient.get<UserAuthResponse>("/auth/me", config),

    checkEmail: (email: string) =>
        axiosClient.get("/auth/check-email", { params: { email } }),

    
}