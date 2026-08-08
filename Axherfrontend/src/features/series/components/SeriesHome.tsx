"use client";

import { ContentType } from "@/entities/types";
import { useContentFilters } from "@/features/contents/hooks/useContentFilters";
import styles from "./SeriesHome.module.css";
import NewContentSection from "@/features/contents/components/NewContentSection";
import GenreBar from "@/features/movies/components/GenreBar";
import ShelfSection from "@/features/shelf/components/ShelfSection";

export default function SeriesHome() {

    const { filters } = useContentFilters(ContentType.SERIE);

    return (
        <section className={styles.container}>

            <ShelfSection target="SERIES" slug="destacados"/>

            <GenreBar
                categories={filters.categories}
                basePath="/serie"
            />

            <NewContentSection
                type={ContentType.SERIE}
            />

            <ShelfSection
                target="SERIES"
                excludeSlugs={["destacados"]}
            />

        </section>
    )
}