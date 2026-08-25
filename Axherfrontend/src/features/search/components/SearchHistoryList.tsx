import { SearchHistoryResponse } from "@/entities/types";
import SearchHistoryItem from "@/features/search/components/SearchHistoryItem";
import styles from "./SearchHistoryList.module.css";
import { getDateGroup } from "@/shared/utils/date";
import { useState } from "react";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
    items: SearchHistoryResponse[];
    loading: boolean;
    deleting: number | null;
    clearing: boolean;
    onSelect: (term: string) => void;
    onRemove: (searchId: number) => void;
    onClear: () => Promise<void>;
}

export default function SearchHistoryList({
    items,
    loading,
    deleting,
    clearing,
    onSelect,
    onRemove,
    onClear,
}: Props) {

    const common = useTranslations("common");
    const t = useTranslations("search");
    
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleConfirmClear = async () => {
        try {
            await onClear();
            setConfirmOpen(false);
        } catch {
            // El hook ya maneja el error.
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                {t("history.loading")}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={styles.empty}>
                {t("history.empty")}
            </div>
        );
    }

    const groups = items.reduce<Record<string, SearchHistoryResponse[]>>(
        (acc, item) => {

            const group = getDateGroup(item.searchedAt);

            if (!acc[group]) {
                acc[group] = [];
            }

            acc[group].push(item);

            return acc;

        },
        {}
    );

    return (
        <>
            <ConfirmDialog
                isOpen={confirmOpen}
                title={t("history.deleteConfirmTitle")}
                message={t("history.deleteConfirmMessage")}
                confirmText={clearing ? t("history.clearing") : t("history.clear")}
                cancelText={common("cancel")}
                onConfirm={handleConfirmClear}
                onCancel={() => {
                    if (!clearing) {
                        setConfirmOpen(false);
                    }
                }}
                variant="danger"
            />

            <div className={styles.container}>

                <div className={styles.header}>

                    <div>

                        <p className={styles.subtitle}>
                            {t("history.subtitle")}
                        </p>
                    </div>

                    <button
                        type="button"
                        className={styles.clearButton}
                        onClick={() => setConfirmOpen(true)}
                        disabled={clearing}
                    >
                        <Trash2 size={17} />

                        <span>
                            {clearing
                                ? t("history.clearing")
                                : t("history.clear")
                            }
                        </span>
                    </button>

                </div>

                <div className={styles.list}>

                    {Object.entries(groups).map(
                        ([group, groupItems]) => (

                            <section
                                key={group}
                                className={styles.group}
                            >

                                <h3 className={styles.groupTitle}>
                                    {group}
                                </h3>

                                <div className={styles.groupItems}>

                                    {groupItems.map((item) => (
                                        <SearchHistoryItem
                                            key={item.searchId}
                                            item={item}
                                            onSelect={onSelect}
                                            onRemove={onRemove}
                                            deleting={deleting}
                                        />
                                    ))}

                                </div>

                            </section>

                        )
                    )}

                </div>

            </div>
        </>
    );
}