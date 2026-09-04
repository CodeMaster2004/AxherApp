export interface ContentPersonRoleCreateRequest {
    personId: number;
    cinematicRoleId: number;
    characterName?: string;
    orderIndex?: number | null;
}

export interface ContentPersonRoleResponse {
    contentPersonRoleId: number;

    personId: number;
    personName: string;
    personPhoto?: string;

    cinematicRoleId: number;
    cinematicRoleCode: string;
    cinematicRoleName: string;

    characterName?: string;
    orderIndex?: number;
}

export interface ContentPersonRoleUpdateRequest {
    personId?: number;
    cinematicRoleId?: number;
    characterName?: string;
    orderIndex?: number;
}