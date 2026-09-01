"use client";

import {
    SupportFaqTranslationResponse,
} from "@/entities/types/supportFaq.types";

import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";

import tableStyles from "@/shared/styles/shared/Table.module.css";

import { useTranslations } from "next-intl";
import { useState } from "react";

interface Props {
    translations: SupportFaqTranslationResponse[];
    deleting?: number | null;
    onDelete: (languageId: number) => void;
    onEdit: (
        translation: SupportFaqTranslationResponse
    ) => void;
    onTranslate: (translation: SupportFaqTranslationResponse) => void;
}

export default function SupportFaqTranslationList({
    translations,
    deleting,
    onDelete,
    onEdit,
    onTranslate,
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("supportFaq");

    const [
        confirmDialog,
        setConfirmDialog,
    ] = useState({
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
                title={t(
                    "translations.delete.title"
                )}
                message={t(
                    "translations.delete.message"
                )}
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
                            <th
                                className={
                                    tableStyles.headCell
                                }
                            >
                                {common("language")}
                            </th>

                            <th
                                className={
                                    tableStyles.headCell
                                }
                            >
                                {t(
                                    "translations.question"
                                )}
                            </th>

                            <th
                                className={
                                    tableStyles.headCell
                                }
                            >
                                {t(
                                    "translations.answer"
                                )}
                            </th>

                            <th
                                className={
                                    tableStyles.actionsColumn
                                }
                            >
                                {common("actions")}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {translations.map(
                            translation => (
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
                                            translation.question
                                        }
                                    </td>

                                    <td>
                                        {
                                            translation.answer
                                        }
                                    </td>

                                    <td>
                                        <MoreMenu
                                            items={[
                                                {
                                                    label:
                                                        common(
                                                            "edit"
                                                        ),
                                                    onClick:
                                                        () =>
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
                                                                translation.languageId,
                                                                translation.languageName
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
        </>
    );
}