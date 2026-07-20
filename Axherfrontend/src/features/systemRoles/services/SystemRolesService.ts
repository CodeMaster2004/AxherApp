import { systemRolesApi } from "@/core/api/endpoints/SystemRolesApi";
import { Page, PaginationParams, SystemRoles } from "@/entities/types";

export const systemRolesService = {

    getAll: async(params: PaginationParams, search?: string, signal?: AbortSignal): Promise<Page<SystemRoles>> => {
        const res = await systemRolesApi.getAll(params, search, { signal });
        return res.data;
    },

    getById: async(id: number, signal?: AbortSignal): Promise<SystemRoles> => {
        const res = await systemRolesApi.getById(id, { signal });
        return res.data;
    },

    create: async(data: Omit<SystemRoles, "systemRoleId">, signal?: AbortSignal): Promise<SystemRoles> =>{
        const res = await systemRolesApi.create(data, { signal });
        return res.data;
    },

    update: async(id: number, data: Partial<SystemRoles>, signal?: AbortSignal): Promise<SystemRoles> => {
        const res = await systemRolesApi.update(id, data, { signal });
        return res.data;
    },

    delete: async(id: number, signal?: AbortSignal): Promise<void> =>{
        await systemRolesApi.delete(id, { signal });
    }
}