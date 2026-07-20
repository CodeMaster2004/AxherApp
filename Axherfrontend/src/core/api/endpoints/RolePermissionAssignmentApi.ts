import { AssignPermissionsRequest } from "@/entities/types";
import { AxiosRequestConfig } from "axios";
import axiosClient from "../axiosClient";

export const rolePermissionAssignmentApi = {

    getByRole: (roleId: number, config?: AxiosRequestConfig) =>
        axiosClient.get<string[]>(`/role-permissions/${roleId}`, config),

    updateByRole: (roleId: number, request: AssignPermissionsRequest, config?: AxiosRequestConfig) => {
    console.log("🚀 Enviando payload:", request);

    return axiosClient.post(`/role-permissions/${roleId}/bulk`, request, config);
}
}