import axiosClient from "@/core/api/axiosClient";
import { PageSection } from "@/entities/types/pageSection.types";
import { AxiosRequestConfig } from "axios";

export const pageSectionApi = {

    getByPage: (
        page: string,
        config?: AxiosRequestConfig
    ) => 
        axiosClient.get<PageSection[]>(
            `/pages/${page}/sections`,
            config
        ),

}