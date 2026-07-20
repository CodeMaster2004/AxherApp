package com.axher.backend.support.reports.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "report_status")
public class ReportStatus {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer reportStatusId;

        @Column(length = 50, nullable = false)
        private String status;

}

