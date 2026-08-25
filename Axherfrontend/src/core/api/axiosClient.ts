import { refreshAccessTokenService } from "@/features/auth/service/RefreshAccessTokenService";
import { languageResolver } from "@/shared/i18n/languageResolver";
import axios, { AxiosRequestConfig } from "axios";

//export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.147.54.128:8080/api";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const axiosClient = axios.create({
  
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, 
});

axiosClient.interceptors.request.use(
    (config) => {

        const language = languageResolver.get();

        if (language) {
            config.headers.set("Accept-Language", language);
        }
        return config;
    }
);
// -----------------------------
// Cola para requests mientras refresh
// -----------------------------
let isRefreshing = false;
const failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (error: unknown) => void;
    config: AxiosRequestConfig;
}[] = [];

const processQueue = (error: unknown) => {
    failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve(axiosClient(p.config));
    });
    failedQueue.length = 0;
};

// -----------------------------
// Interceptor de respuestas
// -----------------------------
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!error.config) return Promise.reject(error);

        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        const status = error.response?.status;
        const errorCode = error.response?.data?.code;
        const isRefreshRequest =
            originalRequest.url?.includes("/auth/refresh");

        /*
         * Solo intentamos refresh cuando:
         *
         * 1. Backend responde 401
         * 2. El backend indica que el access token expiró
         * 3. No estamos reintentando la misma request
         * 4. La request no es /auth/refresh
         */
        const shouldRefresh =
            status === 401 &&
            errorCode === "ACCESS_TOKEN_EXPIRED" &&
            !originalRequest._retry &&
            !isRefreshRequest;

        if(!shouldRefresh){
            return Promise.reject(error);
        }
         console.log("🛑 ACCESS TOKEN EXPIRADO");
        console.log("➡️ Request original:", originalRequest.url);

        originalRequest._retry = true;

        /*
         * Si ya hay un refresh ejecutándose,
         * esperamos a que termine.
         */
        if(isRefreshing){
            console.log(
                "⏳ REFRESH YA EN PROGRESO → ENCOLANDO:",
                originalRequest.url
            );

            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve,
                    reject,
                    config: originalRequest,
                });
            });
        }
         /*
         * Somos la primera request que detectó
         * el access token expirado.
         */
        isRefreshing = true;
        
        try {
            console.log("🔄 REFRESH INICIO");
            await refreshAccessTokenService();
            console.log("✅ REFRESH OK");
            /*
             * Primero liberamos las requests
             * que estaban esperando.
             */
            processQueue(null);
            console.log(
                "🔁 RETRY ORIGINAL:",
                originalRequest.url
            );
            /*
             * La cookie accessToken ya fue reemplazada
             * por el backend.
             */
            return axiosClient(originalRequest);
        }catch(refreshError){
            console.log("❌ REFRESH ERROR:", refreshError);
            /*
             * Todas las requests que estaban
             * esperando deben fallar.
             */
            processQueue(refreshError);
            /*
             * Avisamos al AuthContext.
             */
            window.dispatchEvent(
                new Event("auth:session-expired")
            );
            return Promise.reject(refreshError);
        }finally{
            isRefreshing = false;
        } 

    }
);

export default axiosClient;
