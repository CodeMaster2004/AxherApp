"use client";

import { Category, ContentType } from "@/entities/types";
import { PageSection } from "@/entities/types/pageSection.types";
import NewContentSection from "@/features/contents/components/NewContentSection";
import GenreBar from "@/features/movies/components/GenreBar";
import ContinueWatchingSection from "@/features/playbackHistory/components/ContinueWatchingSection";
import TopRatedSection from "@/features/popularity/components/TopRatedSection";
import TrendingSection from "@/features/popularity/components/TrendingSection";
import ShelfSection from "@/features/shelf/components/ShelfSection";
import UpcomingCarousel from "@/features/upcoming/components/UpcomingCarousel";

interface Props {
    section: PageSection;
    contentType?: ContentType;
    categories?: Category[];
    basePath?: string;
}
export default function PageSectionRnderer({ section, contentType, categories, basePath }: Props){

    switch (section.type) {

        case "TOP_RATED":
            if (!contentType) {
                return null;
            }

            return (
                <TopRatedSection
                    type={contentType}
                />
            );

        case "TRENDING":
            return (
                <TrendingSection
                    type={contentType}
                />
            );


        case "NEW_RELEASES":
            if (!contentType) {
                return null;
            }

            return (
                <NewContentSection
                    type={contentType}
                />
            );

        case "CONTINUE_WATCHING":
            return (
                <ContinueWatchingSection />
            );

        case "GENRE_BAR":
            if (!categories || !basePath) {
                return null;
            }

            return (
                <GenreBar
                    categories={categories}
                    basePath={basePath}
                />
            );

        case "SHELF":
            if (!section.contentShelfId) {
                return null;
            }

            return (
                <ShelfSection
                    shelfId={
                        section.contentShelfId
                    }
                />
            );

        case "UPCOMING":
            return (
                <UpcomingCarousel
                    type={contentType}
                />
            );

        default:
            return null;
    }


} 