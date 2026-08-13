import { ShelfLayout, ShelfTarget } from "@/entities/types";

export const shelfTargetOptions = [
    { value: ShelfTarget.HOME, label: "Inicio" },
    { value: ShelfTarget.MOVIES, label: "Películas" },
    { value: ShelfTarget.SERIES, label: "Series" },
];

export const shelfLayoutOptions = [
    { value: ShelfLayout.POSTER, label: "Poster" },
    { value: ShelfLayout.LANDSCAPE, label: "Horizontal" },
    { value: ShelfLayout.WIDE, label: "Horizontal Ancho" },
    { value: ShelfLayout.FEATURED, label: "Destacado" },
    { value: ShelfLayout.SQUARE, label: "Cuadrado" },
];

export const pageTypeOptions = [
    {
        label: "Home",
        value: "HOME"
    },
    {
        label: "Películas",
        value: "MOVIES"
    },
    {
        label: "Series",
        value: "SERIES"
    }
];

export const pageSectionTypeOptions = [
    {
        label: "Carrusel",
        value: "SHELF"
    },
    {
        label: "Barra de géneros",
        value: "GENRE_BAR"
    },
    {
        label: "Tendencias",
        value: "TRENDING"
    },
    {
        label: "Mejor valoradas",
        value: "TOP_RATED"
    },
    {
        label: "Nuevos lanzamientos",
        value: "NEW_RELEASES"
    },
    {
        label: "Continuar viendo",
        value: "CONTINUE_WATCHING"
    },{
        label: "Próximamente",
        value: "UPCOMING"
    }
];

export const shelfSourceOptions = [
    { value: "MANUAL", label: "Manual" },
    { value: "TRENDING", label: "Tendencias" },
    { value: "TOP_RATED", label: "Mejor valoradas" },
    { value: "NEW_RELEASES", label: "Nuevos lanzamientos" },
    { value: "MOST_WATCHED", label: "Más vistas" }
];