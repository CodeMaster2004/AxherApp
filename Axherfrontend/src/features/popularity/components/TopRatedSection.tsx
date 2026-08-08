"use client";

import TopRatedCard from "@/features/popularity/components/TopRatedCard";
import { useTopRated } from "@/features/popularity/hooks/useTopRated";
import styles from "./TopRatedSection.module.css";
import HorizontalCarousel from "@/shared/components/HorizontalCarousel";


export default function TopRatedSection() {

    const { topRated, loading } = useTopRated();

    
    if(loading || topRated.length === 0) return null;


    return (

        <section className={styles.section}>
            <h2>
                ⭐ Mejor valoradas
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