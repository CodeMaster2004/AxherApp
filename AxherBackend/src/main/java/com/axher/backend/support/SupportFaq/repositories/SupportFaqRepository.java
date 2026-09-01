package com.axher.backend.support.SupportFaq.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.support.SupportFaq.entities.SupportFaq;

public interface SupportFaqRepository extends JpaRepository<SupportFaq, Integer>, JpaSpecificationExecutor<SupportFaq> {

    @Query("""
        SELECT DISTINCT sf
        FROM SupportFaq sf
        LEFT JOIN sf.translations t
        LEFT JOIN sf.supportCategory sc
        WHERE
            LOWER(sc.code) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(t.question) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(t.answer) LIKE LOWER(CONCAT('%', :search, '%'))
    """)
    Page<SupportFaq> search(
        @Param("search") String search,
        Pageable pageable
    );

    Page<SupportFaq> findByActiveTrue(Pageable pageable);

    Page<SupportFaq> findBySupportCategory_SupportCategoryId(
        Integer supportCategoryId,
        Pageable pageable
    );

    Page<SupportFaq> findBySupportCategory_SupportCategoryIdAndActiveTrue(
        Integer supportCategoryId,
        Pageable pageable
    );

    Page<SupportFaq> findAllByOrderByDisplayOrderAsc(
            Pageable pageable
    );

    List<SupportFaq> findBySupportCategory_SupportCategoryIdOrderByDisplayOrderAsc(
            Integer supportCategoryId
    );

    List<SupportFaq> findByActiveTrueOrderByDisplayOrderAsc();

    Optional<SupportFaq> findBySupportFaqIdAndActiveTrue(Integer supportFaqId);
}
