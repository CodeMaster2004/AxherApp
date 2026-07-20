import { userProfilesApi } from "@/core/api/endpoints/UserProfilesApi";
import { UpdateUserProfile, UserProfile } from "@/entities/types";

export const profileService = {

    getById: async(profileId: number, signal?: AbortSignal): Promise<UserProfile> => {
        const res = await userProfilesApi.getById(profileId, { signal });
        return res.data;
    },

    getByUserId: async(userId: number, signal?: AbortSignal): Promise<UserProfile> => {
        const res = await userProfilesApi.getByUserId(userId, { signal });
        return res.data;
    },

    update: async(profileId: number, data: UpdateUserProfile | FormData, signal?: AbortSignal): Promise<UserProfile> => {
        const res = await userProfilesApi.update(profileId, data, { signal });
        return res.data;
    }
}