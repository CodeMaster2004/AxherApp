"use client";

import {
    PageSection,
    PageSectionType,
    PageType
} from "@/entities/types/pageSection.types";

import { usePageSectionActions } from "@/features/pageSection/hooks/usePageSectionActions";
import { pageSectionService } from "@/features/pageSection/services/pageSectionService";

import PageSectionForm from "@/features/pageSection/components/PageSectionForm";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import layoutStyles from "@/shared/styles/shared/Layout.module.css";

export default function EditPageSectionPage() {

    const router = useRouter();
    const params = useParams();

    const id = params?.id
        ? Number(params.id)
        : null;


    const [loading, setLoading] =
        useState(true);


    const [page, setPage] =
        useState<PageType | undefined>();

    const [type, setType] =
        useState<PageSectionType | undefined>();

    const [displayOrder, setDisplayOrder] =
        useState(1);

    const [active, setActive] =
        useState(true);

    const [contentShelfId, setContentShelfId] =
        useState<number | undefined>();


    const {
        editSection,
        saving
    } = usePageSectionActions({
        onSuccess: () =>
            router.push("/admin/page-sections")
    });


    useEffect(() => {

        if (!id) {
            router.push("/admin/page-sections");
            return;
        }


        const load = async () => {

            try {

                const section: PageSection =
                    await pageSectionService.getById(id);


                setPage(section.page);

                setType(section.type);

                setDisplayOrder(
                    section.displayOrder
                );

                setActive(
                    section.active
                );

                setContentShelfId(
                    section.contentShelfId ?? undefined
                );


            } catch (error) {

                console.error(error);

                router.push("/admin/page-sections");

            } finally {

                setLoading(false);

            }

        };


        load();

    }, [id, router]);


    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();


        if (!id || !type) {
            return;
        }


        await editSection(
            id,
            {
                type,
                displayOrder,
                active,
                contentShelfId
            }
        );

    };


    if (loading) {

        return (
            <div className={layoutStyles.loading}>
                Cargando sección...
            </div>
        );

    }


    return (

        <div className={layoutStyles.pageContainer}>

            <h1>
                Editar Sección
            </h1>


            <PageSectionForm

                page={page}
                type={type}
                displayOrder={displayOrder}
                active={active}
                contentShelfId={contentShelfId}

                setPage={setPage}
                setType={setType}
                setDisplayOrder={setDisplayOrder}
                setActive={setActive}
                setContentShelfId={
                    setContentShelfId
                }

                onSubmit={handleSubmit}

                isEditing

                saving={saving}

                onCancel={() =>
                    router.push("/admin/page-sections")
                }

            />

        </div>

    );
}