import { SeriesDetail } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";


export const seriesApi = {

    getByContentId: (contentId: number, config?: AxiosRequestConfig) =>
        axiosClient.get<SeriesDetail>(`/admin/series/${contentId}`, config),
}