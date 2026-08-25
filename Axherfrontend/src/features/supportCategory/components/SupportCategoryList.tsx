import { SupportCategoryResponse } from "@/entities/types";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import { useTranslations } from "next-intl";

interface Props {
    supportCategories: SupportCategoryResponse[];
    onDelete: (supportCategoryId: number) => void;
    onEdit: (supportCategory: SupportCategoryResponse) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onTranslations?: (supportCategory: SupportCategoryResponse) => void;
}

export default function SupportCategoryList({
    supportCategories,
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
    const t = useTranslations("supportCategory");

    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean, supportCategoryId: number, name: string }>({
            isOpen: false,
            supportCategoryId: 0,
            name: ""
        });
    
        const handleDeleteClick = (supportCategoryId: number, name: string) => {
            setConfirmDialog({ isOpen: true, supportCategoryId, name });
        }
    
        const handleConfirmDelete = () => {
            onDelete(confirmDialog.supportCategoryId);
            setConfirmDialog({ isOpen: false, supportCategoryId: 0, name: "" });
        }
    
        const handleCancelDelete = () => {
            setConfirmDialog({ isOpen: false, supportCategoryId: 0, name: "" });
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

            {supportCategories.length === 0 ? (
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
                        {supportCategories.map((supportCategory) => (
                            <tr key={supportCategory.supportCategoryId} className={tableStyles.rowHover}>
                                <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{supportCategory.supportCategoryId}</td>
                                <td className={tableStyles.cell}>{supportCategory.code}</td>
                                <td className={tableStyles.cell}>{supportCategory.name}</td>
                                <td className={tableStyles.cell}>{supportCategory.description}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                            {/* Menú de tres puntos con acciones de fila */}
                                            <MoreMenu
                                                items={[
                                                    {
                                                        label: common("edit"),
                                                        onClick: () => onEdit(supportCategory),
                                                    },
                                                    ...(onTranslations ? [{
                                                        label: common("translations"),
                                                        onClick: () => onTranslations(supportCategory),
                                                    }] : []),
                                                    {
                                                        label:
                                                            deletingId === supportCategory.supportCategoryId
                                                                ? common("deleting")
                                                                : common("delete"),
                                                        onClick: () => handleDeleteClick(supportCategory.supportCategoryId, supportCategory.code),
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
            {supportCategories.length > 0 && totalPages > 1 && (
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