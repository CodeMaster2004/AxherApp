import { ReportStatusResponse } from "@/entities/types";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import { useTranslations } from "next-intl";

interface Props {
    reportStatus: ReportStatusResponse[];
    onDelete: (reportStatusId: number) => void;
    onEdit: (reportStatus: ReportStatusResponse) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onTranslations?: (reportStatus: ReportStatusResponse) => void;
}

export default function ReportStatusList({
    reportStatus,
    onDelete,
    onEdit,
    deletingId,
    loading,

    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    searchTerm,
    onSearchChange,
    onTranslations,
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("reportStatus");

    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, reportStatusId: number, name: string }>({
        isOpen: false,
        reportStatusId: 0,
        name: ""
    });

    const handleDeleteClick = (reportStatusId: number, name: string) => {
        setConfirmDialog({ isOpen: true, reportStatusId, name });
    }

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.reportStatusId);
        setConfirmDialog({ isOpen: false, reportStatusId: 0, name: "" });
    }

    const handleCancelDelete = () => {
        setConfirmDialog({ isOpen: false, reportStatusId: 0, name: "" });
    }
    

    return (

        <div className={layoutStyles.section}>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={t("delete.title")}
                message={t("delete.message", { name: confirmDialog.name })}
                confirmText={common("delete")}
                cancelText={common("cancel")}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"
            />

            <div className={tableStyles.searchBox}>
                <input
                    type="text"
                    placeholder={t("list.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={tableStyles.searchInput}
                />
            </div>

            {reportStatus.length === 0 ? (
                <p>{loading ? common("loading") : t("list.empty")}</p>
            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
                  <table className={tableStyles.table}>
                    <thead>
                        <tr className={tableStyles.rowHover}>
                            <th className={`${tableStyles.headCell} ${tableStyles.idColumn}`}>{common("id")}</th>
                            <th className={tableStyles.headCell}>{t("list.code")}</th>
                            <th className={tableStyles.headCell}>{common("name")}</th>
                            <th className={tableStyles.headCell}>{common("description")}</th>
                            <th className={tableStyles.headCell}>{common("actions")}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reportStatus.map((reportStatus) => (
                            <tr key={reportStatus.reportStatusId} className={tableStyles.rowHover}>
                                <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{reportStatus.reportStatusId}</td>
                                <td className={tableStyles.cell}>{reportStatus.code}</td>
                                <td className={tableStyles.cell}>{reportStatus.name}</td>
                                <td className={tableStyles.cell}>{reportStatus.description}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                            {/* Menú de tres puntos con acciones de fila */}
                                            <MoreMenu
                                                items={[
                                                    {
                                                        label: common("edit"),
                                                        onClick: () => onEdit(reportStatus),
                                                    },
                                                    ...(onTranslations ? [{
                                                        label: common("translations"),
                                                        onClick: () => onTranslations(reportStatus),
                                                    }]: []),
                                                    {
                                                        label:
                                                            deletingId === reportStatus.reportStatusId
                                                                ? common("deleting")
                                                                : common("delete"),
                                                        onClick: () => handleDeleteClick(reportStatus.reportStatusId, reportStatus.code),
                                                        variant: "danger",
                                                    },
                                                ]}
                                            />
                                    </td>
                            </tr>
                        ))}

                    </tbody>
                  </table>
                </div>
            )}
            {reportStatus.length > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={onNextPage}
                    onPrevPage={onPrevPage}
                />
            )}
        </div>

    )
}