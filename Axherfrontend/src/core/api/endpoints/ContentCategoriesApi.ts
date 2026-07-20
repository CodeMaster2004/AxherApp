import { ContentCategories, Page, PaginationParams } from "@/entities/types";
import type { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

export const contentCategoriesApi = {

  getAll: (params: PaginationParams , search?: string, config?: AxiosRequestConfig) =>
    axiosClient.get<Page<ContentCategories>>("/categories",{
      params: {
        ...params,
        search,
      },
      ...config
    }),

  getById: (id: number, config?: AxiosRequestConfig) => 
  axiosClient.get<ContentCategories>(`/categories/${id}`, config),
  
  create: (category: Omit<ContentCategories, "contentCategoryId">, config?: AxiosRequestConfig) =>
    axiosClient.post<ContentCategories>("/categories", category, config),

  update: (id: number, category: Partial<ContentCategories>, config?: AxiosRequestConfig) =>
    axiosClient.patch<ContentCategories>(`/categories/${id}`, category, config),
  
  delete: (id: number, config?: AxiosRequestConfig) => axiosClient.delete(`/categories/${id}`, config),
};
