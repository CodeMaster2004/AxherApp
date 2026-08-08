import { ContentDetail } from "@/entities/types";

export enum ShelfTarget {
    HOME = "HOME",
    SERIES = "SERIES",
    MOVIES = "MOVIES",
}

export enum ShelfLayout {
    POSTER = "POSTER",
    LANDSCAPE = "LANDSCAPE",
    WIDE = "WIDE",
    FEATURED = "FEATURED",
    SQUARE = "SQUARE"
}

export interface ContentShelf {
    contentShelfId:number;
    name:string;
    slug:string;
    target:ShelfTarget;
    layout: ShelfLayout;
    displayOrder:number;
    active:boolean;
    createdAt?:string;
}


export interface CreateShelf {
    name:string;
    target:ShelfTarget;
    layout:ShelfLayout;
    displayOrder:number;
    active:boolean;
}


export interface UpdateShelf {
    name?:string;
    slug?:string;
    target?:ShelfTarget;
    layout?:ShelfLayout;
    displayOrder?:number;
    active?:boolean;
}

export interface CreateShelfContent {
    contentId: number;
    position: number;
}


export interface UpdateShelfContent {
    position: number;
}

export interface ShelfContent {

    shelfContentId:number;

    contentId:number;

    title:string;

    posterUrl:string;

    position:number;

}

export interface Shelf{
    name:string;
    slug:string;
    contents: ContentDetail[];
}