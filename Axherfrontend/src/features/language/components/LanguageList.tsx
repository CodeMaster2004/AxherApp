"use client";

import { LanguageResponse } from "@/entities/types";
import { useState } from "react";

import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";

import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import { useTranslations } from "next-intl";

interface Props {
    languages: LanguageResponse[];

    onDelete: (languageId: number) => void;
    onEdit: (language: LanguageResponse) => void;

    deletingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;

    onNextPage: () => void;
    onPrevPage: () => void;

    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function LanguageList({
    languages,
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
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("language");

    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        languageId: number;
        name: string;
    }>({
        isOpen: false,
        languageId: 0,
        name: "",
    });

    const handleDeleteClick = (
        languageId: number,
        name: string
    ) => {
        setConfirmDialog({
            isOpen: true,
            languageId,
            name,
        });
    };

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.languageId);

        setConfirmDialog({
            isOpen: false,
            languageId: 0,
            name: "",
        });
    };

    const handleCancelDelete = () => {
        setConfirmDialog({
            isOpen: false,
            languageId: 0,
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
                    onChange={(e) =>
                        onSearchChange(e.target.value)
                    }
                    className={tableStyles.searchInput}
                />
            </div>

            {languages.length === 0 ? (
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
                                    {t("form.code")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {common("name")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {t("form.nativeName")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {common("status")}
                                </th>

                                <th className={tableStyles.headCell}>
                                    {common("actions")}
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {languages.map((language) => (

                                <tr
                                    key={language.languageId}
                                    className={tableStyles.rowHover}
                                >

                                    <td
                                        className={`${tableStyles.cell} ${tableStyles.idColumn}`}
                                    >
                                        {language.languageId}
                                    </td>

                                    <td className={tableStyles.cell}>
                                        {language.code}
                                    </td>

                                    <td className={tableStyles.cell}>
                                        {language.name}
                                    </td>

                                    <td className={tableStyles.cell}>
                                        {language.nativeName}
                                    </td>

                                    <td className={tableStyles.cell}>
                                        {language.active
                                            ? common("active")
                                            : common("inactive")}
                                    </td>

                                    <td
                                        className={`${tableStyles.cell} ${tableStyles.actions}`}
                                    >
                                        <MoreMenu
                                            items={[
                                                {
                                                    label: common("edit"),
                                                    onClick: () =>
                                                        onEdit(language),
                                                },
                                                {
                                                    label:
                                                        deletingId ===
                                                        language.languageId
                                                            ? common("deleting")
                                                            : common("delete"),

                                                    onClick: () =>
                                                        handleDeleteClick(
                                                            language.languageId,
                                                            language.name
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

            {languages.length > 0 && totalPages > 1 && (
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
