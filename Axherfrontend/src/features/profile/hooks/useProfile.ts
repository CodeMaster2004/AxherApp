"use client";

import { UserProfile } from "@/entities/types";
import { profileService } from "@/features/profile/services/UserProfilesService";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const useProfile = (profileId?: number, userId?: number) => {
     console.log("useUserProfile called with userId:", userId);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown | null>(null); 

    const fetchProfile = useCallback(
        async (signal?: AbortSignal) => {
            if(!profileId && !userId) return;

            setLoading(true);
            setError(null);

            try {
                const data = profileId
                    ? await profileService.getById(profileId, signal)
                    : await profileService.getByUserId(userId!, signal);
                setProfile(data);
                return data;
            }catch (err: unknown) {
                if(axios.isCancel(err)){
                    console.log("Peticion cancelada, no es un error real");
                    return;
                }
                
                if(axios.isAxiosError(err)) {
                    if(err.response?.status === 401) {
                        console.log(" 401 detectado, probablemente refresh en cuerso...");
                        return;
                    }
                }

                console.error("Error real al obtener perfil:", err);
                setError(err);
            }finally{
                
                setLoading(false);
            }
        },
        [profileId, userId]
    );
    

    useEffect(() => {
        const controller = new AbortController();
        fetchProfile(controller.signal);
        return () => controller.abort();
    },[fetchProfile]);

    const refetch = useCallback(() => fetchProfile(), [fetchProfile]);
    console.log("useUserProfile hook return:", { profile, loading, error });
    return {
        profile,
        setProfile,
        loading,
        error,
        refetch,
    };
};