import { usersApi } from "@/core/api/endpoints/UsersApi";
import {  UserAuthResponse, UserLoginRequest, UserRegisterRequest } from "@/entities/types";
import { getBrowserLanguageCode } from "@/shared/i18n/browserLanguage";
import { AxiosResponse } from "axios";

export const authService = {

    register: async (
        registerRequest: UserRegisterRequest,
        signal?: AbortSignal
    ): Promise<UserAuthResponse> => {

        const request: UserRegisterRequest = {
            ...registerRequest,
            preferredLanguageCode:
                getBrowserLanguageCode()
        };

        const res = await usersApi.register(
            request,
            { signal }
        );

        return res.data;
    },

    confirmEmail: async(email: string, otp: string, signal?: AbortSignal): Promise<UserAuthResponse> =>
        usersApi.confirmEmail(email, otp, { signal })
            .then((res: AxiosResponse<UserAuthResponse>) => res.data),

    login: (loginRequest: UserLoginRequest, signal?: AbortSignal): Promise<UserAuthResponse> =>
        usersApi.login(loginRequest, { signal })
            .then((res: AxiosResponse<UserAuthResponse>) => res.data),

    generate2FAOtp: (userId: number, signal?: AbortSignal): Promise<void> =>
    usersApi.generate2FAOtp(userId, { signal })
        .then(() => {}),


    resendOtpEmail: async (email: string): Promise<void> => {
        await usersApi.resendEmailOtp(email);
    },

    me: (signal?: AbortSignal) =>
        usersApi.me({ signal }).then((res: AxiosResponse<UserAuthResponse>) => res.data),

}