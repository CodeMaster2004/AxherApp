package com.axher.backend.support.reports.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.axher.backend.support.reports.entities.ProblemReport;

public interface ProblemReportRepository extends JpaRepository<ProblemReport, Integer>,
    JpaSpecificationExecutor<ProblemReport> {

    Page<ProblemReport> findByUser_UserIdOrderByReportedAtDesc(
        Integer userId,
        Pageable pageable
    );

    Optional<ProblemReport> findByReportIdAndUser_UserId(
        Integer reportId,
        Integer userId
    );

    long deleteByReportIdAndUser_UserIdAndReportStatus_Code(
        Integer reportId,
        Integer userId,
        String statusCode
    );

    Page<ProblemReport> findAllByOrderByReportedAtDesc(Pageable pageable);
    
}
