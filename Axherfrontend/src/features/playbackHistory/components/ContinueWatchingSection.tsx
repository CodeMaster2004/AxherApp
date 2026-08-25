"use client";

import ContinueWatchingCard from "@/features/playbackHistory/components/ContinueWatchingCard";
import { useContinueWatching } from "@/features/playbackHistory/hooks/useContinueWatching";
import styles from "./ContinueWatchingSection.module.css";
import HorizontalCarousel from "@/shared/components/HorizontalCarousel";
import { useTranslations } from "next-intl";

export default function ContinueWatchingSection() {

    const { continueWatching, loading } = useContinueWatching();
    const t = useTranslations("playbackHistory");
    if(loading || continueWatching.length === 0) return null;

    return (

        <section className={styles.section}>
            <h2>
                {t("continueWatching")}
            </h2>
            <HorizontalCarousel>

                    {
                        continueWatching.map(item => (
                            <ContinueWatchingCard
                                key={item.episodeId ?? item.contentId}
                                content={item}
                            />
                        ))
                    }

            </HorizontalCarousel>
        </section>
    )
}