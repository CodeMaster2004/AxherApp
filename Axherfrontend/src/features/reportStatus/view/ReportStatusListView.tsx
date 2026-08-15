"use client";

import { ReportStatusResponse } from "@/entities/types";
import { useReportStatus } from "@/features/reportStatus/hooks/useReportStatus";
import { useReportStatusActions } from "@/features/reportStatus/hooks/useReportStatusActions";
import { useRouter } from "next/navigation";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import Button from "@/shared/components/ui/Button";
import ReportStatusList from "@/features/reportStatus/components/ReportStatusList";


export default function ReportStatusListView() {

    const router = useRouter();
    const {
        reportStatus,
        loading,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        searchTerm,
        setSearchTerm,
        refetch
    } = useReportStatus();

    const {deleting, removeReportStatus} = useReportStatusActions({
        onSuccess: refetch,
    });

    const handleCreate = () => {
        router.push("/admin/report-status/create");
    }

    const handleEdit = (reportStatus: ReportStatusResponse) => {
        router.push(`/admin/report-status/${reportStatus.reportStatusId}/edit`);
    }

    return (

        <div className={layoutStyles.pageContainer}>
            <div className={layoutStyles.header}>
                <h1>Estados de Reportes</h1>
                <Button
                    variant="animated"
                    onClick={handleCreate}
                >
                    Nuevo
                </Button>
            </div>
            <ReportStatusList
                reportStatus={reportStatus}
                onDelete={removeReportStatus}
                onEdit={handleEdit}
                deletingId={deleting}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={prevPage}
                onNextPage={nextPage}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
        </div>

    )
}