package com.axher.backend.search.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.search.DTOs.SearchHistoryResponseDto;
import com.axher.backend.search.entities.SearchHistory;

@Component
public class SearchHistoryMapper {

    public SearchHistoryResponseDto toDto(SearchHistory entity) {
        
        SearchHistoryResponseDto dto = new SearchHistoryResponseDto();
        dto.setSearchId(entity.getSearchId());
        dto.setTerm(entity.getTerm());
        dto.setSearchedAt(entity.getSearchedAt().toString());
        return dto;
    }
    
}
