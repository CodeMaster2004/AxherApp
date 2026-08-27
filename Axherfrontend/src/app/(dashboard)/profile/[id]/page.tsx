"use client";

import { useTranslations } from "next-intl";
import ProfilePageClient from "../../../../features/profile/view/UserProfileListView";
import { useParams } from "next/navigation";

export default function ProfilePage() {
    const params = useParams();

    // Si params.id es un array, tomar el primer elemento
    const idParam = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const t = useTranslations("profile");
    const userId = idParam ? parseInt(idParam, 10) : undefined;

    if (!userId || isNaN(userId)) {
        return <div>{t("invalidUserId")}</div>;
    }

    return <ProfilePageClient userId={userId} />;
}