import { oAuthLoginApi } from "@/core/api/endpoints/OAuthLoginApi";
import { UserAuthResponse } from "@/entities/types";

export async function oAuthLoginService(provider: string, idToken: string): Promise<UserAuthResponse> {
    const user = await oAuthLoginApi(provider, idToken);

    return user;
}