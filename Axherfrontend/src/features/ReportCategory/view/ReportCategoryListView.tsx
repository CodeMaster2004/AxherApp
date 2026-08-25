"use client";

import { ReportCategoryResponse } from "@/entities/types";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import Button from "@/shared/components/ui/Button";
import { useRouter } from "next/navigation";
import { useReportCategory } from "@/features/ReportCategory/hooks/useReportCategory";
import { useReportCategoryActions } from "@/features/ReportCategory/hooks/useReportCategoryActions";
import ReportCategoryList from "@/features/ReportCategory/components/ReportCategoryList";
import { useTranslations } from "next-intl";

export default function ReportCategoryListView() {

    const router = useRouter();
    const common = useTranslations("common");
    const t = useTranslations("reportCategory");
    const {
        reportCategory,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch,
    } = useReportCategory();

    const {
        deleting,
        removeReportCategory,
    } = useReportCategoryActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push("/admin/report-category/create");
    };

    const handleEdit = (
        reportCategory: ReportCategoryResponse
    ) => {
        router.push(
            `/admin/report-category/${reportCategory.reportCategoryId}/edit`
        );
    };

    const handleTranslations = (reportCategory: ReportCategoryResponse) => {
        router.push(`/admin/report-category/${reportCategory.reportCategoryId}/translations`);
    }

    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>

                <h1>{t("reportCategories")}</h1>

                <Button
                    variant="animated"
                    onClick={handleCreate}
                >
                    {common("create")}
                </Button>

            </div>

            <ReportCategoryList
                reportCategories={reportCategory}
                onDelete={removeReportCategory}
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
    );
}