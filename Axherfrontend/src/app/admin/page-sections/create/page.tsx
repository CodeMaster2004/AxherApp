"use client";

import { PageSectionType, PageType } from "@/entities/types/pageSection.types";
import { usePageSectionActions } from "@/features/pageSection/hooks/usePageSectionActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import PageSectionForm from "@/features/pageSection/components/PageSectionForm";
import { useTranslations } from "next-intl";


export default function CreatePageSectionPage() {

    const router = useRouter();
    const common = useTranslations("common");
    const [page, setPage] = useState<PageType>("HOME");
    const [type, setType] = useState<PageSectionType>("SHELF");
    const [displayOrder, setDisplayOrder] = useState<number | null>(null);

    const [active, setActive] = useState(true);

    const [contentShelfId, setContentShelfId] =
        useState<number | undefined>(undefined);

    const {
        addSection,
        saving
    } = usePageSectionActions({
        onSuccess: () =>
            router.push("/admin/page-sections")
    })

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        await addSection({
            page,
            type,
            displayOrder,
            active,
            contentShelfId
        });
    };

    return (
        <div className={layoutStyles.pageContainer}>
            <h1>{common("create")}</h1>

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
                setContentShelfId={setContentShelfId}

                onSubmit={handleSubmit}
                
                saving={saving}

                onCancel={() => router.push("/admin/page-sections")}
            />
        </div>
    )

}