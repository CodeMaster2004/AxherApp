"use client";

import { PageSection } from "@/entities/types/pageSection.types";
import { useEffect, useState } from "react";
import layoutStyles from "@/shared/styles/shared/Layout.module.css";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import BubbleToggle from "@/shared/components/ui/BubbleToggle";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import styles from "@/features/pageSection/components/PageSectionList.module.css";
import SortableList from "@/shared/components/ui/SortableList";
import { useTranslations } from "next-intl";

interface Props {
    sections: PageSection[];

    onEdit: (section: PageSection) => void;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;

    onMove: (
        id: number,
        displayOrder: number
    ) => void;

    deletingId?: number | null;
    togglingId?: number | null;
    movingId?: number | null;

    loading?: boolean;
}

export default function PageSectionList({
    sections,

    onEdit,
    onDelete,
    onToggle,
    onMove,

    deletingId,
    togglingId,
    movingId,
    
    loading
}: Props) {

    const [items, setItems] = useState<PageSection[]>(sections);

    useEffect(() => {
        setItems(sections);
    }, [sections]);

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

    const common = useTranslations("common");
    const t = useTranslations("pageSections");

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
            <h2>{t("title")}</h2>
            {
                items.length === 0 ? (
                    <p>
                        {
                            loading
                                ? t("loading")
                                : t("empty")
                        }
                    </p>
                ):(
                    <div className={styles.list}>

                        <SortableList

                            items={items}
                            getId={item => item.pageSectionId}
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
                                            <h3>{item.type}</h3>
                                            <span className={styles.order}>#{index + 1}</span>
                                        </div>
                                        <div className={styles.meta}>
                                            <span>{t("form.page")} {item.page}</span>
                                            <span>{t("form.shelf")}: {item.contentShelfName ?? "-"}</span>
                                        </div>
                                    </div>
                                    <div className={styles.status}>
                                        <BubbleToggle
                                            checked={item.active}
                                            onChange={() =>
                                                onToggle(item.pageSectionId)
                                            }
                                            disabled={
                                                togglingId === item.pageSectionId
                                            }
                                        />
                                    </div>
                                    <div className={styles.actions}>
                                        <MoreMenu
                                            items={[
                                                {
                                                    label: common("edit"),
                                                    onClick: () => 
                                                        onEdit(item)
                                                },
                                                {
                                                    label: 
                                                        deletingId ===
                                                        item.pageSectionId
                                                            ? common("deleting")
                                                            : common("delete"),
                                                    variant: "danger",
                                                    onClick: () =>
                                                        handleDeleteClick(
                                                            item.pageSectionId,
                                                            `${item.page} - ${item.type}`
                                                        )
                                                }
                                            ]}
                                        />
                                    </div>
                                </div>
                            )}

                        />

                        

                    </div>
                )
            }

        </div>
    )

}