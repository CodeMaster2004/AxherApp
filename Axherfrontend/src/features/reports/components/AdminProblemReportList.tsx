"use client";

import { ProblemReportFilters, ProblemReportResponse } from "@/entities/types/problemReport.types";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import Pagination from "@/shared/components/ui/Pagination";
import { problemReportCategoryOptions } from "@/shared/constants/selectOptions";
import { formatDate } from "@/shared/utils/date";

interface ProblemReportStatus{
    reportStatusId: number;
    code: string;
    name: string;
}

interface Props {
    reports: ProblemReportResponse[];
    statuses: ProblemReportStatus[];

    filters: ProblemReportFilters;
    onFiltersChange: (filters: ProblemReportFilters) => void;

    onUpdateStatus: (
        reportId: number,
        statusId: number
    ) => void;

    loading?: boolean;

    currentPage: number;
    totalPages: number;

    onNextPage: () => void;
    onPrevPage: () => void;
}

export default function AdminProblemReportList({
    reports,
    statuses,

    filters,
    onFiltersChange,
    
    onUpdateStatus,
    loading,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage
}: Props) {

    const [pendingStatus, setPendingStatus] = useState<
        Record<number, number | undefined>
    >({});

    const [statusDialog, setStatusDialog] = useState<{
        isOpen: boolean;
        reportId: number;
        statusId: number;
        statusName: string;
    }>({
        isOpen: false,
        reportId: 0,
        statusId: 0,
        statusName: "",
    })
    const handleFilterChange = (
        key: keyof ProblemReportFilters,
        value: string
    ) => {
        onFiltersChange({
            ...filters,
            [key]: value || undefined,
        });
    }

    const handleStatusChange = (
        report: ProblemReportResponse,
        statusId: number
    ) => {
        const selectedStatus = statuses.find(
            status => status.reportStatusId === statusId
        );

        setPendingStatus(prev => ({
            ...prev,
            [report.reportId]: statusId,
        }));

        setStatusDialog({
            isOpen: true,
            reportId: report.reportId,
            statusId,
            statusName: selectedStatus?.name || "",
        });
    };

    const handleConfirmStatus = () => {

        onUpdateStatus(
            statusDialog.reportId,
            statusDialog.statusId
        )

        setPendingStatus(prev => {
            const copy = { ...prev };
            delete copy[statusDialog.reportId];
            return copy;
        });

        handleCancelStatus();
    };

    const handleCancelStatus = () => {

        setPendingStatus(prev => {
            const copy = { ...prev };

            delete copy[statusDialog.reportId];

            return copy;
        });

        setStatusDialog({
            isOpen: false,
            reportId: 0,
            statusId: 0,
            statusName: "",
        });
    };

    return (

        <div className={layoutStyles.section}>

            <ConfirmDialog
                isOpen={statusDialog.isOpen}
                title="Cambiar estado"
                message={
                    `¿Seguro que deseas cambiar el reporte #${statusDialog.reportId} a "${statusDialog.statusName}"?`
                }
                confirmText="Cambiar"
                cancelText="Cancelar"
                onConfirm={handleConfirmStatus}
                onCancel={handleCancelStatus}
                variant="info"
            />

            <h2>Reportes de problemas</h2>

            <div className={tableStyles.searchBox}>

                <input
                    type="text"
                    placeholder="Buscar reportes..."
                    value={filters.search ?? ""}
                    onChange={(e) =>
                        handleFilterChange(
                            "search",
                            e.target.value
                        )
                    }
                    className={tableStyles.searchInput}
                />

            </div>

            <div className={tableStyles.filters}>
                <select
                    value={filters.statusCode ?? ""}
                    onChange={(e) => 
                        handleFilterChange(
                            "statusCode",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Todos los estados
                    </option>
                    {statuses.map((status) => (
                        <option 
                            key={status.reportStatusId}
                            value={status.code}
                        >
                            {status.name}
                        </option>
                    ))}
                </select>
                                <select
                    value={filters.category ?? ""}
                    onChange={(e) =>
                        handleFilterChange(
                            "category",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        Todas las categorías
                    </option>

                    {problemReportCategoryOptions.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={filters.reportedAtFrom ?? ""}
                    onChange={(e) =>
                        handleFilterChange(
                            "reportedAtFrom",
                            e.target.value
                        )
                    }
                />

                <input
                    type="date"
                    value={filters.reportedAtTo ?? ""}
                    onChange={(e) =>
                        handleFilterChange(
                            "reportedAtTo",
                            e.target.value
                        )
                    }
                />

            </div>
            {reports.length === 0 ? (
                <p>
                    {loading
                        ? "Cargando reportes..."
                        : "No hay reportes registrados."
                    }
                </p>
            ) : (
                <div
                    className={`${tableStyles.tableWrap} ${
                        loading
                            ? tableStyles.loading
                            : ""
                    }`}
                >
                    <table className={tableStyles.table}>

                        <thead>
                            <tr>
                                <th className={tableStyles.headCell}>ID</th>
                                <th className={tableStyles.headCell}>Categoria</th>
                                <th className={tableStyles.headCell}>Descripción</th>
                                <th className={tableStyles.headCell}>Contenido</th>
                                <th className={tableStyles.headCell}>Episodio</th>
                                <th className={tableStyles.headCell}>Estado</th>
                                <th className={tableStyles.headCell}>Reportado</th>
                                <th className={tableStyles.headCell}>Resuelto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(report => (
                                <tr key={report.reportId}>
                                    <td># {report.reportId}</td>
                                    <td>{report.category}</td>
                                    <td className={tableStyles.categoriesCell}>{report.description}</td>
                                    <td>{report.contentId ?? "-"}</td>
                                    <td>{report.episodeId ?? "-"}</td>
                                    <td>
                                        <select
                                            className={tableStyles.statusSelect}
                                            value={pendingStatus[report.reportId] ?? report.reportStatusId}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    report,
                                                    Number(
                                                        e.target.value
                                                    )
                                                )
                                            }
                                        >
                                            {statuses.map(status => (
                                                <option
                                                    key={status.reportStatusId}
                                                    value={status.reportStatusId}
                                                >
                                                    {status.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        {formatDate(report.reportedAt)}
                                    </td>
                                    <td>
                                        {formatDate(report.resolvedAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}
            {reports.length > 0 && 
                totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNextPage={onNextPage}
                        onPrevPage={onPrevPage}
                    />
                )
            }
        </div>

    )
    
    
}