package com.axher.backend.infrastructure.specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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

    public static Specification<Content> hasReleaseYear(Integer year){

    return (root, query, cb) -> {

        LocalDateTime start = LocalDate
                .of(year, 1, 1)
                .atStartOfDay();

        LocalDateTime end = LocalDate
                .of(year + 1, 1, 1)
                .atStartOfDay();

        return cb.and(
            cb.greaterThanOrEqualTo(
                root.<LocalDateTime>get("releaseDate"),
                start
            ),
            cb.lessThan(
                root.<LocalDateTime>get("releaseDate"),
                end
            )
        );
    };
}


    public static Specification<Content> globalSearch(String search){

        return (root, query, cb) -> {

            String like = "%" + search.toLowerCase() + "%";

            Join<Content, ContentCategories> categoryJoin = root.join("categories");

            return cb.or(
                cb.like(cb.lower(root.get("title")), like),
                cb.like(cb.lower(root.get("description")), like),

                cb.like(cb.lower(categoryJoin.get("name")), like)

            );

        };
    }

}

