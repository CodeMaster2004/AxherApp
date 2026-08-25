"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import SupportTicketStatusTranslationsPanel from "@/features/supportTicketStatus/components/translation/SupportTicketStatusTranslationsPanel";

export default function SupportTicketStatusTranslationsPage() {
    const params = useParams();

    const statusId = Number(params.id);

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    if (!statusId) {
        return <p>Estado de ticket inválido.</p>;
    }

    if (languagesLoading) {
        return <p>Cargando idiomas...</p>;
    }

    return (
        <SupportTicketStatusTranslationsPanel
            statusId={statusId}
            languages={languages}
        />
    );
}