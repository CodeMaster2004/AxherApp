"use client";

import { Shelf } from "@/entities/types";
import styles from "./ShelfCarousel.module.css";
import HorizontalCarousel from "@/shared/components/HorizontalCarousel";
import MovieCard from "@/features/movies/components/MovieCard";

interface Props {
    shelf: Shelf;
}

export default function ShelfCarousel({ shelf }: Props) {

    return (

        <section className={styles.section}>

            <h2>{shelf.name}</h2>

            <HorizontalCarousel>

                {
                    shelf.contents.map((content) => (
                        <MovieCard
                            key={content.contentId}
                            movie={content}
                        />
                    ))
                }
            </HorizontalCarousel>

        </section>

    )
}