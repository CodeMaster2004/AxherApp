import { userRoleAssignmentsApi } from "@/core/api/endpoints/UserRoleAssignmentsApi";
import { AssignRolesRequest, SystemRoles } from "@/entities/types";

export const userRoleAssignmentsService = {

    getById: async(userId: number, signal?: AbortSignal): Promise<SystemRoles[]> => {
        const res = await userRoleAssignmentsApi.getRolesByUser(userId, { signal });
        return res.data;
    },

    assignRoles: async(userId: number, assignRolesRequest: AssignRolesRequest, signal?: AbortSignal): Promise<string> => {
        const res = await userRoleAssignmentsApi.assignRoles(userId, assignRolesRequest, { signal });
        return res.data;
    },

    removeRoles: async(userId: number, assignRolesRequest: AssignRolesRequest, signal?: AbortSignal): Promise<string> => {
        const res = await userRoleAssignmentsApi.removeRoles(userId, assignRolesRequest, { signal });
        return res.data;
    }
    
}