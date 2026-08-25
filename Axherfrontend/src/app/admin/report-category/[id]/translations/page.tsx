"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import ReportCategoryTranslationsPanel from "@/features/ReportCategory/components/translations/ReportCategoryTranslationsPanel";
import { useTranslations } from "next-intl";

export default function ReportCategoryTranslationsPage() {

    const params = useParams();
    const categoryId = Number(params.id);
    const t = useTranslations("reportCategory");
    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();


    if (!categoryId) {
        return (
            <p>
                {t("translations.invalidCategory")}
            </p>
        );

    }

    if (languagesLoading) {
        return (
            <p>
                {t("translations.loadingLanguages")}
            </p>
        );

    }

    return (
        <ReportCategoryTranslationsPanel
            categoryId={categoryId}
            languages={languages}
        />

    );

}