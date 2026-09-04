"use client";

import { ContentPersonRoleResponse } from "@/entities/types";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import SortableList from "@/shared/components/ui/SortableList";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import styles from "./ContentPersonRoleList.module.css";

interface Props {
    contentPersonRoles: ContentPersonRoleResponse[];
    onEdit: ( contentPersonRole: ContentPersonRoleResponse ) => void;
    onDelete: ( contentPersonRoleId: number ) => void;
    onMove: ( contentPersonRoleId: number, orderIndex: number ) => void;
    deletingId?: number | null;
    movingId?: number | null;
    loading?: boolean;
}

export default function ContentPersonRoleList({
    contentPersonRoles,
    onEdit,
    onDelete,
    onMove,
    deletingId,
    movingId,
    loading,
}: Props) {
    const common = useTranslations("common");
    const t = useTranslations("contentPersonRole");

    const [items, setItems] = useState< ContentPersonRoleResponse[] >(contentPersonRoles);

    useEffect(() => {
        setItems(contentPersonRoles);
    }, [contentPersonRoles]);

    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        id: number;
        personName: string;
    }>({
        isOpen: false,
        id: 0,
        personName: "",
    });

    const handleDeleteClick = (
        id: number,
        personName: string
    ) => {
        setConfirmDialog({
            isOpen: true,
            id,
            personName,
        });
    };

    const handleConfirmDelete = () => {
        onDelete(confirmDialog.id);

        setConfirmDialog({
            isOpen: false,
            id: 0,
            personName: "",
        });
    };

    const handleCancelDelete = () => {
        setConfirmDialog({
            isOpen: false,
            id: 0,
            personName: "",
        });
    };

    return (
        <div className={styles.list}>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={t("delete.title")}
                message={t("delete.message", {
                    name: confirmDialog.personName,
                })}
                confirmText={common("delete")}
                cancelText={common("cancel")}
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

            {items.length === 0 ? (
                <p>
                    {loading
                        ? t("loading")
                        : t("empty")}
                </p>
            ) : (
                <SortableList
                    items={items}
                    getId={(item) =>
                        item.contentPersonRoleId
                    }
                    onChange={setItems}
                    onMove={onMove}
                    renderItem={(
                        item,
                        index,
                        dragHandle
                    ) => (
                        <div className={styles.item}>
                            <div className={styles.handle}>
                                {dragHandle}
                            </div>

                            <div className={styles.info}>
                                <div className={styles.titleRow}>
                                    <h3>
                                        {item.personName}
                                    </h3>

                                    <span
                                        className={
                                            styles.order
                                        }
                                    >
                                        #{index + 1}
                                    </span>
                                </div>

                                <div className={styles.meta}>
                                    <span>
                                        {
                                            item.cinematicRoleName
                                        }
                                    </span>

                                    <span>
                                        {item.characterName ||
                                            "-"}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <MoreMenu
                                    items={[
                                        {
                                            label:
                                                common("edit"),
                                            onClick: () =>
                                                onEdit(item),
                                        },
                                        {
                                            label:
                                                deletingId ===
                                                item.contentPersonRoleId
                                                    ? common(
                                                          "deleting"
                                                      )
                                                    : common(
                                                          "delete"
                                                      ),
                                            variant: "danger",
                                            onClick: () =>
                                                handleDeleteClick(
                                                    item.contentPersonRoleId,
                                                    item.personName
                                                ),
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                    )}
                />
            )}
        </div>
    );
}