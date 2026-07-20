import { UserProfile } from "@/entities/types";
import { useProfileActions } from "@/features/profile/hooks";

export function useUpdateProfileOptimistic(profile: UserProfile | null, setProfile: (p: UserProfile) => void) {
  const { updateProfile } = useProfileActions();

  const updateField = async (field: "profilePicture" | "profileBannerUrl", file: File) => {
    if (!profile) return;
    const original = profile;
    const tempUrl = URL.createObjectURL(file);

    setProfile({ ...profile, [field]: tempUrl });

    const formData = new FormData();
    formData.append(field, file);

    try {
      const updated = await updateProfile(profile.profileId, formData);
      setProfile(updated);
    } catch (err) {
      console.error(err);
      setProfile(original);
    } finally {
      URL.revokeObjectURL(tempUrl);
    }
  };

  return { updateField };
}