"use client";

import { useParams } from "next/navigation";

import { useLanguage } from "@/features/language/hooks/useLanguage";

import SeasonTranslationsPanel
    from "@/features/seasons/components/translations/SeasonTranslationsPanel";
import { useTranslations } from "next-intl";

export default function SeasonTranslationsPage() {

    const params = useParams();
    const t = useTranslations("seasons");
    const seasonId = Number(params.seasonId);

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    if (!seasonId) {
        return <p>{t("translations.invalidSeason")}</p>;
    }

    if (languagesLoading) {
        return <p>{t("translations.loadingLanguages")}</p>;
    }

    return (
        <SeasonTranslationsPanel
            seasonId={seasonId}
            languages={languages}
        />
    );
}