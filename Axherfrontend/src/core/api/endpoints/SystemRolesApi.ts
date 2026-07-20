import { Page, PaginationParams, SystemRoles } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

export const systemRolesApi = {

    getAll: (params: PaginationParams, search?: string, config?: AxiosRequestConfig) =>
        axiosClient.get<Page<SystemRoles>>("/roles", {
            params: {...params, search},
            ...config
        }),

    getById: (id: number, config?: AxiosRequestConfig) =>
        axiosClient.get<SystemRoles>(`/roles/${id}`, config),

    create: (systemRoles: Omit<SystemRoles, "systemRoleId">, config?: AxiosRequestConfig) =>
        axiosClient.post<SystemRoles>("/roles", systemRoles, config),

    update: (id: number, systemRoles: Partial<SystemRoles>, config?: AxiosRequestConfig) =>
        axiosClient.patch<SystemRoles>(`/roles/${id}`, systemRoles, config),

    delete: (id: number, config?: AxiosRequestConfig) => axiosClient.delete(`/roles/${id}`, config),
}