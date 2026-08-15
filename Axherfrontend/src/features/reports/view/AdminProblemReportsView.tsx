"use client";

import AdminProblemReportList from "@/features/reports/components/AdminProblemReportList";
import { useAdminProblemReportActions } from "@/features/reports/hooks/useAdminProblemReportActions";
import { useAdminProblemReports } from "@/features/reports/hooks/useAdminProblemReports";
import { useReportStatus } from "@/features/reportStatus/hooks/useReportStatus";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";

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

    return (
        <div className={layoutStyles.pageContainer}>

            <div className={layoutStyles.header}>
                <h1>Reportes de problemas</h1>
            </div>

            <AdminProblemReportList
                reports={reports}
                statuses={reportStatus}

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