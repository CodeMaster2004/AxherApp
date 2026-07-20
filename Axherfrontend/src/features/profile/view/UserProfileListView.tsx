"use client";

import { useAuth } from "@/features/auth/context/AuthContext";
import Profile from "@/features/profile/components/Profile";
import { useProfileContext } from "@/features/profile/context/ProfileContext";
import { useRouter } from "next/navigation";

interface Props {
    userId?: number;
}

export default function ProfileListView({ userId }: Props) {

    const router = useRouter();
    const { user } = useAuth();
    const loggedUserId = user?.userId;
    const isOwnProfile = !userId || userId === loggedUserId;
    const { profile, setProfile, loading, updateProfileField } = useProfileContext();

    if (loading) return <div>Cargando perfil...</div>;
    if (!profile) return <div>No se encontró perfil</div>;

    // 🔥 Subida inmediata de la foto de perfil
    const handleProfilePictureChange = async (file: File) => {
        const original = profile;
        const tempUrl = URL.createObjectURL(file);

        // Actualizamos la UI inmediatamente
        setProfile(prev => prev ? { ...prev, profilePicture: tempUrl } : prev);
        
        const formData = new FormData();
        formData.append("profilePicture", file);

        try {
            await updateProfileField(formData);
        } catch (err) {
            console.error(err);
            setProfile(original); // Revertimos a la original en caso de error
            alert("Error al subir foto de perfil");
        }finally{
            URL.revokeObjectURL(tempUrl);
        }
    };
  

    // 🔥 Subida inmediata del banner
    const handleBannerChange = async (file: File) => {
        const original = profile;
        const tempUrl = URL.createObjectURL(file);

        // Actualizamos la UI inmediatamente
        setProfile(prev => prev ? { ...prev, profileBannerUrl: tempUrl } : prev);
        const formData = new FormData();
        formData.append("profileBannerUrl", file);
        try {
            await updateProfileField(formData);
        } catch (err) {
            console.error(err);
            setProfile(original);
            alert("Error al subir banner");
        }finally{
            URL.revokeObjectURL(tempUrl);
        }
    };

  return (
    <Profile
        profile={profile}
        isOwnProfile={isOwnProfile}
        onEditProfile={() => router.push(`/profile/${profile.userId}/edit`)}
        onProfilePictureChange={handleProfilePictureChange}
        onBannerChange={handleBannerChange}
    />
  );
}