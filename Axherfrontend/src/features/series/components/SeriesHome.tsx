"use client";

import styles from "./SeriesHome.module.css";
import SeriesPageSections from "@/features/pageSection/components/SeriesPageSections";

export default function SeriesHome() {


    return (
        <section className={styles.container}>

            <SeriesPageSections/>

        </section>
    )
}