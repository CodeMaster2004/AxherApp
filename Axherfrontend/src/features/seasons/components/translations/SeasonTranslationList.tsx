"use client";

import { SeasonTranslation } from "@/entities/types";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Props {
    translations: SeasonTranslation[];
    deleting?: number | null;
    onDelete: (languageId: number) => void;
    onEdit: (translation: SeasonTranslation) => void;
    onTranslate: (translation: SeasonTranslation) => void;
}

export default function SeasonTranslationList({
    translations,
    deleting,
    onDelete,
    onEdit,
    onTranslate,
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("seasons");
    
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
                message={t("translations.deleteMessage", { language: confirmDialog.languageName })}
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
                                {t("translations.code")}
                            </th>

                            <th className={tableStyles.headCell}>
                                {common("title")}
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
                                            translation.title
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
                                                    label: common("translateWithAi"),
                                                    onClick: () => onTranslate(translation),
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