"use client";

import { useTranslations } from "next-intl";

import SupportFaqHeader from "./SupportFaqHeader";
import SupportFaqSearch from "./SupportFaqSearch";
import SupportFaqCategories from "./SupportFaqCategories";

import styles from "./SupportFaqCenter.module.css";
import { useSupportCategory } from "@/features/supportCategory/hooks/useSupportCategory";
import SupportTicketsButton from "@/features/supportTicket/components/SupportTicketsButton";
import { useSupportFaq } from "@/features/faqs/hooks/useSupportFaq";
import SupportFaqAccordion from "@/features/faqs/components/SupportFaqAccordion";



export default function SupportFaqCenter() {

    const t = useTranslations("supportFaq");

    const {
        supportCategory,
    } = useSupportCategory();

    const {
        searchTerm,
        setSearchTerm,
        faqs,
        loading,
        error,
    } = useSupportFaq();
    
    const isSearching = searchTerm.trim().length > 0;

    return (
        <main className={styles.container}>

            <SupportFaqHeader />

            <SupportFaqSearch 
                value={searchTerm}
                onChange={setSearchTerm}
            />

            {isSearching ? (
                <section className={styles.searchResults}>
                    <h2 className={styles.searchResultsTitle}>
                        {t("public.searchResults")}
                    </h2>
                    {loading && (
                        <p className={styles.searchMessage}>
                            {t("public.searching")}
                        </p>
                    )}

                    {!loading && error && (
                        <p className={styles.searchMessage}>
                            {t("public.searchError")}
                        </p>
                    )}

                    {!loading && !error && faqs.length === 0 && (
                        <p className={styles.searchMessage}>
                            {t("public.noResults")}
                        </p>
                    )}

                    {!loading && faqs.length > 0 && (
                        <SupportFaqAccordion
                            faqs={faqs}
                        />
                    )}
                </section>
            ):(

                <section className={styles.categories}>

                    <h2 className={styles.categoriesTitle}>
                        {t("public.categoriesTitle")}
                    </h2>

                    <SupportFaqCategories
                        categories={supportCategory}
                        
                    />

                </section>
            )}

            <SupportTicketsButton />

        </main>
    );
}