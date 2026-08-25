import { ReportCategoryResponse } from "@/entities/types";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import { useTranslations } from "next-intl";

interface Props {
    reportCategories: ReportCategoryResponse[];
    onDelete: (reportCategoryId: number) => void;
    onEdit: (reportCategory: ReportCategoryResponse) => void;
    deletingId?: number | null;
    loading?: boolean;
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onTranslations?: (reportCategory: ReportCategoryResponse) => void;
}

export default function ReportCategoryList({
    reportCategories,
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
    const t = useTranslations("reportCategory");
    
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        reportCategoryId: number;
        name: string;
    }>({
        isOpen: false,
        reportCategoryId: 0,
        name: "",
    });

    const handleDeleteClick = (
        reportCategoryId: number,
        name: string
    ) => {
        setConfirmDialog({
            isOpen: true,
            reportCategoryId,
            name,
        });
    };

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.reportCategoryId);

        setConfirmDialog({
            isOpen: false,
            reportCategoryId: 0,
            name: "",
        });
    };

    const handleCancelDelete = () => {
        setConfirmDialog({
            isOpen: false,
            reportCategoryId: 0,
            name: "",
        });
    };
    

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

            {reportCategories.length === 0 ? (

                <p>
                    {loading
                        ? common("loading")
                        : t("list.empty")
                    }
                </p>

            ) : (

                <div
                    className={`${tableStyles.tableWrap} ${
                        loading ? tableStyles.loading : ""
                    }`}
                >
                    <table className={tableStyles.table}>

                        <thead>
                            <tr className={tableStyles.rowHover}>

                                <th
                                    className={`${tableStyles.headCell} ${tableStyles.idColumn}`}
                                >
                                    {common("id")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {t("list.code")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {common("name")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {common("description")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {common("actions")}
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {reportCategories.map((reportCategory) => (

                                <tr
                                    key={reportCategory.reportCategoryId}
                                    className={tableStyles.rowHover}
                                >

                                    <td
                                        className={`${tableStyles.cell} ${tableStyles.idColumn}`}
                                    >
                                        {reportCategory.reportCategoryId}
                                    </td>

                                    <td className={tableStyles.cell}>
                                        {reportCategory.code}
                                    </td>

                                    <td className={tableStyles.cell}>
                                        {reportCategory.name}
                                    </td>

                                    <td className={tableStyles.cell}>
                                        {reportCategory.description}
                                    </td>

                                    <td
                                        className={`${tableStyles.cell} ${tableStyles.actions}`}
                                    >

                                        <MoreMenu
                                            items={[
                                                {
                                                    label: common("edit"),
                                                    onClick: () =>
                                                        onEdit(reportCategory),
                                                },
                                                ...(onTranslations ? [{
                                                    label: common("translations"),
                                                    onClick: () => onTranslations(reportCategory),
                                                }] : []),
                                                {
                                                    label:
                                                        deletingId ===
                                                        reportCategory.reportCategoryId
                                                            ? common("deleting")
                                                            : common("delete"),

                                                    onClick: () =>
                                                        handleDeleteClick(
                                                            reportCategory.reportCategoryId,
                                                            reportCategory.code
                                                        ),

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

            {reportCategories.length > 0 && totalPages > 1 && (

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