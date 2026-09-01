"use client";

import { useSupportFaq } from "@/features/faqs/hooks/useSupportFaq";
import { useSupportCategory } from "@/features/supportCategory/hooks/useSupportCategory";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import styles from "./SupportFaqCategoryView.module.css";
import { ArrowLeft } from "lucide-react";
import SupportFaqSearch from "@/features/faqs/components/SupportFaqSearch";
import SupportFaqAccordion from "@/features/faqs/components/SupportFaqAccordion";


export default function SupportFaqCategoryView() {

    const t = useTranslations("supportFaq");
    const router = useRouter();
    const params = useParams();
    const categoryId = Number(params.categoryId);

    const {
        supportCategory,
    } = useSupportCategory();

    const category = supportCategory.find(
        category =>
            category.supportCategoryId === categoryId
    );

    const {
        searchTerm,
        setSearchTerm,
        faqs,
        loading,
        error,
    } = useSupportFaq({
        initialFilters: {
            supportCategoryId: categoryId,
            active: true,
        }
    })

    return (
        <main className={styles.container}>

            <button 
                type="button"
                className={styles.back}
                onClick={() => router.push("/support")}
            >
                <ArrowLeft size={18} />
                <span>
                    {t("public.backToHelpCenter")}
                </span>
            </button>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    {category?.name}
                </h1>
                <p className={styles.description}>
                    {t("public.categoryDescription")}
                </p>
            </header>

            <SupportFaqSearch
                value={searchTerm}
                onChange={setSearchTerm}
            />

            <section className={styles.content}>
                {loading && (
                    <p className={styles.message}>
                        {t("public.searching")}
                    </p>
                )}
                {!loading && error && (
                    <p className={styles.message}>
                        {t("public.searchError")}
                    </p>
                )}
                {!loading && !error && faqs.length === 0 && (
                    <p className={styles.message}>
                        {t("public.noResults")}
                    </p>
                )}
                {!loading && faqs.length > 0 && (
                    <SupportFaqAccordion faqs={faqs} />
                )}
            </section>

        </main>
    )
}