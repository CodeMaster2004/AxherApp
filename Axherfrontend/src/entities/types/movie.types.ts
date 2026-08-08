export interface CreateMovie{
    movieFile: File;
}

export interface UpdateMovie{
    movieFile?: File;
}

export interface MovieFiltersType {
    categoryId?: string;
    year?: number;
    sort?: string;
}