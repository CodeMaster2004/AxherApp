package com.axher.backend.infrastructure.specification;

import java.math.BigDecimal;
import java.util.Locale.Category;

import org.springframework.data.jpa.domain.Specification;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.entities.ContentTypeEnum;

import jakarta.persistence.criteria.Join;

public class ContentSpecifications {
    
    // Buscar por título (LIKE)
    public static Specification<Content> titleLike(String title){
        return (root, query, cb) ->
            cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    // Filtrar por categoría
    public static Specification<Content> hasCategory(ContentCategories category){
        return (root, query, cb) ->
            cb.isMember(category, root.get("categories"));
    }

    // Filtrar por estado
    public static Specification<Content> hasStatus(Integer statusId){
        return (root, query, cb) ->
            cb.equal(root.get("contentStatus").get("contentStatusId"), statusId);
    }

    // Filtrar por descuento
    public static Specification<Content> hasDiscountAmount(BigDecimal amount){
        return (root, query, cb) ->
            cb.equal(root.get("discount").get("amount"), amount);
    }

    // Filtrar por tipo
    public static Specification<Content> hasType(ContentTypeEnum type){
        return (root, query, cb) ->
            cb.equal(root.get("type"), type);
    }

    public static Specification<Content> search(String search){
    return (root, query, cb) -> {

        String like = "%" + search.toLowerCase() + "%";

        Join<Content, Category> categoryJoin = root.join("category");

        return cb.or(
            cb.like(cb.lower(root.get("title")), like),
            cb.like(cb.lower(root.get("description")), like),
            cb.like(cb.lower(categoryJoin.get("name")), like)
        );
    };
}
}

