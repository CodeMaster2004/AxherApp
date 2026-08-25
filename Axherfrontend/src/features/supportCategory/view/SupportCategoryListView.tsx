"use client";

import { SupportCategoryResponse } from "@/entities/types";
import { useSupportCategory } from "@/features/supportCategory/hooks/useSupportCategory";
import { useSupportCategoryActions } from "@/features/supportCategory/hooks/useSupportCategoryActions";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import Button from "@/shared/components/ui/Button";
import SupportCategoryList from "@/features/supportCategory/components/SupportCategoryList";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SupportCategoryListView() {

    const router = useRouter();
    const common = useTranslations("common");
    const t = useTranslations("supportCategory");
    const {
        supportCategory,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch
    } = useSupportCategory();

    const {deleting, removeSupportCategory} = useSupportCategoryActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
            router.push("/admin/support/ticket-category/create");
    }

    const handleEdit = (supportCategory: SupportCategoryResponse) => {
        router.push(`/admin/support/ticket-category/${supportCategory.supportCategoryId}/edit`);
    }

    const handleTranslations = (supportCategory: SupportCategoryResponse) => {
        router.push(`/admin/support/ticket-category/${supportCategory.supportCategoryId}/translations`);
    }

    return (

        <div className={layoutStyles.pageContainer}>
            <div className={layoutStyles.header}>
                <h1>{t("title")}</h1>
                <Button
                    variant="animated"
                    onClick={handleCreate}
                >
                    {common("new")}
                </Button>
            </div>
            <SupportCategoryList
                supportCategories={supportCategory}
                onDelete={removeSupportCategory}
                onEdit={handleEdit}
                deletingId={deleting}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={prevPage}
                onNextPage={nextPage}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onTranslations={handleTranslations}
            />
        </div>

    )
}