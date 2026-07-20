package com.axher.backend.support.reports.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.support.reports.entities.ReportStatus;

public interface ReportStatusRepository extends JpaRepository<ReportStatus, Integer> {

}
