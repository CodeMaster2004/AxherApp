import axiosClient from "@/core/api/axiosClient";
import { UpdateUserPreferencesRequest } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const userPreferencesApi = {

    updatePreferences: (
        request: UpdateUserPreferencesRequest,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.patch<void>(
            "/users/me/preferences",
            request,
            config
        ),
}