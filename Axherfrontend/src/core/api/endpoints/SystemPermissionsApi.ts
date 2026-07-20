import { Page, PaginationParams, SystemPermissions } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

export const systemPermissionsApi = {

    getAll: (params: PaginationParams, search?: string, config?: AxiosRequestConfig) =>
        axiosClient.get<Page<SystemPermissions>>("/system-permissions", {
            params: {
                ...params,
                search,
            },
            ...config
        }),

    getById: (id: number, config?: AxiosRequestConfig) =>
        axiosClient.get<SystemPermissions>(`/system-permissions/${id}`, config),

    create: (permission: Omit<SystemPermissions, "systemPermissionId">, config?: AxiosRequestConfig) => 
        axiosClient.post<SystemPermissions>("/system-permissions", permission, config),
    
    update: (id: number, permission: Partial<SystemPermissions>, config?: AxiosRequestConfig) =>
        axiosClient.patch<SystemPermissions>(`/system-permissions/${id}`, permission, config),

    delete: (id: number, config?: AxiosRequestConfig) =>
        axiosClient.delete(`/system-permissions/${id}`, config),
}