"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import ReportStatusTranslationsPanel from "@/features/reportStatus/components/translations/ReportStatusTranslationsPanel";
import { useTranslations } from "next-intl";

export default function ReportStatusTranslationsPage() {

    const params = useParams();
    const t = useTranslations("reportStatus");
    const statusId = Number(params.id);

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    if (!statusId) {
        return (
            <p>
                {t("translations.invalidStatus")}
            </p>
        );
    }

    if (languagesLoading) {
        return (
            <p>
                {t("translations.loading")}
            </p>
        );
    }

    return (
        <ReportStatusTranslationsPanel
            statusId={statusId}
            languages={languages}
        />
    );
}