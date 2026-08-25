package com.axher.backend.catalog.shelf.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.catalog.shelf.entities.ShelfTarget;

public interface ContentShelfRepository extends JpaRepository<ContentShelf, Integer>{

    List<ContentShelf> findByTargetAndActiveTrue(
            ShelfTarget target
    );
    List<ContentShelf> findByTargetAndSlugAndActiveTrue(
            ShelfTarget target,
            String slug
    );

    boolean existsByTargetAndSlug(
        ShelfTarget target,
        String slug
    );

    boolean existsByTargetAndSlugAndContentShelfIdNot(
        ShelfTarget target,
        String slug,
        Integer contentShelfId
    );
    

    Page<ContentShelf> findByTarget(
            ShelfTarget target,
            Pageable pageable
    );

}
