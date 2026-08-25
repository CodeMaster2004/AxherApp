"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import ContentStatusTranslationsPanel from "@/features/contentStatus/components/translation/ContentStatusTranslationsPanel";
import { useTranslations } from "next-intl";

export default function ContentStatusTranslationsPage() {

    const params = useParams();

    const statusId = Number(params.id);

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();
    const t = useTranslations("contentStatus");

    if (!statusId) {
        return <p>{t("translations.invalidStatus")}</p>;
    }

    if (languagesLoading) {
        return <p>{t("translations.loadingLanguages")}</p>;
    }

    return (
        <ContentStatusTranslationsPanel
            statusId={statusId}
            languages={languages}
        />
    );
}