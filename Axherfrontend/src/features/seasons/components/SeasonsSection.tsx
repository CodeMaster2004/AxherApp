"use client";

import { EpisodeDetail, SeasonDetail } from "@/entities/types";
import EpisodesSection from "@/features/episodes/components/EpisodesSection";
import { useEffect, useState } from "react";
import styles from "./SeasonsSection.module.css";

interface Props {
    seasons: SeasonDetail[];
    onSelectEpisode: (episode: EpisodeDetail) => void;
}

export default function SeasonsSection({ seasons, onSelectEpisode }: Props) {

    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (seasons.length > 0) {
            setSelectedSeason(seasons[0].seasonId);
        }
    }, [seasons]);


    if (seasons.length === 0) {
        return <p>No hay temporadas.</p>;
    }


    const currentSeason = seasons.find(
        season => season.seasonId === selectedSeason
    );


    return (
        <>

            <section className={styles.container}>


                {/* DESKTOP */}
                <div className={styles.tabs}>

                    {seasons.map((season) => (

                        <button
                            key={season.seasonId}
                            className={`${styles.tab} ${
                                selectedSeason === season.seasonId
                                    ? styles.active
                                    : ""
                            }`}
                            onClick={() => setSelectedSeason(season.seasonId)}
                        >
                            Temporada {season.seasonNumber}
                        </button>

                    ))}

                </div>



                {/* MOBILE */}
<div className={styles.selectContainer}>

    <button
        className={styles.selectButton}
        onClick={() => setOpen(!open)}
    >
        Temporada {
            seasons.find(
                season => season.seasonId === selectedSeason
            )?.seasonNumber
        }

        <span className={styles.arrow}>
            {open ? "⌃" : "⌄"}
        </span>
    </button>


    {open && (

        <div className={styles.dropdownMenu}>

            {seasons.map((season) => (

                <button
                    key={season.seasonId}
                    className={
                        selectedSeason === season.seasonId
                        ? styles.selectedOption
                        : ""
                    }
                    onClick={() => {
                        setSelectedSeason(season.seasonId);
                        setOpen(false);
                    }}
                >
                    Temporada {season.seasonNumber}
                </button>

            ))}

        </div>

    )}

</div>


            </section>


            {currentSeason && (
                <EpisodesSection
                    episodes={currentSeason.episodes}
                    onSelectEpisode={onSelectEpisode}
                />
            )}

        </>
    );
}