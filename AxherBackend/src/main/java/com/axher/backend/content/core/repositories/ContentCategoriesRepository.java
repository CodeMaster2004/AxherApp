package com.axher.backend.content.core.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.entities.ContentTypeEnum;

import io.lettuce.core.dynamic.annotation.Param;

public interface ContentCategoriesRepository extends JpaRepository<ContentCategories, Integer>{


    boolean existsBySlug(String slug);

    boolean existsBySlugAndContentCategoryIdNot(
        String slug,
        Integer contentCategoryId
    );
    Optional<ContentCategories> findBySlug(String slug);
    
    @Query("""
        SELECT DISTINCT c
        FROM Content content
        JOIN content.categories c
        JOIN c.translations t
        WHERE content.contentStatus.code = 'PUBLISHED'
        AND (:type IS NULL OR content.type = :type)
        AND t.language.languageId = :languageId
        ORDER BY t.name
    """)
    Page<ContentCategories> findAvailableCategories(
        @Param("type") ContentTypeEnum type,
        @Param("languageId") Integer languageId,
        Pageable pageable
    );

    @Query("""
        SELECT DISTINCT c
        FROM ContentCategories c
        LEFT JOIN c.translations t
        WHERE
            LOWER(c.slug) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
    """)
    Page<ContentCategories> search(
        @Param("search") String search,
        Pageable pageable
    );

}
