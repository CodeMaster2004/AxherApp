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

    const common = useTranslations("common");
    const t = useTranslations("supportTicketStatus");

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
                {t("translations.empty")}
            </p>
        );

    }


    return (
        <>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={t("translations.deleteTitle")}
                message={t("translations.deleteMessage" , { name: confirmDialog.languageName })}
                confirmText={common("delete")}
                cancelText={common("cancel")}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                variant="danger"

            />


            <div className={tableStyles.tableWrap}>

                <table className={tableStyles.table}>

                    <thead>

                        <tr>

                            <th className={tableStyles.headCell}>
                                {common("language")}
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

                            <th className={tableStyles.actionsColumn}>
                                {common("actions")}
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
                                                    label: common("edit"),

                                                    onClick: () =>
                                                        onEdit(
                                                            translation
                                                        ),
                                                },

                                                {
                                                    label:
                                                        deleting ===
                                                        translation.languageId
                                                            ? common("deleting")
                                                            : common("delete"),

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