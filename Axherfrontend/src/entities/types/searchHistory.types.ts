export interface SearchHistoryResponse {
    searchId: number;
    term: string;
    searchedAt: string;
}

export interface SearchHistoryRequest{
    term: string;
}