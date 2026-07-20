import { refreshAccessTokenService } from "@/features/auth/service/RefreshAccessTokenService";
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
        console.log("🚨 Status de respuesta:", error.response?.status);
        console.log("🚨 Data de respuesta:", error.response?.data);
        if (!error.config) return Promise.reject(error);
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        // 🔹 Solo refrescar si el backend indica TOKEN_EXPIRED
        const tokenExpired = error.response?.status === 401 && error.response?.data?.code === "ACCESS_TOKEN_EXPIRED";
        const isRefreshRequest = error.config?.url?.includes("/auth/refresh");
        //const hasSession = document.cookie.includes("refreshToken");

        if (tokenExpired && !originalRequest._retry && !isRefreshRequest) {

            console.log("🛑 401 detectado → iniciando refresh"); // 👈 AQUÍ

        

            originalRequest._retry = true;

            if (isRefreshing) {
                 console.log("⏳ Ya hay refresh en progreso, encolando request"); // opcional
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, config: originalRequest });
                });
            }

            isRefreshing = true;
            try {
                console.log("🔄 Refreshing access token...");
                await refreshAccessTokenService(); // el backend devuelve cookie HttpOnly
                console.log("✅ Refresh exitoso, reintentando request"); // 👈 AQUÍ
                processQueue(null);
                return axiosClient(originalRequest);
            } catch (refreshError) {
                window.dispatchEvent(new Event("auth:session-expired"));
                processQueue(refreshError);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        

        return Promise.reject(error);
    }
);

export default axiosClient;
