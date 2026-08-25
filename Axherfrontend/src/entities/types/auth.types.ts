export interface UserLoginRequest{
    login: string;
    password: string;
}

export interface UserRegisterRequest{
    email: string;
    password: string;
    confirmPassword: string;
    preferredLanguageCode?: string | null;
}
 
export interface UserAuthResponse{
    userId: number;
    email: string;
    roles: string[];
    permissions: string[];
    token: string;
    refreshToken: string;
    provider: string;
    preferredLanguageCode?: string | null;
}