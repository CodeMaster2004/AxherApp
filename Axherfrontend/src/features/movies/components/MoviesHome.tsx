"use client";

import { ContentType } from "@/entities/types";
import styles from "./MoviesCatalog.module.css";
import NewContentSection from "@/features/contents/components/NewContentSection";
import { useContentFilters } from "@/features/contents/hooks/useContentFilters";
import ShelfSection from "@/features/shelf/components/ShelfSection";
import TrendingSection from "@/features/popularity/components/TrendingSection";
import GenreBar from "@/features/movies/components/GenreBar";

export default function MoviesHome() {

    const { filters } = useContentFilters(ContentType.MOVIE);

    return (

        <section className={styles.container}>
            
            <ShelfSection target="MOVIES" slug="destacados"/>
            <GenreBar
                categories={filters.categories}
                basePath="/peliculas"
            />
            <NewContentSection
                type={ContentType.MOVIE}
            />

            <ShelfSection
                target="MOVIES"
                excludeSlugs={["destacados"]}
            />
            <TrendingSection
                type={ContentType.MOVIE}
            />

                       
            

           
        </section>
    )
}