import { ShelfLayout, ShelfTarget } from "@/entities/types";

export const shelfTargetOptions = [
    { value: ShelfTarget.HOME,  labelKey: "options.target.home" },
    { value: ShelfTarget.MOVIES, labelKey: "options.target.movies"},
    { value: ShelfTarget.SERIES, labelKey: "options.target.series" },
];

export const shelfLayoutOptions = [
    { value: ShelfLayout.POSTER, labelKey: "options.layout.poster" },
    { value: ShelfLayout.LANDSCAPE, labelKey: "options.layout.landscape" },
    { value: ShelfLayout.WIDE, labelKey: "options.layout.wide" },
    { value: ShelfLayout.FEATURED, labelKey: "options.layout.featured" },
    { value: ShelfLayout.SQUARE, labelKey: "options.layout.square" },
];

export const pageTypeOptions = [
    {
        labelKey: "pages.home",
        value: "HOME"
    },
    {
        labelKey: "pages.movies",
        value: "MOVIES"
    },
    {
        labelKey: "pages.series",
        value: "SERIES"
    }
];

export const pageSectionTypeOptions = [
    {
        labelKey: "form.shelf",
        value: "SHELF"
    },
    {
        labelKey: "options.sectionType.genreBar",
        value: "GENRE_BAR"
    },
    {
        labelKey: "options.sectionType.trending",
        value: "TRENDING"
    },
    {
        labelKey: "options.sectionType.topRated",
        value: "TOP_RATED"
    },
    {
        labelKey: "options.sectionType.newReleases",
        value: "NEW_RELEASES"
    },
    {
        labelKey: "options.sectionType.continueWatching",
        value: "CONTINUE_WATCHING"
    },{
        labelKey: "options.sectionType.upcoming",
        value: "UPCOMING"
    }
];

export const shelfSourceOptions = [
    { value: "MANUAL", labelKey: "options.source.manual" },
    { value: "TRENDING", labelKey: "options.source.trending" },
    { value: "TOP_RATED", labelKey: "options.source.top_rated" },
    { value: "NEW_RELEASES", labelKey: "options.source.new_releases" },
    { value: "MOST_WATCHED", labelKey: "options.source.most_watched" }
];
