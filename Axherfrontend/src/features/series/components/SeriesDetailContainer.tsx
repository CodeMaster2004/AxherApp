"use client";

import { useState } from "react";

import {
    EpisodeDetail as Episode,
    SeriesDetail
} from "@/entities/types";

import EpisodeDetail from "@/features/episodes/components/EpisodeDetail";
import SeasonsSection from "@/features/seasons/components/SeasonsSection";
import SerieDetail from "./SerieDetail";


interface Props {
    series: SeriesDetail;
}


export default function SeriesDetailContainer({
    series
}: Props) {


    const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);



    return (
        <>

            {
                selectedEpisode ? (

                    <EpisodeDetail
                        episode={selectedEpisode}
                    />

                )
                :
                (
                    <SerieDetail
                        series={series}
                        onSelectEpisode={setSelectedEpisode}
                    />
                )
            }



            <SeasonsSection
                seasons={series.seasons}
                onSelectEpisode={setSelectedEpisode}
            />


        </>
    )
}