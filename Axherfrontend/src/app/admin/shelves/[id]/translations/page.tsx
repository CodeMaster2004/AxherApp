"use client";

import { useParams } from "next/navigation";
import {useLanguage,} from "@/features/language/hooks/useLanguage";
import ContentShelfTranslationsPanel from "@/features/shelf/components/translations/ContentShelfTranslationsPanel";
import { useTranslations } from "next-intl";

export default function ContentShelfTranslationsPage() {

    const params = useParams();
    const t = useTranslations("shelves");
    const shelfId = Number(params.id);


    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();


    if (!shelfId) {
        return (
            <p>
                {t("translation.invalidShelf")}
            </p>
        );
    }


    if (languagesLoading) {
        return (
            <p>
                {t("translation.loadingLanguages")}
            </p>
        );
    }


    return (
        <ContentShelfTranslationsPanel
            shelfId={shelfId}
            languages={languages}
        />
    );
}