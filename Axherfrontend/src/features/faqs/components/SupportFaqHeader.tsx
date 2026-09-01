"use client";

import { useTranslations } from "next-intl";

import styles from "./SupportFaqHeader.module.css";

export default function SupportFaqHeader() {

    const t = useTranslations("supportFaq");

    return (
        <header className={styles.header}>

            <span className={styles.eyebrow}>
                {t("public.eyebrow")}
            </span>

            <h1 className={styles.title}>
                {t("public.title")}
            </h1>

            <p className={styles.description}>
                {t("public.description")}
            </p>

        </header>
    );
}