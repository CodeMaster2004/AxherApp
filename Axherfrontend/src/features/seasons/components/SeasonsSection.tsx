"use client";

import { EpisodeDetail } from "@/entities/types";
import EpisodesSection from "@/features/episodes/components/EpisodesSection";
import { useEffect, useState } from "react";
import styles from "./SeasonsSection.module.css";
import { usePublicSeasons } from "@/features/seasons/hooks/usePublicSeasons";
import { useUpcomingSeasons } from "@/features/seasons/hooks/useUpcomingSeasons";
import { Lock } from "lucide-react";
interface Props {
    seriesId: number;
    onSelectEpisode: (episode: EpisodeDetail) => void;
}

export default function SeasonsSection({ seriesId, onSelectEpisode }: Props) {

    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const {
        seasons,
        loading
    } = usePublicSeasons({
        seriesId
    });

    const {
    upcomingSeasons,
    loading: upcomingLoading
} = useUpcomingSeasons(seriesId);

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

    const formatReleaseDate = (date: string) => {

    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(date));

};
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
                    {upcomingSeasons.map((season) => (
                        <div
                            key={season.seasonId}
                            className={styles.upcomingTab}
                            title={`Temporada ${season.seasonNumber} · Próximamente`}
                        >
                            <Lock className={styles.upcomingLock}/>

                            <span>
                                T{season.seasonNumber}
                            </span>

                            <span className={styles.upcomingDate}>
                                · {formatReleaseDate(season.releaseDate)}
                            </span>
                        </div>
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
                            {upcomingSeasons.map((season) => (
                                <div
                                    key={season.seasonId}
                                    className={styles.upcomingOption}
                                >
                                    <Lock className={styles.upcomingLock}/>

                                    <span className={styles.upcomingLabel}>
                                        T{season.seasonNumber}
                                    </span>

                                    <span className={styles.upcomingDate}>
                                        · {formatReleaseDate(season.releaseDate)}
                                    </span>
                                </div>
                            ))}
                            

                        </div>

                    )}

                </div>


            </section>


            {currentSeason && (
                <EpisodesSection
                    seasonId={currentSeason.seasonId}
                    onSelectEpisode={onSelectEpisode}
                />
            )}

        </>
    );
}