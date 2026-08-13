package com.axher.backend.content.core.repositories;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTypeEnum;


public interface ContentRepository extends JpaRepository<Content, Integer>, JpaSpecificationExecutor<Content> {

    Page<Content> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // Buscar por categoría (con paginación)
    Page<Content> findByCategories_ContentCategoryId(Integer categoryId, Pageable pageable);

    // Buscar por estado (con paginación)
    Page<Content> findByContentStatus_ContentStatusId(Integer statusId, Pageable pageable);

    // Buscar películas con descuento (con paginación)
    Page<Content> findByDiscountIsNotNull(Pageable pageable);

    Page<Content> findByDiscount_DiscountId(Integer discountId, Pageable pageable);

    Page<Content> findByDiscount_Amount(BigDecimal amount, Pageable pageable);

    Page<Content> findByContentStatus_Code(
            String code,
            Pageable pageable
    );


    Page<Content> findByTitleContainingIgnoreCaseAndContentStatus_Code(
            String title,
            String code,
            Pageable pageable
    );

    // Para la publicación automática
    List<Content> findByContentStatus_CodeAndReleaseDateLessThanEqual(
            String code,
            LocalDateTime releaseDate
    );

    Page<Content> findByContentStatus_CodeAndTypeOrderByReleaseDateAsc(
                String status,
                ContentTypeEnum type,
                Pageable pageable
        );

    // Nuevas películas publicadas
        Page<Content> findByTypeAndContentStatus_CodeOrderByReleaseDateDesc(
                ContentTypeEnum type,
                String code,
                Pageable pageable
        );

        @Query("""
        SELECT DISTINCT YEAR(c.releaseDate)
        FROM Content c
        WHERE (:type IS NULL OR c.type = :type)
        ORDER BY YEAR(c.releaseDate) DESC
        """)
        List<Integer> findAvailableYears(ContentTypeEnum type);

        @Query("""
        SELECT c
        FROM Content c
        WHERE c.contentStatus.code = :status
        AND (:type IS NULL OR c.type = :type)
        ORDER BY c.releaseDate ASC
        """)
        Page<Content> findUpcoming(
                @Param("status") String status,
                @Param("type") ContentTypeEnum type,
                Pageable pageable
        );

        List<Content> findByContentStatus_Code(String code);

        List<Content> findAllByContentIdIn(List<Integer> contentIds);
} 

