// src/context/ProfileContext.tsx
import { UpdateUserProfile, UserProfile } from "@/entities/types";
import { profileService } from "@/features/profile/services/UserProfilesService";
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";

interface ProfileContextProps {
    profile: UserProfile | null;
    loading: boolean;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    refreshProfile: () => Promise<void>;
    updateProfileField: (updateData: UpdateUserProfile | FormData) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const { user, status } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const requestIdRef = useRef(0);
    

    const refreshProfile = useCallback(async () => {
        console.log(
        "🔵 PROFILE: refreshProfile",
        {
            status,
            userId: user?.userId
        }
    );
        if (status !== "authenticated" || !user?.userId) {
            console.log(
            "🟡 PROFILE: no autenticado → limpiando"
        );
            setProfile(null);
            setLoading(false);
            return;
        }

        const requestId = ++requestIdRef.current;
        console.log(
        "🔵 PROFILE: request iniciada",
        requestId
    );

        setLoading(true);

        try {

            const data = await profileService.getByUserId(user.userId);
            console.log(
            "🟢 PROFILE: respuesta recibida",
            requestId,
            data
        );
            if (requestId !== requestIdRef.current) {

            console.log(
                "🟠 PROFILE: respuesta vieja ignorada",
                {
                    requestId,
                    current: requestIdRef.current
                }
            );

            return;
        }

            setProfile(data);
             console.log(
            "🟢 PROFILE: profile establecido"
        );

        } catch (err) {
            console.log(
            "🔴 PROFILE: error",
            requestId,
            err
        );

            if (requestId !== requestIdRef.current) return;
            console.error(err);
            setProfile(null);
            
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }

    }, [user?.userId, status]);

    const updateProfileField = async (updateData: UpdateUserProfile | FormData) => {
        if (!profile || status !== "authenticated") return;

        const requestId = ++requestIdRef.current;

        try {
            const updated = await profileService.update(profile.profileId, updateData);

            if (requestId !== requestIdRef.current) return;

            setProfile(updated);

        } catch (err) {
            if (requestId !== requestIdRef.current) return;

            console.error(err);
        }
    };
   
    useEffect(() => {
        console.log(
        "🟣 PROFILE EFFECT",
        {
            status,
            userId: user?.userId
        }
    );
        if (status === "authenticated"){
            refreshProfile();
        }else{
            console.log(
            "🟡 PROFILE: status no autenticado → limpiar"
        );
            requestIdRef.current++;
            setProfile(null);
            setLoading(false);
        }
        
    }, [status, user, refreshProfile]);

    useEffect(() => {
        const clearProfile = () => {
            requestIdRef.current++; // invalida TODO lo pendiente
            setProfile(null);
            setLoading(false);
        };

        window.addEventListener("auth:logout", clearProfile);
        window.addEventListener("auth:session-expired", clearProfile);

        return () => {
            window.removeEventListener("auth:logout", clearProfile);
            window.removeEventListener("auth:session-expired", clearProfile);
        };
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, loading, setProfile, refreshProfile, updateProfileField }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfileContext = () => {
    const context = useContext(ProfileContext);
    if (!context) throw new Error("useUserProfileContext debe usarse dentro de UserProfileProvider");
    return context;
};