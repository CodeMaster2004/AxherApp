"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/features/language/hooks/useLanguage";
import SupportFaqTranslationsPanel from "@/features/faqs/components/translations/SupportFaqTranslationsPanel";

export default function SupportFaqTranslationsView() {

    const params = useParams();

    const faqId = Number(params.id);

    const {
        languages,
    } = useLanguage();

    return (
        <SupportFaqTranslationsPanel
            faqId={faqId}
            languages={languages}
        />
    );
}