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
        if (status !== "authenticated" || !user?.userId) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const requestId = ++requestIdRef.current;
        setLoading(true);

        try {

            const data = await profileService.getByUserId(user.userId);
            if (requestId !== requestIdRef.current) return;
            setProfile(data);

        } catch (err) {

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
        if (status === "authenticated"){
            refreshProfile();
        }else{
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