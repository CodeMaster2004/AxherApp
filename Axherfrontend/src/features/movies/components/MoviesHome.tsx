"use client";

import styles from "./MoviesCatalog.module.css";
import MoviesPageSections from "@/features/pageSection/components/MoviesPageSections";

export default function MoviesHome() {


    return (

        <section className={styles.container}>
            
            <MoviesPageSections/>

        </section>
    )
}