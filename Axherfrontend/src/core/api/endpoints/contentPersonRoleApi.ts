import axiosClient from "@/core/api/axiosClient";
import { ContentPersonRoleResponse } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const contentPersonRoleApi = {
    getByContent: (
        contentId: number,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<ContentPersonRoleResponse[]>(
            `/contents/${contentId}/people`,
            {
                ...config,
            }
        ),
};