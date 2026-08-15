package com.axher.backend.infrastructure.specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.axher.backend.support.reports.entities.ProblemReport;
import com.axher.backend.support.reports.entities.ProblemReportCategory;

import jakarta.persistence.criteria.Predicate;

public class ProblemReportSpecification {

    public static Specification<ProblemReport> filter(
        String search,
        String statusCode,
        ProblemReportCategory category,
        Integer userId,
        Integer contentId,
        Integer episodeId,
        LocalDateTime reportedAtFrom,
        LocalDateTime reportedAtTo
    ){

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            // ==============================
            // BÚSQUEDA GENERAL
            // ==============================
            if(search != null && !search.isBlank()){
                String value = "%" + search.trim().toLowerCase() + "%";

                Predicate description = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("description")),
                    value
                );

                Predicate categoryPredicate = criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("category")),
                    value
                );

                predicates.add(
                    criteriaBuilder.or(
                        description,
                        categoryPredicate
                    )
                );
            }

            // ==============================
            // ESTADO
            // ==============================
            if (statusCode != null && !statusCode.isBlank()) {

                predicates.add(
                    criteriaBuilder.equal(
                        root.get("reportStatus").get("code"),
                        statusCode
                    )
                );
            }

            // ==============================
            // CATEGORÍA
            // ==============================
            if (category != null) {

                predicates.add(
                    criteriaBuilder.equal(
                        root.get("category"),
                        category
                    )
                );
            }

            // ==============================
            // USUARIO
            // ==============================
            if (userId != null) {
                predicates.add(
                    criteriaBuilder.equal(
                        root.get("user").get("userId"),
                        userId
                    )
                );
            }

            // ==============================
            // CONTENIDO
            // ==============================
            if (contentId != null) {
                predicates.add(
                    criteriaBuilder.equal(
                        root.get("content").get("contentId"),
                        contentId
                    )
                );
            }

            // ==============================
            // EPISODIO
            // ==============================
            if (episodeId != null) {
                predicates.add(
                    criteriaBuilder.equal(
                        root.get("episode").get("episodeId"),
                        episodeId
                    )
                );
            }

            // ==============================
            // FECHA DESDE  
            // ==============================
            if (reportedAtFrom != null) {
                predicates.add(
                    criteriaBuilder.greaterThanOrEqualTo(
                        root.get("reportedAt"),
                        reportedAtFrom
                    )
                );
            }

            // ==============================
            // FECHA HASTA
            // ==============================
            if (reportedAtTo != null) {
                predicates.add(
                    criteriaBuilder.lessThanOrEqualTo(
                        root.get("reportedAt"),
                        reportedAtTo
                    )
                );
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));

        };
    }
    
}
