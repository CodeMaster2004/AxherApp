"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import SupportTicketStatusTranslationsPanel from "@/features/supportTicketStatus/components/translation/SupportTicketStatusTranslationsPanel";
import { useTranslations } from "next-intl";

export default function SupportTicketStatusTranslationsPage() {
    const params = useParams();

    const statusId = Number(params.id);

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();
    const t = useTranslations("supportTicketStatus");

    if (!statusId) {
        return <p>{t("loadingLanguages.invalidStatus")}</p>;
    }

    if (languagesLoading) {
        return <p>{t("translations.loadingLanguages")}</p>;
    }

    return (
        <SupportTicketStatusTranslationsPanel
            statusId={statusId}
            languages={languages}
        />
    );
}