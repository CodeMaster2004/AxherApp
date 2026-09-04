"use client";

import { EpisodeDetail } from "@/entities/types";
import EpisodesSection from "@/features/episodes/components/EpisodesSection";
import { useEffect, useState } from "react";
import styles from "./SeasonsSection.module.css";
import { usePublicSeasons } from "@/features/seasons/hooks/usePublicSeasons";
import { useUpcomingSeasons } from "@/features/seasons/hooks/useUpcomingSeasons";
import { Lock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatDate } from "@/shared/utils/date";
interface Props {
    seriesId: number;
    onSelectEpisode: (episode: EpisodeDetail) => void;
}

export default function SeasonsSection({ seriesId, onSelectEpisode }: Props) {

    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const t = useTranslations("seasons");
    const locale = useLocale();
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
        return <p>{t("loading")}</p>;
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
                            {t("season")} {season.seasonNumber}
                        </button>
                        

                    ))}
                    {upcomingSeasons.map((season) => (
                        <div
                            key={season.seasonId}
                            className={styles.upcomingTab}
                            title={t("upcoming.title", {
                                number: season.seasonNumber
                            })}
                        >
                            <Lock className={styles.upcomingLock}/>

                            <span>
                                T{season.seasonNumber}
                            </span>

                            <span className={styles.upcomingDate}>
                                · {formatDate(season.releaseDate, locale)}
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
                        {t("season")}{" "} {
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
                                    {t("season")}{" "} {season.seasonNumber}
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
                                        · {formatDate(season.releaseDate, locale)}
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