import { ContentDetail, ContentType } from "@/entities/types";

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

export enum ShelfSource {
    MANUAL = "MANUAL",
    TRENDING = "TRENDING",
    TOP_RATED = "TOP_RATED",
    NEW_RELEASES = "NEW_RELEASES",
    MOST_WATCHED = "MOST_WATCHED"
}

export interface ShelfItem {
    contentId: number;
    title: string;
    posterUrl: string;
    backdropUrl: string;
    type: ContentType;
}

export interface ContentShelf {
    contentShelfId:number;
    name:string;
    slug:string;
    target:ShelfTarget;
    layout: ShelfLayout;
    source: ShelfSource;
    active:boolean;
    createdAt?:string;
}


export interface CreateShelf {
    name:string;
    target:ShelfTarget;
    layout:ShelfLayout;
    source:ShelfSource;
    active:boolean;
}


export interface UpdateShelf {
    name?:string;
    slug?:string;
    target?:ShelfTarget;
    layout?:ShelfLayout;
    source?:ShelfSource;
    active?:boolean;
}

export interface CreateShelfContent {
    contentId: number;
    position?: number;
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
    source:ShelfSource;
    items: ShelfItem[];
}

export interface ShelfOption {
    contentShelfId: number;
    name: string;
    slug: string;
}