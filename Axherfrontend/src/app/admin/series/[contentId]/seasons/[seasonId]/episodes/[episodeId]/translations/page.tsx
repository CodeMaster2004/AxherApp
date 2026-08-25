"use client";

import { useParams } from "next/navigation";

import { useLanguage } from "@/features/language/hooks/useLanguage";
import EpisodeTranslationsPanel from "@/features/episodes/components/translations/EpisodeTranslationsPanel";
import { useTranslations } from "next-intl";

export default function EpisodeTranslationsPage() {

    const params = useParams();

    const episodeId = Number(params.episodeId);
    const t = useTranslations("episodes");

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    if (!episodeId) {
        return <p>{t("tanslations.invalidEpisode")}</p>;
    }

    if (languagesLoading) {
        return <p>{t("tanslations.loadingLanguages")}</p>;
    }

    return (
        <EpisodeTranslationsPanel
            episodeId={episodeId}
            languages={languages}
        />
    );
}