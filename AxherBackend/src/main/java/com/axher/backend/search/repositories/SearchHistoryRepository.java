package com.axher.backend.search.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.search.entities.SearchHistory;

public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long>{

    Page<SearchHistory> findByUser_UserIdOrderBySearchedAtDesc(
        Integer userId,
        Pageable pageable
    );

    Long deleteBySearchIdAndUser_UserId(
        Long searchId,
        Integer userId
    );

    void deleteByUser_UserId(
        Integer userId
    );

    Optional<SearchHistory> findByUser_UserIdAndTerm(
        Integer userId,
        String term
    );
    
}
