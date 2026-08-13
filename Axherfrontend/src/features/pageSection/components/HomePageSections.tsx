"use client";

import PageSectionRenderer from "@/features/pageSection/components/PageSectionRenderer";
import { usePageSections } from "@/features/pageSection/hooks/usePageSections";

export default function HomePageSections() {

    const {sections, loading, error} = usePageSections("HOME");

    if (loading) {
        return <p>Cargando secciones...</p>;
    }

    if (error) {
        console.error("PAGE SECTIONS ERROR:", error);
        return <p>Error al cargar las secciones.</p>;
    }

    console.log("SECCIONES HOME:", sections);

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