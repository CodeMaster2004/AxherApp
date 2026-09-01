"use client";

import { useTranslations } from "next-intl";

import styles from "./SupportFaqSearch.module.css";
import { Search, X } from "lucide-react";

interface Props {
    value: string;
    onChange: (value: string) => void;
}
export default function SupportFaqSearch({ value, onChange }: Props) {

    const t = useTranslations("supportFaq");

    return (
        <div className={styles.wrapper}>

            <Search
                className={styles.icon}
                size={20}
                aria-hidden="true"
            />

            <input
                type="text"
                className={styles.input}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t("public.searchPlaceholder")}
            />
            {value && (
                <button
                    type="button"
                    className={styles.clear}
                    onClick={() => onChange("")}
                    aria-label={t("public.clearSearch")}
                >
                    <X size={18} />
                </button>
            )}

        </div>
    );
}