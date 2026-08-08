package com.axher.backend.catalog.shelf.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.catalog.shelf.entities.ShelfTarget;

public interface ContentShelfRepository extends JpaRepository<ContentShelf, Integer>{

    List<ContentShelf> findByTargetAndActiveTrueOrderByDisplayOrderAsc(
            ShelfTarget target
    );
    List<ContentShelf> findByTargetAndSlugAndActiveTrue(
            ShelfTarget target,
            String slug
    );

        boolean existsByNameIgnoreCase(String name);
    boolean existsByTargetAndSlug(
        ShelfTarget target,
        String slug
    );

    boolean existsByTargetAndSlugAndContentShelfIdNot(
        ShelfTarget target,
        String slug,
        Integer contentShelfId
    );
    
    boolean existsByTargetAndNameIgnoreCase(
        ShelfTarget target,
        String name
    );

    boolean existsByTargetAndNameIgnoreCaseAndContentShelfIdNot(
        ShelfTarget target,
        String name,
        Integer contentShelfId
    );
}
