package com.axher.backend.content.core.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.entities.ContentTypeEnum;

public interface ContentCategoriesRepository extends JpaRepository<ContentCategories, Integer>{

    boolean existsByNameIgnoreCase(String name);

    // Búsqueda por nombre o descripción (case-insensitive) con paginación
    Page<ContentCategories> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String name,
        String description,
        Pageable pageable
    );

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
        WHERE content.contentStatus.code = 'PUBLISHED'
        AND (:type IS NULL OR content.type = :type)
        ORDER BY c.name
    """)
    List<ContentCategories> findAvailableCategories(ContentTypeEnum type);

}
