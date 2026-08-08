import axiosClient from "@/core/api/axiosClient";
import { SeriesDetail } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const seriesApi = {

    getByContentId: (contentId: number, config?: AxiosRequestConfig) =>
        axiosClient.get<SeriesDetail>(`/series/${contentId}`, config),
}