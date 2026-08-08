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