"use client";

import { CinematicRoleResponse } from "@/entities/types";

import { useState } from "react";

import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";

import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";

import { useTranslations } from "next-intl";

interface Props {
    cinematicRoles: CinematicRoleResponse[];
    onDelete: (cinematicRoleId: number) => void;
    onEdit: (cinematicRole: CinematicRoleResponse) => void;
    deletingId?: number | null;
    loading?: boolean;
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onTranslations?: (
        cinematicRole: CinematicRoleResponse
    ) => void;
}

export default function CinematicRoleList({
    cinematicRoles,
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
    const t = useTranslations("cinematicRole");

    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        cinematicRoleId: number;
        name: string;
    }>({
        isOpen: false,
        cinematicRoleId: 0,
        name: "",
    });

    const handleDeleteClick = (
        cinematicRoleId: number,
        name: string
    ) => {

        setConfirmDialog({
            isOpen: true,
            cinematicRoleId,
            name,
        });
    };

    const handleConfirmDelete = () => {

        onDelete(confirmDialog.cinematicRoleId);

        setConfirmDialog({
            isOpen: false,
            cinematicRoleId: 0,
            name: "",
        });
    };

    const handleCancelDelete = () => {

        setConfirmDialog({
            isOpen: false,
            cinematicRoleId: 0,
            name: "",
        });
    };

    return (
        <div className={layoutStyles.section}>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={t("delete.title")}
                message={t("delete.message", {
                    name: confirmDialog.name,
                })}
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

            {cinematicRoles.length === 0 ? (

                <p>
                    {loading
                        ? common("loading")
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

                            {cinematicRoles.map(
                                (cinematicRole) => (

                                    <tr
                                        key={
                                            cinematicRole.cinematicRoleId
                                        }
                                        className={
                                            tableStyles.rowHover
                                        }
                                    >

                                        <td
                                            className={`${tableStyles.cell} ${tableStyles.idColumn}`}
                                        >
                                            {
                                                cinematicRole.cinematicRoleId
                                            }
                                        </td>

                                        <td
                                            className={
                                                tableStyles.cell
                                            }
                                        >
                                            {cinematicRole.code}
                                        </td>

                                        <td
                                            className={
                                                tableStyles.cell
                                            }
                                        >
                                            {cinematicRole.name}
                                        </td>

                                        <td
                                            className={
                                                tableStyles.cell
                                            }
                                        >
                                            {
                                                cinematicRole.description
                                            }
                                        </td>

                                        <td
                                            className={`${tableStyles.cell} ${tableStyles.actions}`}
                                        >

                                            <MoreMenu
                                                items={[
                                                    {
                                                        label: common("edit"),
                                                        onClick: () =>
                                                            onEdit(
                                                                cinematicRole
                                                            ),
                                                    },

                                                    ...(onTranslations
                                                        ? [{
                                                            label: common(
                                                                "translations"
                                                            ),
                                                            onClick: () =>
                                                                onTranslations(
                                                                    cinematicRole
                                                                ),
                                                        }]
                                                        : []),

                                                    {
                                                        label:
                                                            deletingId ===
                                                            cinematicRole.cinematicRoleId
                                                                ? common(
                                                                    "deleting"
                                                                )
                                                                : common(
                                                                    "delete"
                                                                ),

                                                        onClick: () =>
                                                            handleDeleteClick(
                                                                cinematicRole.cinematicRoleId,
                                                                cinematicRole.code
                                                            ),

                                                        variant: "danger",
                                                    },
                                                ]}
                                            />

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>
            )}

            {cinematicRoles.length > 0 &&
                totalPages > 1 && (

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