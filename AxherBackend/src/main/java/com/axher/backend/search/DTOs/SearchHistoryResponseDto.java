package com.axher.backend.search.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchHistoryResponseDto {
    private Long searchId;
    private String term;
    private String searchedAt;
}
