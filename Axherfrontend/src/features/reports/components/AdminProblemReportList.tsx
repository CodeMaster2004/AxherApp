"use client";

import { ProblemReportFilters, ProblemReportResponse } from "@/entities/types/problemReport.types";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import Pagination from "@/shared/components/ui/Pagination";
import { formatDate } from "@/shared/utils/date";
import { useTranslations } from "next-intl";
import { ReportCategoryResponse } from "@/entities/types";

interface ProblemReportStatus{
    reportStatusId: number;
    code: string;
    name: string;
}

interface Props {
    reports: ProblemReportResponse[];
    statuses: ProblemReportStatus[];

    categories: ReportCategoryResponse[];

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

    categories,

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

    const common = useTranslations("common");
    const t = useTranslations("problemReport");

    return (

        <div className={layoutStyles.section}>

            <ConfirmDialog
                isOpen={statusDialog.isOpen}
                title={t("status.changeTitle")}
                message={t("status.changeMessage", { id: statusDialog.reportId, status: statusDialog.statusName })}
                confirmText={common("change")}
                cancelText={common("cancel")}
                onConfirm={handleConfirmStatus}
                onCancel={handleCancelStatus}
                variant="info"
            />

            <div className={tableStyles.searchBox}>

                <input
                    type="text"
                    placeholder={t("list.searchPlaceholder")}
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
                        {t("list.allStatuses")}
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
                        {t("list.allCategories")}
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category.reportCategoryId}
                            value={category.code}
                        >
                            {category.name}
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
                        ? t("list.loading")
                        : t("list.empty")
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
                                <th className={tableStyles.headCell}>{common("id")}</th>
                                <th className={tableStyles.headCell}>{t("list.category")}</th>
                                <th className={tableStyles.headCell}>{common("description")}</th>
                                <th className={tableStyles.headCell}>{t("list.content")}</th>
                                <th className={tableStyles.headCell}>{t("list.episode")}</th>
                                <th className={tableStyles.headCell}>{common("status")}</th>
                                <th className={tableStyles.headCell}>{t("list.reported")}</th>
                                <th className={tableStyles.headCell}>{t("list.resolved")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(report => (
                                <tr key={report.reportId}>
                                    <td># {report.reportId}</td>
                                    <td>{report.reportCategoryName}</td>
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