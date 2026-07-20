import { rolePermissionAssignmentApi } from "@/core/api/endpoints/RolePermissionAssignmentApi";
import { AssignPermissionsRequest } from "@/entities/types";

export const rolePermissionAssignmentService = {
    getByRole: async(roleId: number, signal?: AbortSignal) => {
        const res = await rolePermissionAssignmentApi.getByRole(roleId, { signal });
        return res.data;
    },

    updateByRole: async(roleId: number, payload: AssignPermissionsRequest, signal?: AbortSignal) =>{
        const res = await rolePermissionAssignmentApi.updateByRole(roleId, payload, { signal });
        return res.data;
    },
}