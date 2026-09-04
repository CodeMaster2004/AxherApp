"use client";

import { PersonResponse } from "@/entities/types";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";

interface Props {
    people: PersonResponse[];
    onEdit: (person: PersonResponse) => void;
    onDelete: (id: number) => void;
    deletingId?: number | null;
    loading?: boolean;
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export default function PersonList({
    people,
    onEdit,
    onDelete,
    deletingId,
    loading,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    searchTerm,
    onSearchChange,
}: Props) {

    const [
        confirmDialog,
        setConfirmDialog,
    ] = useState({
        isOpen: false,
        id: 0,
        name: "",
    });

    const common = useTranslations("common");
    const t = useTranslations("person");

    const handleDeleteClick = (
        id: number,
        name: string
    ) => {

        setConfirmDialog({
            isOpen: true,
            id,
            name,
        });
    };

    const handleConfirmDelete = () => {

        onDelete(
            confirmDialog.id
        );

        setConfirmDialog({
            isOpen: false,
            id: 0,
            name: "",
        });
    };

    return (
        <div className={layoutStyles.section}>

            <ConfirmDialog
                isOpen={
                    confirmDialog.isOpen
                }
                title={t("delete.title")}
                message={t( "delete.message", { name: confirmDialog.name, } )}
                confirmText={common("delete")}
                cancelText={common("cancel")}
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() =>
                    setConfirmDialog({
                        isOpen: false,
                        id: 0,
                        name: "",
                    })
                }
            />

            <div
                className={tableStyles.searchBox}
            >
                <input
                    type="text"
                    placeholder={t("list.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) =>
                        onSearchChange(
                            e.target.value
                        )
                    }
                    className={
                        tableStyles.searchInput
                    }
                />
            </div>

            {people.length === 0 ? (

                <p>
                    {loading
                        ? t("list.loading")
                        : t("list.empty")}
                </p>

            ) : (

                <div className={ tableStyles.tableWrap } >
                    <table className={ tableStyles.table } >

                        <thead>
                            <tr>

                                <th className={`${tableStyles.headCell} ${tableStyles.idColum}`} > {common("id")} </th>
                                <th className={tableStyles.headCell} > {t("list.photo")} </th>
                                <th className={tableStyles.headCell} > {t("list.firstName")} </th>
                                <th className={tableStyles.headCell} > {t("list.lastName")} </th>
                                <th className={ tableStyles.actionsColumn } > {common("actions")} </th>
                            </tr>
                        </thead>

                        <tbody>

                            {people.map(
                                (person) => (

                                    <tr key={person.personId}>

                                        <td> { person.personId } </td>

                                        <td>

                                            {person.photo ? (

                                                <Image
                                                    src={
                                                        person.photo
                                                    }
                                                    alt={
                                                        `${person.firstName} ${person.lastName ?? ""}`
                                                    }
                                                    width={60}
                                                    height={60}
                                                    style={{
                                                        objectFit:
                                                            "cover",
                                                        borderRadius:
                                                            "50%",
                                                    }}
                                                />

                                            ) : (
                                                "-"
                                            )}

                                        </td>

                                        <td> <strong> { person.firstName } </strong> </td>
                                        <td> { person.lastName || "-" } </td>
                                        <td>

                                            <MoreMenu
                                                items={[
                                                    {
                                                        label:
                                                            common("edit"),
                                                        onClick:
                                                            () =>
                                                                onEdit(person),
                                                    },
                                                    {
                                                        label:
                                                            deletingId ===
                                                            person.personId
                                                                ? common(
                                                                    "deleting"
                                                                )
                                                                : common(
                                                                    "delete"
                                                                ),
                                                        variant:
                                                            "danger",
                                                        onClick:
                                                            () =>
                                                                handleDeleteClick(
                                                                    person.personId,
                                                                    `${person.firstName} ${person.lastName ?? ""}`.trim()
                                                                ),
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

            {people.length > 0 && totalPages > 1 && (

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