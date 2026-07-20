package com.axher.backend.support.reports.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.support.reports.entities.ProblemReports;

public interface ProblemReportsRepository extends JpaRepository<ProblemReports, Integer> {

    
}
