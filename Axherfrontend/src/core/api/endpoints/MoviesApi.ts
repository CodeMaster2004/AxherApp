import axiosClient from "@/core/api/axiosClient";
import { ContentDetail, MovieQueryParams, Page, PaginationParams } from "@/entities/types";
import { AxiosRequestConfig } from "axios";

export const moviesApi = {

    getAll:(
        params: MovieQueryParams,
        config?: AxiosRequestConfig
    ) =>
        axiosClient.get<Page<ContentDetail>>(
            "/movies",
            {
                params,
                ...config
            }
        ),

    getNewMovies: (
        params: PaginationParams,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.get<Page<ContentDetail>>(
            "/movies/new",
            {
                params,
                ...config
            }
        )


}