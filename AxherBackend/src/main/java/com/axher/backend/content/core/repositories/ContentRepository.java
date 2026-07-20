package com.axher.backend.content.core.repositories;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.axher.backend.content.core.entities.Content;

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

    Page<Content> findByContentStatus_Status(
            String status,
            Pageable pageable
    );


    Page<Content> findByTitleContainingIgnoreCaseAndContentStatus_Status(
            String title,
            String status,
            Pageable pageable
    );
} 

