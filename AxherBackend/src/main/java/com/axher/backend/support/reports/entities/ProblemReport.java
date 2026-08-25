package com.axher.backend.support.reports.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.users.entities.Users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
public class ProblemReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reportId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "report_category_id",
        nullable = false
    )
    private ReportCategory category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "content_id", nullable = true)
    private Content content;

    @ManyToOne
    @JoinColumn(name = "episode_id", nullable = true)
    private Episodes episode;

    @ManyToOne
    @JoinColumn(name = "report_status_id")
    private ReportStatus reportStatus;

    @CreationTimestamp
    private LocalDateTime reportedAt;

    @Column(nullable = true)
    private LocalDateTime resolvedAt;

   

   

}
