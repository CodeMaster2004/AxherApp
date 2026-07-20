export interface SystemRoles{
    systemRoleId: number;
    roleName: string;
}

export interface AssignRolesRequest{
    roles: string[];

}

export interface RolePermissionAssignment {
    role: SystemRoles;
    permissions: SystemPermissions;
    assignedAt: string; // formato "YYYY-MM-DD"
}

export interface SystemPermissions{
    systemPermissionId: number;
    moduleName: string;
    actionName: string;
    permissionName: string;
}

export interface AssignPermissionsRequest {
    addPermissionIds?: number[];
    removePermissionIds?: number[];
}
