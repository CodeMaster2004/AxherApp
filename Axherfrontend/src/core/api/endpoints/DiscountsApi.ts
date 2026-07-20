import { Discounts, Page, PaginationParams } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

export const discountsApi = {
   getAll: (params: PaginationParams, search?: string, config?: AxiosRequestConfig) =>
        axiosClient.get<Page<Discounts>>("/discounts", {
            params: {...params, search},
            ...config
        }),

    getById: (id: number, config?: AxiosRequestConfig) =>
        axiosClient.get<Discounts>(`/discounts/${id}`, config),

    create: (discount: Omit<Discounts, "discountId">, config?: AxiosRequestConfig) =>
        axiosClient.post<Discounts>("/discounts", discount, config),

    update: (id: number, discount: Partial<Discounts>, config?: AxiosRequestConfig) =>
        axiosClient.patch<Discounts>(`/discounts/${id}`, discount, config),

    delete: (id: number, config?: AxiosRequestConfig) => axiosClient.delete(`/discounts/${id}`, config),
}