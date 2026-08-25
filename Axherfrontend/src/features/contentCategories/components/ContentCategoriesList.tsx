// src/components/CategoriasList.tsx
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import { ContentCategoryResponse } from "@/entities/types";
import { useTranslations } from "next-intl";

interface Props {
    contentCategories: ContentCategoryResponse[];
    onDelete: (id: number) => void;
    onEdit: (contentCategories: ContentCategoryResponse) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onTranslations?: (contentCategories: ContentCategoryResponse) => void;
}

export default function ContentCategoriesList({ contentCategories, onDelete, onEdit, deletingId, loading, currentPage, totalPages, onNextPage, onPrevPage, searchTerm, onSearchChange, onTranslations }: Props) {
    const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; id: number; name: string }>({
        isOpen: false,
        id: 0,
        name: "",
    });

    const handleDeleteClick = (id: number, name: string) => {
        setConfirmDialog({ isOpen: true, id, name });
    };

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);
        setConfirmDialog({ isOpen: false, id: 0, name: "" });
    };

    const handleCancelDelete = () => {
        setConfirmDialog({ isOpen: false, id: 0, name: "" });
    };
    const common = useTranslations("common");
    const t = useTranslations("contentCategories");
    
  

    return (
        <div className={layoutStyles.section}>
        <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            title={t("delete.title")}
            message={t("delete.message", { name: confirmDialog.name, })}
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
        
        {contentCategories.length === 0 ? (
            <p>{loading ? common("searching") : t("list.empty")}</p>
        ) : (
            <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
            <table className={tableStyles.table}>
                <thead>
                <tr className={tableStyles.rowHover}>
                    <th className={`${tableStyles.headCell} ${tableStyles.idColumn}`}>{common("id")}</th>
                    <th className={tableStyles.headCell}>{common("name")}</th>
                    <th className={tableStyles.headCell}>{t("list.slug")}</th>
                    <th className={tableStyles.headCell}>{common("description")}</th>
                    <th className={tableStyles.headCell}>{common("actions")}</th>
                </tr>
                </thead>
                <tbody>
                {contentCategories.map((contentCategories) => (
                    
                    <tr key={contentCategories.contentCategoryId} className={tableStyles.rowHover}>
                    <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{contentCategories.contentCategoryId}</td>
                    <td className={tableStyles.cell}>{contentCategories.name}</td>
                    <td className={tableStyles.cell}>{contentCategories.slug}</td>
                    <td className={tableStyles.cell}>{contentCategories.description}</td>
                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                        {/* Menú de tres puntos con opciones de fila */}
                        <MoreMenu
                        items={[
                            {
                            label: common("edit"),
                            onClick: () => onEdit(contentCategories),
                            },
                            ...(onTranslations ? [{
                                label: t("actions.translations"),
                                onClick: () => onTranslations(contentCategories),
                            }]: []),
                            {
                            label:
                                deletingId === contentCategories.contentCategoryId
                                ? common("deleting")
                                : common("delete"),
                            onClick: () => handleDeleteClick(contentCategories.contentCategoryId, contentCategories.name),
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
        {contentCategories.length > 0 && totalPages > 1 && (
            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNextPage={onNextPage}
            onPrevPage={onPrevPage}
            />
        )}
        </div>
    );
}

