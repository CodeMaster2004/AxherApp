package com.axher.backend.support.reports.entities;

import java.time.LocalDateTime;

import com.axher.backend.users.entities.Users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "problem_reports")
public class ProblemReports {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reportId;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Users userId;

    @Column(length = 100)
    private String category;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(columnDefinition = "DATETIME DEFAULT GETDATE()")
    private LocalDateTime reportedAt;

    // Relación con EstadosReportes
    @ManyToOne
    private ReportStatus reportStatusId;

}
