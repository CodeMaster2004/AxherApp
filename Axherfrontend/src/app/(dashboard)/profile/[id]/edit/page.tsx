"use client";

import { GenderEnum } from "@/entities/types";
import { useAuth } from "@/features/auth/context/AuthContext";
import EditProfileForm from "@/features/profile/components/EditProfileForm";
import { useProfileContext } from "@/features/profile/context/ProfileContext";
import { useProfile, useProfileActions } from "@/features/profile/hooks";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProfilePage() {
    const router = useRouter();
    const { profile, updateProfileField, loading } = useProfileContext();
    const { user } = useAuth();
    const { error: fetchError } = useProfile(
        undefined,
        user?.userId ?? undefined
    );
    const { saving } = useProfileActions({
        onSuccess: () => {
            if(profile?.profileId){
                router.push(`/profile/${profile.profileId}`);
            }
        }
    });

    

    //Estados locales para el formulario
    const [displayName, setDisplayName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState<GenderEnum | undefined>(undefined);
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [website, setWebsite] = useState("");
    const [profileVisibility, setProfileVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
    
    useEffect(() => {
        if (profile) {
            setDisplayName(profile.displayName || "");
            setFirstName(profile.firstName || "");
            setLastName(profile.lastName || "");
            setBirthDate(profile.birthDate || "");
            setGender(profile.gender ?? undefined);
            setBio(profile.bio || "");
            setLocation(profile.location || "");
            setWebsite(profile.website || "");
            setProfileVisibility(profile.profileVisibility || "PUBLIC");
        }
    }, [profile]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!profile) return;

        // Convertimos a FormData
        const formData = new FormData();
        formData.append("displayName", displayName);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("birthDate", birthDate);
        if (gender) formData.append("gender", gender);
        formData.append("bio", bio);
        formData.append("location", location);
        formData.append("website", website);
        formData.append("profileVisibility", profileVisibility);
        try {
            await updateProfileField(formData);
            router.push(`/profile/${profile.profileId}`);
        } catch (err) {
            console.error(err);
            alert("Error al actualizar perfil");
        }
    };

    if(loading){
        return <div className={layoutStyles.loading}><p>Cargando perfil...</p></div>
    }

    if(fetchError){ 
        return <div className={layoutStyles.loading}><p>Error al cargar el perfil.</p></div>
    }

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>Editar Perfil</h1>
            <EditProfileForm
                displayName={displayName}
                firstName={firstName}
                lastName={lastName}
                birthDate={birthDate}
                gender={gender}
                bio={bio}
                location={location}
                website={website}
                profileVisibility={profileVisibility}
                setDisplayName={setDisplayName}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setBirthDate={setBirthDate}
                setGender={setGender}
                setBio={setBio}
                setLocation={setLocation}
                setWebsite={setWebsite}
                setProfileVisibility={setProfileVisibility}
                onSubmit={handleSubmit}
                saving={saving}
                onCancel={() => router.push(`/profile/${profile?.profileId}`)}
            
            />
        
        </div>
    );
}