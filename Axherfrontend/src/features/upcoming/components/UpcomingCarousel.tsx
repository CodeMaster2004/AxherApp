"use client";

import { useUpcomingContents } from "@/features/contents/hooks/useUpcomingContents";
import UpcomingCard from "./UpcomingCard";
import styles from "./UpcomingCarousel.module.css";
import HorizontalCarousel from "@/shared/components/HorizontalCarousel";
import { ContentType } from "@/entities/types";
import { useTranslations } from "next-intl";

interface Props {
    type?: ContentType;
}

export default function UpcomingCarousel({ type }: Props) {

    const {
        upcomingContents,
        loading
    } = useUpcomingContents({type});

    const t = useTranslations("upcoming");

    if (loading) {
        return <p>{t("loadIng")}</p>;
    }

    if (!upcomingContents?.length) {
        return null;
    }

    return (
        <section className={styles.section}>
            <h2>{t("title")}</h2>

            <HorizontalCarousel>
                {upcomingContents.map(content => (
                    <UpcomingCard
                        key={content.contentId}
                        UpcomingContent={content}
                    />
                ))}
            </HorizontalCarousel>
        </section>
    );
}