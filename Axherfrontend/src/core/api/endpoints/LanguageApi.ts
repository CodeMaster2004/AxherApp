import axiosClient from "@/core/api/axiosClient";
import { LanguageResponse } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const LanguageApi = {

    getActive: (
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<LanguageResponse[]>(
            "/languages/active",
            config
        ),

};