"use client";

import { useState } from "react";

import {
    EpisodeDetail as Episode,
    SeriesDetail
} from "@/entities/types";

import EpisodeDetail from "@/features/episodes/components/EpisodeDetail";
import SeasonsSection from "@/features/seasons/components/SeasonsSection";
import SerieDetail from "./SerieDetail";
import ContentPeopleCarousel from "@/features/people/components/ContentPeopleCarousel";


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
                        contentId={series.contentId}
                    />

                )
                :
                (
                    <SerieDetail
                            series={series}
                            onSelectEpisode={setSelectedEpisode} statuses={[]}                   
                     />
                )
            }

            <SeasonsSection
                seriesId={series.contentId}
                onSelectEpisode={setSelectedEpisode}
            />

            <ContentPeopleCarousel
                contentId={series.contentId}
            />


        </>
    )
}