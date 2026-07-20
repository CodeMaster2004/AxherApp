package com.axher.backend.content.core.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.core.entities.ContentCategories;

public interface ContentCategoriesRepository extends JpaRepository<ContentCategories, Integer>{

    boolean existsByName(String name);

    // Búsqueda por nombre o descripción (case-insensitive) con paginación
    Page<ContentCategories> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String name,
        String description,
        Pageable pageable
    );

}
