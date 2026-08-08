package com.axher.backend.catalog.shelf.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.catalog.shelf.entities.ShelfContent;
import com.axher.backend.content.core.entities.Content;

public interface ShelfContentRepository extends JpaRepository<ShelfContent, Integer> {
    
    List<ShelfContent> findByContentShelfOrderByPositionAsc(
            ContentShelf contentShelf
    );

    boolean existsByContentShelfAndContent(
            ContentShelf shelf,
            Content content);

    List<ShelfContent> 
    findByContentShelf_ContentShelfIdOrderByPositionAsc(
            Integer shelfId
    );

    List<ShelfContent> findByContentShelfAndPositionGreaterThanOrderByPositionAsc(
                ContentShelf contentShelf,
                Integer position
    );
    

}
