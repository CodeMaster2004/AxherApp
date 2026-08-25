"use client";

import { ContentShelf } from "@/entities/types";
import { useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { shelfLayoutOptions, shelfSourceOptions, shelfTargetOptions } from "@/shared/constants/selectOptions";
import BubbleToggle from "@/shared/components/ui/BubbleToggle";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";
import { useTranslations } from "next-intl";

interface Props {

    shelves: ContentShelf[];

    onEdit: (shelf: ContentShelf) => void;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;

    onManageContents: (shelf: ContentShelf) => void;

    deletingId?: number | null;
    togglingId?: number | null;
    loading?: boolean;

    currentPage: number;
    totalPages: number;

    onNextPage: () => void;
    onPrevPage: () => void;

    searchTerm: string;
    onSearchChange: (value: string) => void;
    onTranslations: (shelf: ContentShelf) => void;
}

export default function ShelfList({
    shelves,

    onEdit,
    onDelete,
    onToggle,

    onManageContents,

    deletingId,
    togglingId,
    loading,

    currentPage,
    totalPages,

    onNextPage,
    onPrevPage,

    searchTerm,
    onSearchChange,
    onTranslations
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("shelves");

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        id: 0,
        title: ""
    });

    const handleDeleteClick = (
        id: number,
        title: string
    ) => {

        setConfirmDialog({
            isOpen: true,
            id,
            title
        });

    };

    const handleConfirmDelete = () => {

        onDelete(confirmDialog.id);

        setConfirmDialog({
            isOpen: false,
            id: 0,
            title: ""
        });

    };

    return (

        <div className={layoutStyles.section}>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={t("delete.title")}
                message={t("delete.message", { title: confirmDialog.title })}
                confirmText={common("delete")}
                cancelText={common("cancel")}
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() =>
                    setConfirmDialog({
                        isOpen: false,
                        id: 0,
                        title: ""
                    })
                }
            />

            <h2>Lista de Carruseles</h2>

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

            {
                shelves.length === 0 ? (

                    <p>
                        {
                            loading
                                ? t("list.loading")
                                : t("list.empty")
                        }
                    </p>

                ) : (

                    <div className={tableStyles.tableWrap}>

                        <table className={tableStyles.table}>

                            <thead>

                                <tr>

                                    <th className={`${tableStyles.headCell} ${tableStyles.idColum}`}>ID</th>
                                    <th className={tableStyles.headCell}>{common("id")}</th>
                                    <th className={tableStyles.headCell}>{t("list.slug")}</th>
                                    <th className={tableStyles.headCell}>{t("list.target")}</th>
                                    <th className={tableStyles.headCell}>{t("list.layout")}</th>
                                    <th className={tableStyles.headCell}>{t("list.source")}</th>
                                    <th className={tableStyles.headCell}>{t("list.status")}</th>
                                    <th className={tableStyles.actionsColumn}>{common("actions")}</th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    shelves.map((shelf) => (

                                        <tr key={shelf.contentShelfId}>

                                            <td>{shelf.contentShelfId}</td>

                                            <td>{shelf.name}</td>

                                            <td>{shelf.slug}</td>

                                            <td>
                                                {
                                                    shelfTargetOptions.find(
                                                        option =>
                                                            option.value === shelf.target
                                                    )?.label
                                                }
                                            </td>

                                            <td>
                                                {
                                                    shelfLayoutOptions.find(
                                                        option =>
                                                            option.value === shelf.layout
                                                    )?.label
                                                }
                                            </td>

                                            <td>
                                                {
                                                    shelfSourceOptions.find(
                                                        option =>
                                                            option.value === shelf.source
                                                    )?.label
                                                }
                                            </td>

                                            <td>

                                                <BubbleToggle
                                                    checked={shelf.active}
                                                    onChange={() =>
                                                        onToggle(shelf.contentShelfId)
                                                    }
                                                    disabled={
                                                        togglingId ===
                                                        shelf.contentShelfId
                                                    }
                                                />

                                            </td>

                                            <td>

                                                <MoreMenu
                                                    items={[
                                                        {
                                                            label:t("manageContent"),
                                                            onClick:()=>onManageContents(shelf)
                                                        },
                                                        {
                                                            label: common("edit"),
                                                            onClick: () =>
                                                                onEdit(shelf)
                                                        },
                                                        ...(onTranslations ? [{
                                                            label: common("translations"),
                                                            onClick: () =>
                                                                onTranslations(shelf)
                                                        }] : []),
                                                        {
                                                            label:
                                                                deletingId ===
                                                                shelf.contentShelfId
                                                                    ? common("deleting")
                                                                    : common("delete"),

                                                            variant: "danger",

                                                            onClick: () =>
                                                                handleDeleteClick(
                                                                    shelf.contentShelfId,
                                                                    shelf.name
                                                                )
                                                        }
                                                    ]}
                                                />

                                            </td>

                                        </tr>

                                    ))
                                }

                            </tbody>

                        </table>

                    </div>

                )
            }

            {
                shelves.length > 0 &&
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

    );

}