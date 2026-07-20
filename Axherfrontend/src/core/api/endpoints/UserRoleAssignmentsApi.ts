import { AssignRolesRequest, SystemRoles, } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

export const userRoleAssignmentsApi = {

    getRolesByUser: (userId: number, config?: AxiosRequestConfig) => 
        axiosClient.get<SystemRoles[]>(`/user-roles/${userId}`, config),

    assignRoles: (userId: number, assignRolesRequest: AssignRolesRequest, config?: AxiosRequestConfig) =>
        axiosClient.post<string>(`/user-roles/${userId}/bulk`, assignRolesRequest, config),

    removeRoles: (userId: number, assignRolesRequest: AssignRolesRequest, config?: AxiosRequestConfig) =>
        axiosClient.delete<string>(`/user-roles/${userId}/bulk`, {
            data: assignRolesRequest,
            ...config,
        }),

}