import { useAuth } from '@/features/auth/context/AuthContext';
import { oAuthLoginService } from '@/features/auth/service/OAuthLoginService';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useTranslations } from 'next-intl';

export default function GoogleLoginButton() {
    const { setAuth } = useAuth();
    const t = useTranslations("auth");

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        const idToken = credentialResponse.credential;

        if(!idToken) {
            console.error(t("google.tokenMissing"));
            return;
        }

        try {
            const user = await oAuthLoginService("GOOGLE", idToken);
            setAuth({ userId: user.userId, email: user.email, roles: user.roles, permissions: user.permissions, preferredLanguageCode: user.preferredLanguageCode ?? null });
        }catch (error){
            console.error(t("google.error"));
        }

        
    };
    return ( 
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
                console.error(t("google.loginError"));
            }}
        />
    );
}