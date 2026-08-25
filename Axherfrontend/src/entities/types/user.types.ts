export interface UserList{
    userId: number;
    email: string;
    username: string;
    isConfirmed: boolean;
    createdAt: string; // formato "YYYY-MM-DD"
    lastLogin?: string;
    roles: string[];
}

export enum GenderEnum {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
    PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY"
}

export interface UserProfile{
    userId: number;
    profileId: number;
    username: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string,
    birthDate?: string; // formato "YYYY-MM-DD"
    gender?: GenderEnum;
    bio?: string;
    location?: string;
    website?: string;
    profilePicture?: string;
    profileBannerUrl?: string;
    profileVisibility: 'PUBLIC' | 'PRIVATE';
}

export interface UpdateUserProfile {
    displayName?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    gender?: GenderEnum | null;
    bio?: string;
    location?: string;
    website?: string;
    profilePicture?: string;
    profileBannerUrl?: string;
    profileVisibility?: 'PUBLIC' | 'PRIVATE'
}

export interface UpdateUserPreferencesRequest {
    preferredLanguageId: number;
}