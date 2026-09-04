package com.axher.backend.content.people.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.content.people.entities.CinematicRole;

public interface CinematicRoleRepository extends JpaRepository<CinematicRole, Integer> {

    Optional<CinematicRole> findByCode(String code);

    boolean existsByCode(String code);

    @Query("""
        SELECT DISTINCT r
        FROM CinematicRole r
        LEFT JOIN r.translations t
        WHERE
            LOWER(r.code) LIKE LOWER(CONCAT('%', :search, '%'))
            OR (
                t.language.languageId = :languageId
                AND (
                    LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
                )
            )
    """)
    Page<CinematicRole> search(
            @Param("search") String search,
            @Param("languageId") Integer languageId,
            Pageable pageable
    );

}
