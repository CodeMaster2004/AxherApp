"use client";

import { useParams } from "next/navigation";
import {useLanguage,} from "@/features/language/hooks/useLanguage";
import HeroBannerTranslationsPanel from "@/features/heroBanner/components/translations/HeroBannerTranslationsPanel";
import { useTranslations } from "next-intl";

export default function HeroBannerTranslationsPage() {

    const params = useParams();
    const heroBannerId = Number(params.id);
    const t = useTranslations("heroBanner");

    const {
        languages,
        loading: languagesLoading,
    } = useLanguage();

    if (!heroBannerId) {

        return (
            <p>
                {t("translations.invalidBanner")}
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
        <HeroBannerTranslationsPanel
            heroBannerId={heroBannerId}
            languages={languages}
        />
    );
}