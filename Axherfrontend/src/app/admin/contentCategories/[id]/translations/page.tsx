"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import ContentCategoryTranslationsPanel from "@/features/contentCategories/components/translations/ContentCategoryTranslationsPanel";
import { useTranslations } from "next-intl";

export default function ContentCategoryTranslationsPage() {

    const params = useParams();

    const t = useTranslations("contentCategories");

    const categoryId = Number(params.id);

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    if (!categoryId) {
        return <p>{t("errors.invalidCategory")}</p>;
    }

    if (languagesLoading) {
        return <p>{t("errors.loadingLanguages")}</p>;
    }

    return (
        <ContentCategoryTranslationsPanel
            categoryId={categoryId}
            languages={languages}
        />
    );
}