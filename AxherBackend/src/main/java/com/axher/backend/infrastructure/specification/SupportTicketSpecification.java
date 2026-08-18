package com.axher.backend.infrastructure.specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.axher.backend.support.tickets.entities.SupportTicket;

import jakarta.persistence.criteria.Predicate;

public class SupportTicketSpecification {

    public static Specification<SupportTicket> filter(
        String search,
        String statusCode,
        Integer supportCategoryId,
        Integer userId,
        LocalDateTime createdAtFrom,
        LocalDateTime createdAtTo
    ){
        return (root, query, criteriaBuilder) -> {
            
            List<Predicate> predicates = new ArrayList<>();

            // ==============================
            // BÚSQUEDA GENERAL
            // ==============================
            if (search != null && !search.isBlank()) {

                String value =
                    "%" + search.trim().toLowerCase() + "%";

                Predicate subject = criteriaBuilder.like(
                    criteriaBuilder.lower(
                        root.get("subject")
                    ),
                    value
                );

                predicates.add(
                    criteriaBuilder.or(subject)
                );
            }

            // ==============================
            // ESTADO
            // ==============================
            if (statusCode != null && !statusCode.isBlank()) {

                predicates.add(
                    criteriaBuilder.equal(
                        root.get("supportTicketStatus")
                            .get("code"),
                        statusCode
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
            // USUARIO
            // ==============================
            if (userId != null) {

                predicates.add(
                    criteriaBuilder.equal(
                        root.get("user")
                            .get("userId"),
                        userId
                    )
                );
            }

            // ==============================
            // FECHA DESDE
            // ==============================
            if (createdAtFrom != null) {

                predicates.add(
                    criteriaBuilder.greaterThanOrEqualTo(
                        root.get("createdAt"),
                        createdAtFrom
                    )
                );
            }

            // ==============================
            // FECHA HASTA
            // ==============================
            if (createdAtTo != null) {

                predicates.add(
                    criteriaBuilder.lessThanOrEqualTo(
                        root.get("createdAt"),
                        createdAtTo
                    )
                );
            }

            return criteriaBuilder.and(
                predicates.toArray(new Predicate[0])
            );
        };
    }
    
}
