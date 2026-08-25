import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useState } from "react";
import ConfirmDialog from "../../../shared/components/ui/ConfirmDialog";
import { ContentStatusResponse } from "@/entities/types/status.types";
import { useTranslations } from "next-intl";

interface Props {
    contentStatus: ContentStatusResponse[];
    onDelete: (id: number) => void;
    onEdit: (contentStatus: ContentStatusResponse) => void;
    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onTranslations?: (contentStatus: ContentStatusResponse) => void;
}

export default function ContentStatusList ({contentStatus, onDelete, onEdit, deletingId, loading, currentPage, totalPages, onNextPage, onPrevPage, searchTerm, onSearchChange, onTranslations} : Props){

    const [confirmDialog, setConfirmDialog] = useState<{isOpen: boolean; id: number; name: string}>({
        isOpen: false,
        id: 0,
        name: "",
    });

    const handleDeleteClick = (id: number, name: string) => {
        setConfirmDialog({isOpen: true, id, name});
    };

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);
        setConfirmDialog({isOpen: false, id: 0, name: ""});
    };

    const handleCancelDelete = () => {
        setConfirmDialog({isOpen: false, id: 0, name: ""});
    };

    const common = useTranslations("common");
    const t = useTranslations("contentStatus");

    return(
        <div className={layoutStyles.section}>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={t("delete.title")}
                message={t("delete.message", {name: confirmDialog.name})}
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

            {contentStatus.length === 0 ? (
                <p>{loading ? common("searching") : t("list.empty")}</p>

            ) : (
                <div className={`${tableStyles.tableWrap} ${loading ? tableStyles.loading : ""}`}>
                  <table className={tableStyles.table}>
                    <thead>
                        <tr className={tableStyles.rowHover}>
                            <th className={`${tableStyles.headCell} ${tableStyles.idColumn}`}>ID</th>
                            <th className={tableStyles.headCell}>{t("list.code")}</th>
                            <th className={tableStyles.headCell}>{common("name")}</th>
                            <th className={tableStyles.headCell}>{common("description")}</th>
                            <th className={tableStyles.headCell}>{common("actions")}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {contentStatus.map((contentStatus) => (
                            <tr key={contentStatus.contentStatusId} className={tableStyles.rowHover}>
                                <td className={`${tableStyles.cell} ${tableStyles.idColumn}`}>{contentStatus.contentStatusId}</td>
                                <td className={tableStyles.cell}>{contentStatus.code}</td>
                                <td className={tableStyles.cell}>{contentStatus.name}</td>
                                <td className={tableStyles.cell}>{contentStatus.description}</td>
                                    <td className={`${tableStyles.cell} ${tableStyles.actions}`}>
                                            {/* Menú de tres puntos con acciones de fila */}
                                            <MoreMenu
                                                items={[
                                                    {
                                                        label: common("edit"),
                                                        onClick: () => onEdit(contentStatus),
                                                    },
                                                    ...(onTranslations ? [{
                                                        label: t("translations.title"),
                                                        onClick: () => onTranslations(contentStatus),
                                                    }]: []),
                                                    {
                                                        label:
                                                            deletingId === contentStatus.contentStatusId
                                                                ? common("deleting")
                                                                : common("delete"),
                                                        onClick: () => handleDeleteClick(contentStatus.contentStatusId, contentStatus.code),
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
                {contentStatus.length > 0 && totalPages > 1 && (
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