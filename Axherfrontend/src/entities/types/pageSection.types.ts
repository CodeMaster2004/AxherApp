export type PageSectionType =
    | "UPCOMING"
    | "GENRE_BAR"
    | "CONTINUE_WATCHING"
    | "TRENDING"
    | "TOP_RATED"
    | "NEW_RELEASES"
    | "SHELF";

export type PageType =
    | "HOME"
    | "MOVIES"
    | "SERIES";

export interface PageSection {
    pageSectionId: number;
    page: PageType;
    type: PageSectionType;
    displayOrder: number;
    active: boolean;
    contentShelfId?: number | null;
    contentShelfName?: string | null;
}

export interface PageSectionCreate {
    page: PageType;
    type: PageSectionType;
    displayOrder?: number | null;
    active?: boolean;
    contentShelfId?: number | null;
}

export interface PageSectionUpdate {
    type?: PageSectionType;
    active?: boolean;
    contentShelfId?: number;
    displayOrder?: number;
}