"use client";

import { SupportTicketStatusResponse } from "@/entities/types";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Props {
    supportTicketStatus: SupportTicketStatusResponse[];
    onDelete: (supportTicketStatusId: number) => void;
    onEdit: (supportTicketStatus: SupportTicketStatusResponse) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onTranslations?: (supportTicketStatus: SupportTicketStatusResponse) => void;
}

export default function SupportTicketStatusList({
    supportTicketStatus,
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
    const t = useTranslations("supportTicketStatus");
    
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, supportTicketStatusId: number, name: string }>({
        isOpen: false,
        supportTicketStatusId: 0,
        name: ""
    });

    const handleDeleteClick = (supportTicketStatusId: number, name: string) => {
        setConfirmDialog({ isOpen: true, supportTicketStatusId, name });
    }

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.supportTicketStatusId);
        setConfirmDialog({ isOpen: false, supportTicketStatusId: 0, name: "" });
    }

    const handleCancelDelete = () => {
        setConfirmDialog({ isOpen: false, supportTicketStatusId: 0, name: "" });
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

            {supportTicketStatus.length === 0 ? (
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
                        {supportTicketStatus.map((supportTicketStatus) => (
                            <tr key={supportTicketStatus.supportTicketStatusId} className={tableStyles.rowHover}>
                                <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{supportTicketStatus.supportTicketStatusId}</td>
                                <td className={tableStyles.cell}>{supportTicketStatus.code}</td>
                                <td className={tableStyles.cell}>{supportTicketStatus.name}</td>
                                <td className={tableStyles.cell}>{supportTicketStatus.description}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                            {/* Menú de tres puntos con acciones de fila */}
                                            <MoreMenu
                                                items={[
                                                    {
                                                        label: common("edit"),
                                                        onClick: () => onEdit(supportTicketStatus),
                                                    },
                                                    ...(onTranslations ? [{
                                                        label: common("translations"),
                                                        onClick: () => onTranslations(supportTicketStatus),
                                                    }] : []),
                                                    {
                                                        label:
                                                            deletingId === supportTicketStatus.supportTicketStatusId
                                                                ? common("deleting")
                                                                : common("delete"),
                                                        onClick: () => handleDeleteClick(supportTicketStatus.supportTicketStatusId, supportTicketStatus.code),
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
            {supportTicketStatus.length > 0 && totalPages > 1 && (
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