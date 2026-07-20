import { useAuth } from '@/features/auth/context/AuthContext';
import { oAuthLoginService } from '@/features/auth/service/OAuthLoginService';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton() {
    const { setAuth } = useAuth();

    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        const idToken = credentialResponse.credential;

        if(!idToken) {
            console.error('No se recibió el ID token de Google');
            return;
        }

        try {
            const user = await oAuthLoginService("GOOGLE", idToken);
            setAuth({ userId: user.userId, email: user.email, roles: user.roles, permissions: user.permissions });
        }catch (error){
            console.error('Error al iniciar sesión con Google', error);
        }

        
    };
    return ( 
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
                console.error('Error en Google Login')
            }}
        />
    );
}