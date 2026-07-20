import { UserAuthResponse } from "@/entities/types";
import axiosClient from "../axiosClient";

export async function oAuthLoginApi(provider: string, idToken: string): Promise<UserAuthResponse> {
    const response = await axiosClient.post<UserAuthResponse>(
        '/auth/oauth',
        {
            provider,
            idToken
        }
    );
    return response.data;
} 