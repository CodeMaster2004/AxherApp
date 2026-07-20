import axiosRefreshClient from "@/core/api/axiosRefreshClient";

export async function refreshAccessTokenService(): Promise<void> {
  await axiosRefreshClient.post("/auth/refresh");
}