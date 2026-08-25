"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import ContentTranslationsPanel from "@/features/contents/components/translations/ContentTranslationsPanel";
import { useTranslations } from "next-intl";

export default function ContentTranslationsPage() {

    const params = useParams();
    const contentId = Number(params.id);
    const t = useTranslations("contents")
    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    if (!contentId) {
        return <p>{t("translations.invalidContent")}</p>;
    }

    if (languagesLoading) {
        return <p>{t("translations.loadingLanguages")}</p>;
    }

    return (
        <ContentTranslationsPanel
            contentId={contentId}
            languages={languages}
        />
    );
}