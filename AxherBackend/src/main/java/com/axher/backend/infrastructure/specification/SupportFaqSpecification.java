package com.axher.backend.infrastructure.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.axher.backend.support.SupportFaq.entities.SupportFaq;

import jakarta.persistence.criteria.Predicate;

public class SupportFaqSpecification {

    public static Specification<SupportFaq> filter(
        String search,
        Integer supportCategoryId,
        Boolean active
    ){

        return (root, query, criteriaBuilder) -> {

            query.distinct(true);

            List<Predicate> predicates = new ArrayList<>();

            // ==============================
            // BÚSQUEDA GENERAL
            // ==============================

            if (search != null && !search.isBlank()) {

                String value =
                        "%" + search.trim().toLowerCase() + "%";

                Predicate categoryCode =
                        criteriaBuilder.like(
                                criteriaBuilder.lower(
                                        root.get("supportCategory")
                                                .get("code")
                                ),
                                value
                        );

                Predicate question =
                        criteriaBuilder.like(
                                criteriaBuilder.lower(
                                        root.join("translations")
                                                .get("question")
                                ),
                                value
                        );

                Predicate answer =
                        criteriaBuilder.like(
                                criteriaBuilder.lower(
                                        root.join("translations")
                                                .get("answer")
                                ),
                                value
                        );

                predicates.add(
                        criteriaBuilder.or(
                                categoryCode,
                                question,
                                answer
                        )
                );
            }

            // ==============================
            // CATEGORÍA
            // ==============================
            if (supportCategoryId != null) {

                predicates.add(
                        criteriaBuilder.equal(
                                root.get("supportCategory")
                                        .get("supportCategoryId"),
                                supportCategoryId
                        )
                );
            }

            // ==============================
            // ESTADO
            // ==============================
            if (active != null) {

                predicates.add(
                        criteriaBuilder.equal(
                                root.get("active"),
                                active
                        )
                );
            }

            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
    
}
