import { usersApi } from "@/core/api/endpoints/UsersApi";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Client } from "@stomp/stompjs";
import { useEffect } from "react";
import SockJS from "sockjs-client";

export function usePermissionSocket(userId: number) {
  const { setAuth } = useAuth();

  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("STOMP:", str),
    });

    client.onConnect = () => {
      console.log("WebSocket conectado para userId:", userId);

      client.subscribe(`/topic/permissions/${userId}`, () => {
        console.log("Permisos actualizados desde backend");

        // 🔹 Usar axiosClient desde usersApi
        usersApi.me()
          .then((res) => {
            setAuth(res.data); // Actualiza AuthContext
            console.log("AuthContext actualizado con nuevos permisos:", res.data.permissions);
          })
          .catch((err) => console.error("Error refrescando permisos:", err));
      });
    };

    client.activate();

    return () => {
      client.deactivate();
      console.log("WebSocket desconectado para userId:", userId);
    };
  }, [userId, setAuth]);
}