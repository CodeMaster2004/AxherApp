"use client";

import { ContentType } from "@/entities/types";
import { useContentFilters } from "@/features/contents/hooks/useContentFilters";
import PageSectionRenderer from "@/features/pageSection/components/PageSectionRenderer";
import { usePageSections } from "@/features/pageSection/hooks/usePageSections";
import { useTranslations } from "next-intl";

export default function SeriesPageSections() {

    const {sections, loading, error} = usePageSections("SERIES");
    const t = useTranslations("pageSections");
    const {
            filters
        } = useContentFilters(ContentType.SERIE);
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
                    contentType={ContentType.SERIE}
                    categories={filters.categories}
                    basePath="/serie"
                />
            ))}
        </>
    )
}