"use client";

import { SupportTicketStatusTranslationResponse } from "@/entities/types";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useTranslations } from "next-intl";
import { useState } from "react";


interface Props {
    translations:
        SupportTicketStatusTranslationResponse[];
    deleting?: number | null;
    onDelete: (languageId: number) => void;
    onEdit: (
        translation: SupportTicketStatusTranslationResponse
    ) => void;
}


export default function SupportTicketStatusTranslationList({

    translations,
    deleting,
    onDelete,
    onEdit,

}: Props) {

    const t = useTranslations("common");

    const [confirmDialog, setConfirmDialog] =

        useState<{
            isOpen: boolean;
            languageId: number;
            languageName: string;

        }>({
            isOpen: false,
            languageId: 0,
            languageName: "",

        });


    const handleDeleteClick = (
        languageId: number,
        languageName: string

    ) => {

        setConfirmDialog({
            isOpen: true,
            languageId,
            languageName,

        });

    };


    const handleConfirmDelete = async () => {

        await onDelete(
            confirmDialog.languageId
        );
        setConfirmDialog({
            isOpen: false,
            languageId: 0,
            languageName: "",

        });

    };


    const handleCancelDelete = () => {
        setConfirmDialog({
            isOpen: false,
            languageId: 0,
            languageName: "",

        });

    };

    if (translations.length === 0) {

        return (
            <p>
                No hay traducciones registradas.
            </p>
        );

    }


    return (
        <>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Eliminar traducción"
                message={
                    `¿Estás seguro de que deseas eliminar la traducción en "${confirmDialog.languageName}"? Esta acción no se puede deshacer.`
                }
                confirmText={t("delete")}
                cancelText={t("cancel")}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"

            />


            <div className={tableStyles.tableWrap}>

                <table className={tableStyles.table}>

                    <thead>

                        <tr>

                            <th className={tableStyles.headCell}>
                                Idioma
                            </th>

                            <th className={tableStyles.headCell}>
                                Código
                            </th>

                            <th className={tableStyles.headCell}>
                                Nombre
                            </th>

                            <th className={tableStyles.headCell}>
                                Descripción
                            </th>

                            <th className={tableStyles.actionsColumn}>
                                Acciones
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {translations.map(
                            (translation) => (

                                <tr
                                    key={
                                        translation.languageId
                                    }
                                >

                                    <td>

                                        <strong>
                                            {
                                                translation.languageName
                                            }
                                        </strong>

                                    </td>


                                    <td>
                                        {
                                            translation.languageCode
                                        }
                                    </td>


                                    <td>
                                        {
                                            translation.name
                                        }
                                    </td>


                                    <td>
                                        {
                                            translation.description
                                                || "-"
                                        }
                                    </td>


                                    <td>

                                        <MoreMenu

                                            items={[

                                                {
                                                    label: t("edit"),

                                                    onClick: () =>
                                                        onEdit(
                                                            translation
                                                        ),
                                                },

                                                {
                                                    label:
                                                        deleting ===
                                                        translation.languageId
                                                            ? "Eliminando..."
                                                            : t("delete"),

                                                    onClick: () =>
                                                        handleDeleteClick(
                                                            translation.languageId,
                                                            translation.languageName
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

        </>

    );
}