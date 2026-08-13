"use client";

import { useUpcomingContents } from "@/features/contents/hooks/useUpcomingContents";
import UpcomingCard from "./UpcomingCard";
import styles from "./UpcomingCarousel.module.css";
import HorizontalCarousel from "@/shared/components/HorizontalCarousel";
import { ContentType } from "@/entities/types";

interface Props {
    type?: ContentType;
}

export default function UpcomingCarousel({ type }: Props) {

    const {
        upcomingContents,
        loading
    } = useUpcomingContents({type});

    

    if (loading) {
        return <p>Cargando próximos estrenos...</p>;
    }

    if (!upcomingContents?.length) {
        return null;
    }

    return (
        <section className={styles.section}>
            <h2>Próximos estrenos</h2>

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