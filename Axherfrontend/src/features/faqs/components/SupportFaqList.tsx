"use client";

import { SupportFaqFilters, SupportFaqResponse } from "@/entities/types/supportFaq.types";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import layoutStyles from "@/shared/styles/shared/Layout.module.css"; 
import tableStyles from "@/shared/styles/shared/Table.module.css";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import styles from "@/features/faqs/components/SupportFaqList.module.css";
import SortableList from "@/shared/components/ui/SortableList";
import BubbleToggle from "@/shared/components/ui/BubbleToggle";
import MoreMenu from "@/shared/components/ui/MoreMenu";
import Pagination from "@/shared/components/ui/Pagination";

interface Props {
    faqs: SupportFaqResponse[];
    categories: { supportCategoryId: number; name: string }[];
    onEdit: (faq: SupportFaqResponse) => void;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
    onMove: (id: number, displayOrder: number) => void;

    onTranslations?: (faq: SupportFaqResponse) => void;

    deletingId?: number | null;
    togglingId?: number | null;
    movingId?: number | null;
    loading?: boolean;
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPrevPage: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;

    filters: SupportFaqFilters;
    onFiltersChange: (filters: SupportFaqFilters) => void;
}

export default function SupportFaqList({
    faqs,
    categories,
    onEdit,
    onDelete,
    onToggle,
    onMove,

    onTranslations,

    deletingId,
    togglingId,
    movingId,
    loading,
    currentPage,
    totalPages,
    onNextPage,
    onPrevPage,
    searchTerm,
    onSearchChange,
    
    filters,
    onFiltersChange,
}: Props) {

    const [items, setItems] = useState<SupportFaqResponse[]>(faqs);

    useEffect(() => {
        setItems(faqs);
    }, [faqs]);


    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        id: 0,
        title: "",
    });

    const handleFilterChange = (
        key: keyof SupportFaqFilters,
        value: string
    ) => {
        onFiltersChange({
            ...filters,
            [key]:
                value === ""
                    ? undefined
                    : key === "supportCategoryId"
                        ? Number(value)
                        : key === "active"
                            ? value === "true"
                            : value,
        });
    };

    const handleDeleteClick = (
        id: number,
        title: string
    ) => {
        setConfirmDialog({
            isOpen: true,
            id,
            title,
        })
    }

    const handleConfirmDelete = () => {

        onDelete(confirmDialog.id);
        setConfirmDialog({
            isOpen: false,
            id: 0,
            title: "",
        })
    }

    const common = useTranslations("common");
    const t = useTranslations("supportFaq");

    return (

        <div className={layoutStyles.section}>
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={t("delete.title")}
                message={t("delete.message", {
                    title: confirmDialog.title,
                })}
                confirmText={common("delete")}
                cancelText={common("cancel")}
                variant="danger"
                onConfirm={handleConfirmDelete}
                onCancel={() =>
                    setConfirmDialog({
                        isOpen: false,
                        id: 0,
                        title: "",
                    })
                }
            />

            <div>
                <input
                    type="text"
                    placeholder={t("search.placeholder")}
                    value={filters.search ?? ""}
                    onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                    }
                    className={tableStyles.searchInput}
                />
            </div>

            <div className={tableStyles.filters}>

                <select
                    value={filters.supportCategoryId ?? ""}
                    onChange={(e) =>
                        handleFilterChange(
                            "supportCategoryId",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        {t("filters.allCategories")}
                    </option>

                    {categories.map(category => (
                        <option
                            key={category.supportCategoryId}
                            value={category.supportCategoryId}
                        >
                            {category.name}
                        </option>
                    ))}

                </select>

                <select 
                    value={filters.active === undefined
                        ? ""
                        : String(filters.active)
                    }
                    onChange={(e) =>
                        handleFilterChange(
                            "active",
                            e.target.value
                        )
                    }
                >
                    <option value="">
                        {t("filters.allStatuses")}
                    </option>
                    <option value="true">
                        {common("active")}
                    </option>
                    <option value="false">
                        {common("inactive")}
                    </option>
                </select>
            </div>

            {
                items.length === 0 ? (
                    <p>
                        {
                            loading
                                ? t("list.loading")
                                : t("list.empty")
                        }
                    </p>
                ): (

                    <div className={styles.list}>

                        <SortableList
                        
                            items={items}
                            getId={item =>
                                item.supportFaqId
                            }
                            onChange={setItems}
                            onMove={onMove}

                            renderItem={(
                                item,
                                index,
                                dragHandle
                            ) => (
                                <div className={styles.item}>

                                    <div className={styles.dragHandle}>{dragHandle}</div>

                                    <div className={styles.info}>
                                        <div className={styles.titleRow}>

                                            <h3>{item.question}</h3>
                                            <span className={styles.order}>
                                                #{index + 1}
                                            </span>
                                        </div>
                                        <div
                                            className={styles.meta}
                                        >
                                            <span>
                                                {
                                                    t("list.category")
                                                }
                                                :{" "}
                                                {
                                                    categories.find(
                                                        category =>
                                                            category.supportCategoryId ===
                                                            item.supportCategoryId
                                                    )?.name
                                                    ?? "-"
                                                }
                                            </span>

                                            <span>
                                                {
                                                    t("list.language")
                                                }
                                                :{" "}
                                                {
                                                    item.languageId
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.status}>

                                        <BubbleToggle
                                            checked={item.active}
                                            onChange={() =>
                                                onToggle(item.supportFaqId)
                                            }
                                            disabled={
                                                togglingId ===
                                                item.supportFaqId
                                            }
                                        />
                                    </div>

                                    <div className={styles.actions}>

                                        <MoreMenu
                                            items={[
                                                {
                                                    label: common("edit"),
                                                    onClick: () =>
                                                        onEdit(item),
                                                },
                                                ...onTranslations
                                                    ? [
                                                        {
                                                            label: common("translations"),
                                                            onClick: () =>
                                                                onTranslations?.(
                                                                    item
                                                                ),
                                                        },
                                                    ]
                                                    : [],
                                                {
                                                    label: deletingId === item.supportFaqId
                                                        ? common("deleting")
                                                        : common("delete"),
                                                    variant: "danger",
                                                    onClick: () =>
                                                        handleDeleteClick(
                                                            item.supportFaqId,
                                                            item.question
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

            {
                items.length > 0 && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNextPage={onNextPage}
                        onPrevPage={onPrevPage}
                    />
                )
            }
            
        </div>
    )
}