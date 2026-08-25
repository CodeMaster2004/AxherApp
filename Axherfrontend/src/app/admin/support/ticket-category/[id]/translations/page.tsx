"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import SupportCategoryTranslationsPanel from "@/features/supportCategory/components/translations/SupportCategoryTranslationsPanel";
import { useTranslations } from "next-intl";

export default function SupportCategoryTranslationsPage() {
    const params = useParams();
    const t = useTranslations("supportCategories");
    const category = Number(params.id);

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    if (!category) {
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
        <SupportCategoryTranslationsPanel
            categoryId={category}
            languages={languages}
        />
    );
}