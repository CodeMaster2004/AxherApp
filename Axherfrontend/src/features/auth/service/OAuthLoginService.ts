import { oAuthLoginApi } from "@/core/api/endpoints/OAuthLoginApi";
import { UserAuthResponse } from "@/entities/types";
import { getBrowserLanguageCode } from "@/shared/i18n/browserLanguage";

export async function oAuthLoginService(provider: string, idToken: string): Promise<UserAuthResponse> {

    const preferredLanguageCode = getBrowserLanguageCode();

    return oAuthLoginApi(provider, idToken, preferredLanguageCode);
 
}