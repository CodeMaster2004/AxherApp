"use client";

import TopRatedCard from "@/features/popularity/components/TopRatedCard";
import { useTopRated } from "@/features/popularity/hooks/useTopRated";
import styles from "./TopRatedSection.module.css";
import HorizontalCarousel from "@/shared/components/HorizontalCarousel";
import { ContentType } from "@/entities/types";
import { useTranslations } from "next-intl";

interface Props {
    type: ContentType;
}

export default function TopRatedSection({ type }: Props) {
    const t = useTranslations("popularity");
    const { topRated, loading } = useTopRated(type);

    
    if(loading || topRated.length === 0) return null;


    return (

        <section className={styles.section}>
            <h2>
                {t("topRated.title")}
            </h2>
            <HorizontalCarousel >

                    {
                        topRated.map(item => (
                            <TopRatedCard
                                key={item.contentId}
                                content={item}
                            />
                        ))
                    }
            </HorizontalCarousel> 
                
           
        </section>
    )
}