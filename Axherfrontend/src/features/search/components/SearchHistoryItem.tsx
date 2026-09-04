import { SearchHistoryResponse } from "@/entities/types";
import { Search, X } from "lucide-react";
import styles from "./SearchHistoryItem.module.css"
import { formatTime } from "@/shared/utils/date";
import { useLocale, useTranslations } from "next-intl";

interface Props {
    item: SearchHistoryResponse;
    onSelect: (term: string) => void;
    onRemove: (searchId: number) => void;
    deleting: number | null;
}

export default function SearchHistoryItem({
    item,
    onSelect,
    onRemove,
    deleting,
}: Props){

    const t = useTranslations("search");
    const isDeleting = deleting === item.searchId;
    const locale = useLocale();
    
    return (
        <article
            className={styles.item}
            onClick={() => onSelect(item.term)}
        >
            <div className={styles.icon}>
                <Search/>
            </div>

            <div className={styles.content}>
                <span className={styles.term}>
                    {item.term}
                </span>
                <span className={styles.time}>
                    {formatTime(item.searchedAt, locale)}
                </span>
            </div>
            <button
                type="button"
                className={styles.remove}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.searchId);
                }}
                disabled={isDeleting}
                aria-label={t("delete", {
                    term: item.term,
                })}
            >
                {isDeleting ? (
                    <span className={styles.loading}>...</span>
                ) : (
                    <X size={17} strokeWidth={1.8} />
                )}
            </button>
        </article>
    )
}