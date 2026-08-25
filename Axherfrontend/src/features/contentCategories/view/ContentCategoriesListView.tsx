"use client";
import { ContentCategoryResponse } from "@/entities/types";
import CategoriasList from "@/features/contentCategories/components/ContentCategoriesList";
import { useContentCategories, useContentCategoriesActions } from "@/features/contentCategories/hooks";
import Button from "@/shared/components/ui/Button";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";



export default function ContentCategoriesListView() {
    const router = useRouter();
    const { contentCategories, loading, currentPage, totalPages, nextPage, prevPage, searchTerm, setSearchTerm, refetch } = useContentCategories();
    const t = useTranslations("contentCategories");
    const common = useTranslations("common");
    const {
        deleting,
        removeContentCategory,
    } = useContentCategoriesActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push("/admin/contentCategories/create");
    };

    const handleEdit = (category: ContentCategoryResponse) => {
        router.push(`/admin/contentCategories/${category.contentCategoryId}/edit`);
    };

    const handleTranslations = (category: ContentCategoryResponse) => {
        router.push(`/admin/contentCategories/${category.contentCategoryId}/translations`);
    }
    

    return (
        <div className={layoutStyles.pageContainer}>
        <div className={layoutStyles.header}>
            <h1>{t("title")}</h1>
            <Button variant="animated" onClick={handleCreate}>
            {common("new")}
            </Button>
        </div>

        <CategoriasList
            contentCategories={contentCategories}
            onDelete={removeContentCategory}
            onEdit={handleEdit}
            deletingId={deleting}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={nextPage}
            onPrevPage={prevPage}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onTranslations={handleTranslations}
        />
        </div>
    );
}
