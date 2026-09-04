"use client";

import CinematicRoleTranslationsPanel from "@/features/cinematicRole/components/translations/CinematicRoleTranslationsPanel";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function CinematicRoleTranslationsView() {

    const params = useParams();

    const roleId = Number(params.id);

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    const t = useTranslations("cinematicRole");

    if (!roleId) {
        return (
            <p>
                {t("translations.invalidRole")}
            </p>
        );
    }

    if (languagesLoading) {
        return (
            <p>
                {t(
                    "translations.loadingLanguages"
                )}
            </p>
        );
    }

    return (
        <CinematicRoleTranslationsPanel
            roleId={roleId}
            languages={languages}
        />
    );
}