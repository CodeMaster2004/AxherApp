"use client";

import { useReportCategory } from "@/features/ReportCategory/hooks/useReportCategory";
import AdminProblemReportList from "@/features/reports/components/AdminProblemReportList";
import { useAdminProblemReportActions } from "@/features/reports/hooks/useAdminProblemReportActions";
import { useAdminProblemReports } from "@/features/reports/hooks/useAdminProblemReports";
import { useReportStatus } from "@/features/reportStatus/hooks/useReportStatus";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import { useTranslations } from "next-intl";

export default function AdminProblemReportsView() {

    const {
        reportStatus,
        loading: statusesLoading,
    } = useReportStatus();

    const {
        reports,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        filters,
        setFilters,
        refetch,
    } = useAdminProblemReports();

    const {
        saving,
        error,
        updateStatus,
    } = useAdminProblemReportActions({
        onSuccess: refetch,
    });

    const {
        reportCategory,
        loading: categoriesLoading,
    } = useReportCategory();

    const t = useTranslations("problemReport");

    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>
                <h1>{t("title")}</h1>
            </div>

            <AdminProblemReportList
                reports={reports}
                statuses={reportStatus}
                categories={reportCategory}
                filters={filters}
                onFiltersChange={setFilters}

                onUpdateStatus={(reportId, statusId) =>
                    updateStatus(reportId, {
                        reportStatusId: statusId,
                    })
                }

                loading={
                    loading ||
                    saving ||
                    statusesLoading
                }

                currentPage={currentPage}
                totalPages={totalPages}

                onNextPage={nextPage}
                onPrevPage={prevPage}
            />

            {error && (
                <p>{error}</p>
            )}

        </div>
    );
}