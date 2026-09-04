export interface PersonCreateRequest {
    firstName: string;
    lastName: string;
    photo?: File;
}

export interface PersonUpdateRequest {
    firstName?: string;
    lastName?: string;
    photo?: File;
}

export interface PersonResponse {
    personId: number;
    firstName: string;
    lastName?: string;
    photo?: string;
}