package com.axher.backend.content.people.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.content.people.entities.ContentPersonRole;

public interface ContentPersonRoleRepository
        extends JpaRepository<ContentPersonRole, Long> {

    List<ContentPersonRole> findByContent_ContentIdOrderByOrderIndexAsc(
            Integer contentId
    );

    Page<ContentPersonRole> findByContent_ContentIdOrderByOrderIndexAsc(
            Integer contentId,
            Pageable pageable
    );

    List<ContentPersonRole> findByPerson_PersonIdOrderByOrderIndexAsc(
            Integer personId
    );

    Page<ContentPersonRole> findByPerson_PersonId(
            Integer personId,
            Pageable pageable
    );

    List<ContentPersonRole> findByContent_ContentIdAndPerson_PersonId(
            Integer contentId,
            Integer personId
    );

    boolean existsByContent_ContentIdAndPerson_PersonIdAndCinematicRole_CinematicRoleIdAndCharacterNameIgnoreCase(
            Integer contentId,
            Integer personId,
            Integer cinematicRoleId,
            String characterName
    );

    boolean existsByContent_ContentIdAndPerson_PersonIdAndCinematicRole_CinematicRoleIdAndCharacterNameIsNull(
            Integer contentId,
            Integer personId,
            Integer cinematicRoleId
    );

    Optional<ContentPersonRole> findByContentPersonRoleIdAndContent_ContentId(
            Long contentPersonRoleId,
            Integer contentId
    );

    void deleteByContent_ContentId(
            Integer contentId
    );

    void deleteByPerson_PersonId(
            Integer personId
    );

    long countByContent_ContentId(
            Integer contentId
    );

    long countByPerson_PersonId(
            Integer personId
    );

    @Query("""
        SELECT DISTINCT cpr
        FROM ContentPersonRole cpr
        JOIN cpr.person p
        JOIN cpr.cinematicRole cr
        WHERE cpr.content.contentId = :contentId
        AND (
                LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(cpr.characterName) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(cr.code) LIKE LOWER(CONCAT('%', :search, '%'))
            )
        ORDER BY cpr.orderIndex ASC
    """)
    Page<ContentPersonRole> searchByContent(
            @Param("contentId") Integer contentId,
            @Param("search") String search,
            Pageable pageable
    );
   
}