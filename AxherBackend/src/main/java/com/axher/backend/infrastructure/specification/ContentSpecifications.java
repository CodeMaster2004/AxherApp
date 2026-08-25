package com.axher.backend.infrastructure.specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.Specification;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.entities.ContentCategoryTranslation;
import com.axher.backend.content.core.entities.ContentTranslation;
import com.axher.backend.content.core.entities.ContentTypeEnum;

import jakarta.persistence.criteria.Join;

public class ContentSpecifications {
    
    // Buscar por título (LIKE)
    public static Specification<Content> titleLike(String title) {

        return (root, query, cb) -> {

            Join<Content, ContentTranslation> translation =
                    root.join("translations");

            query.distinct(true);

            return cb.like(
                cb.lower(translation.get("title")),
                "%" + title.trim().toLowerCase() + "%"
            );
        };
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


    public static Specification<Content> globalSearch(String search) {

        return (root, query, cb) -> {

            String like =
                "%" + search.trim().toLowerCase() + "%";

            Join<Content, ContentTranslation> translationJoin =
                root.join("translations");

            Join<Content, ContentCategories> categoryJoin =
                root.join("categories");

            Join<ContentCategories, ContentCategoryTranslation>
                categoryTranslationJoin =
                    categoryJoin.join("translations");

            query.distinct(true);

            return cb.or(

                // Buscar en títulos
                cb.like(
                    cb.lower(
                        translationJoin.get("title")
                    ),
                    like
                ),

                // Buscar en descripciones
                cb.like(
                    cb.lower(
                        translationJoin.get("description")
                    ),
                    like
                ),

                // Buscar en nombres de categorías traducidos
                cb.like(
                    cb.lower(
                        categoryTranslationJoin.get("name")
                    ),
                    like
                )
            );
        };
    }

}

