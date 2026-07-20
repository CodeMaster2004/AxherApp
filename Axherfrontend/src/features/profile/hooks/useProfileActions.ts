"use client";

import { UpdateUserProfile, UserProfile } from "@/entities/types";
import { profileService } from "@/features/profile/services/UserProfilesService";
import { useCallback, useState } from "react";

type Options = {
    onSuccess?: (profile: UserProfile) => void;
    onError?: (error: unknown) => void
}

export const useProfileActions = (options?: Options) => {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<unknown | null>(null)

    const updateProfile = useCallback(
        async (profileId: number, updateData: UpdateUserProfile | FormData) => {
            setSaving(true);
            setError(false);
            try{
                const updated = await profileService.update(profileId, updateData);
                options?.onSuccess?.(updated)
                return updated;
            }catch (err) {
                setError(err);
                options?.onError?.(err);
                throw err;
            }finally {
                setSaving(false);
            }
        },
        [options]
    );

    return {
        updateProfile,
        saving,
        error,
    };
};