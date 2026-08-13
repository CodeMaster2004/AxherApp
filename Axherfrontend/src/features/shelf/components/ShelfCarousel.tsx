"use client";

import { Shelf } from "@/entities/types";
import styles from "./ShelfCarousel.module.css";
import HorizontalCarousel from "@/shared/components/HorizontalCarousel";
import ShelfCard from "@/features/shelf/components/ShelfCard";

interface Props {
    shelf: Shelf;
}

export default function ShelfCarousel({ shelf }: Props) {

    return (

        <section className={styles.section}>

            <h2>{shelf.name}</h2>

            <HorizontalCarousel>

                {
                    shelf.items.map((content) => (
                        <ShelfCard
                            key={content.contentId}
                            item={content}
                        />
                    ))
                }
            </HorizontalCarousel>

        </section>

    )
}