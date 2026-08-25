"use client";

import PageSectionRenderer from "@/features/pageSection/components/PageSectionRenderer";
import { usePageSections } from "@/features/pageSection/hooks/usePageSections";
import { useTranslations } from "next-intl";

export default function HomePageSections() {

    const {sections, loading, error} = usePageSections("HOME");
    const t = useTranslations("pageSections");

    if (loading) {
        return <p>{t("loading")}</p>;
    }

    if (error) {
        console.error("PAGE SECTIONS ERROR:", error);
        return <p>{t("error")}</p>;
    }


    return (
        <>
            {sections.map(section => (
                <PageSectionRenderer
                    key={section.pageSectionId}
                    section={section}
                />
            ))}
        </>
    );
}