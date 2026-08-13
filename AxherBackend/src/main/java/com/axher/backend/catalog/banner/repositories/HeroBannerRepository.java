package com.axher.backend.catalog.banner.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.content.core.entities.Content;

public interface HeroBannerRepository extends JpaRepository<HeroBanner, Integer> {
    
    @Query("""
        SELECT hb
        FROM HeroBanner hb
        JOIN hb.content c
        WHERE hb.active = true
        AND c.contentStatus.code = 'PUBLISHED'
        AND (hb.startDate IS NULL OR :now >= hb.startDate)
        AND (hb.endDate IS NULL OR :now <= hb.endDate)
        ORDER BY hb.priority DESC, hb.createdAt DESC
        """)
    List<HeroBanner> findActiveValidBanners(
            @Param("now") LocalDateTime now
    );


    @Query("""
        SELECT c
        FROM Content c
        WHERE c.contentStatus.code = 'PUBLISHED'
        ORDER BY c.contentId DESC
        """)
    List<Content> findHeroContent(Pageable pageable);

    Page<HeroBanner> findByContent_TitleContainingIgnoreCase(
        String title,
        Pageable pageable
    );
}
