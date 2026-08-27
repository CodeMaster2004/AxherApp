"use client";

import ContentCard from "@/features/contents/components/ContentCard";
import { useNewContent } from "@/features/contents/hooks/useNewContent";
import HorizontalCarousel from "@/shared/components/HorizontalCarousel";
import styles from "./NewContentSection.module.css";
import { ContentType } from "@/entities/types";
import { useTranslations } from "next-intl";

interface Props {
    type?: ContentType;
}
export default function NewContentSection({ type }: Props) {

    const {
        newContent,
        loading
    } = useNewContent({
        type
    });
    const t = useTranslations("contents");

    if(loading || newContent.length === 0) {
        return null;
    }

    return (

        <section className={styles.section}>

            <header className={styles.header}>

                <h2 className={styles.title}>
                    {t("newReleases")}
                </h2>
            </header>

            <HorizontalCarousel>
                {
                    newContent.map(content => (
                        <ContentCard
                            key={content.contentId}
                            content={content}
                        />
                    ))
                }
            </HorizontalCarousel>
        </section>
    )
}