"use client";

import TrendingCard from "@/features/popularity/components/TrendingCard";
import { useTrending } from "@/features/popularity/hooks/useTrending";
import styles from "./TrendingSection.module.css";
import HorizontalCarousel from "@/shared/components/HorizontalCarousel";
import { ContentType } from "@/entities/types";

interface Props {
    type?: ContentType;
}

export default function TendingSection({type}: Props ){

    const {trending, loading} = useTrending({type});

    if(loading) return null;

    return (

        <section className={styles.section}>

            <h2>
                En tendencia
            </h2>
            
                <HorizontalCarousel >


                        {
                            trending.map((item, index) => (
                                <TrendingCard
                                    key={item.contentId}
                                    content={item}
                                    rank={index + 1}
                                />
                            ))
                        }

                </HorizontalCarousel>
        </section>
    )
}