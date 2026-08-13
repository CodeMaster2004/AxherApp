package com.axher.backend.catalog.page.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.catalog.page.entities.PageSection;
import com.axher.backend.catalog.page.entities.PageType;

public interface PageSectionRepository extends JpaRepository<PageSection, Integer>{
    
    List<PageSection> findByPageAndActiveTrueOrderByDisplayOrderAsc(PageType page);

    List<PageSection> findByPageOrderByDisplayOrderAsc(PageType page);

    List<PageSection> findByPageAndDisplayOrderGreaterThanEqualOrderByDisplayOrderAsc(
        PageType page,
        Integer displayOrder
    );

    List<PageSection> findByPageAndDisplayOrderBetweenOrderByDisplayOrderAsc(
        PageType page,
        Integer start,
        Integer end
    );

    
}
