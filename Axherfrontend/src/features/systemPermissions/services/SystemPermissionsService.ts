import { systemPermissionsApi } from "@/core/api/endpoints/SystemPermissionsApi";
import { PaginationParams, SystemPermissions } from "@/entities/types";

export const systemPermissionsService = {

    getAll: async(params: PaginationParams, search?: string, signal?: AbortSignal) => {
        const res = await systemPermissionsApi.getAll(params, search, { signal });
        return res.data;
    },

    getById: async(id: number, signal?: AbortSignal) => {
        const res = await systemPermissionsApi.getById(id, { signal });
        return res.data;
    },

    create: async(data: Omit<SystemPermissions, "systemPermissionId">, signal?: AbortSignal) =>{
        const res = await systemPermissionsApi.create(data, { signal });
        return res.data;
    },

    update: async(id: number, permission: Partial<SystemPermissions>, signal?: AbortSignal) =>{
        const res = await systemPermissionsApi.update(id, permission, { signal });
        return res.data;
    },

    delete: async(id: number, signal?: AbortSignal) => {
        await systemPermissionsApi.delete(id, { signal })
    }
}