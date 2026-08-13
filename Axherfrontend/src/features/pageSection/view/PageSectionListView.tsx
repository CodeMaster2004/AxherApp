"use client";

import { PageSection } from "@/entities/types/pageSection.types";
import { usePageSectionActions } from "@/features/pageSection/hooks/usePageSectionActions";
import { useRouter } from "next/navigation";
import { useState } from "react";

import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import Button from "@/shared/components/ui/Button";

import PageSectionList from "@/features/pageSection/components/PageSectionList";
import { useAdminPageSections } from "@/features/pageSection/hooks/useAdminPageSections";

export default function PageSectionListView() {

    const router = useRouter();

    const [page, setPage] = useState<
        "HOME" | "MOVIES" | "SERIES"
    >("HOME");

    const {
        sections,
        loading,
        error,
        refetch
    } = useAdminPageSections(page);


    const {
        deleting,
        moving,
        removeSection,
        moveSection,
        toggleSection
    } = usePageSectionActions({
        onSuccess: refetch,
    });


    const handleCreate = () => {

        router.push(
            "/page-sections/create"
        );

    };


    const handleEdit = (
        section: PageSection
    ) => {

        router.push(
            `/page-sections/${section.pageSectionId}/edit`
        );

    };



    const handleMove = async (
        id: number,
        displayOrder: number
    ) => {

        await moveSection(
            id,
            displayOrder
        );

    };


    return (

        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>

                <h1>
                    Secciones de página
                </h1>

                <Button
                    variant="animated"
                    onClick={handleCreate}
                >
                    Crear Sección
                </Button>

            </div>


            <div className={layoutStyles.pageSections}>

                <Button
                    variant="tab"
                    active={page === "HOME"}
                    onClick={() => setPage("HOME")}
                >
                    Home
                </Button>

                <Button
                    variant="tab"
                    active={page === "MOVIES"}
                    onClick={() => setPage("MOVIES")}
                >
                    Películas
                </Button>

                <Button
                    variant="tab"
                    active={page === "SERIES"}
                    onClick={() => setPage("SERIES")}
                >
                    Series
                </Button>

            </div>


            <PageSectionList
                sections={sections}
                onEdit={handleEdit}
                onDelete={removeSection}
                onToggle={toggleSection}
                onMove={handleMove}
                deletingId={deleting}
                movingId={moving}
                loading={loading}
            />

        </div>

    );
}