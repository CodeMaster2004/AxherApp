import { SystemPermissions } from "@/entities/types";
import Pagination from "@/shared/components/ui/Pagination";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import MoreMenu from "../../../shared/components/ui/MoreMenu";
import { useTranslations } from "next-intl";

interface Props{
    systemPermissions: SystemPermissions[];
    onDelete: (id: number) => void;
    onEdit: (systemPermissions: SystemPermissions) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    onGoToPage?: (page: number) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function SystemPermissionsList ({
    systemPermissions,
    onDelete,
    onEdit,
    deletingId,
    loading,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    onGoToPage,
    searchTerm,
    onSearchChange
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("systemPermissions");
    
    const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean; id: number; systemPermissions: string }>({
        isOpen: false,
        id: 0,
        systemPermissions: "",
    })

    const handleDeleteClick = (id: number, systemPermissions: string) => {
        setConfirmDialog({isOpen: true, id, systemPermissions})
    }

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);
        setConfirmDialog({isOpen: false, id: 0, systemPermissions: ""})
    }

    const handleCancelDelete = () => {
        setConfirmDialog({isOpen: false, id: 0, systemPermissions: ""})
    }

    return (

        <div>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={t("delete.title")}
                message={t("delete.message", { name: confirmDialog.systemPermissions })}
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
            {systemPermissions.length === 0 ? (
                <p>{loading ? common("loading") : t("list.empty")}</p>
            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
                    <table className={tableStyles.table}>
                        <thead>
                            <tr className={tableStyles.rowHover}>
                                <th className={`${tableStyles.headCell} ${tableStyles.idColumn}`}>{common("id")}</th>
                                <th className={tableStyles.headCell}>{t("list.moduleName")}</th>
                                <th className={tableStyles.headCell}>{t("list.action")}</th>
                                <th className={tableStyles.headCell}>{t("list.permissionName")}</th>
                                <th className={tableStyles.headCell}>{common("actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {systemPermissions.map((permission) => (
                                <tr key={permission.systemPermissionId} className={tableStyles.rowHover}>
                                    <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{permission.systemPermissionId}</td>
                                    <td className={tableStyles.cell}>{permission.moduleName}</td>
                                    <td className={tableStyles.cell}>{permission.actionName}</td>
                                    <td className={tableStyles.cell}>{permission.permissionName}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                        <MoreMenu
                                            items={[
                                                {
                                                    label: common("edit"),
                                                    onClick: () => onEdit(permission),
                                                },
                                                {
                                                    label:
                                                        deletingId === permission.systemPermissionId
                                                            ? common("deleting")
                                                            : common("delete"),
                                                    onClick: () => handleDeleteClick(permission.systemPermissionId, permission.permissionName),
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
            {systemPermissions.length > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNextPage={onNextPage}
                    onPrevPage={onPrevPage}
                    onGoToPage={onGoToPage}
                />
            )}
        </div>
        
    )
}