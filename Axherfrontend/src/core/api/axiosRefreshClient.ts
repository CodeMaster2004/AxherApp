import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Función para refrescar el token de acceso sin interceptores para evitar bucles infinitos

export const axiosRefreshClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Asegura que las cookies se envíen con cada solicitud
});

export default axiosRefreshClient;