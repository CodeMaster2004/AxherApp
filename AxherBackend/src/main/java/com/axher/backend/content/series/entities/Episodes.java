package com.axher.backend.content.series.entities;

import java.time.LocalDateTime;

import com.axher.backend.content.core.entities.ContentStatus;

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
@Table(name = "episodes")
public class Episodes {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer episodeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    private Seasons season;

    @Column(nullable = false)
    private Integer episodeNumber;

    @Column(length = 150)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String thumbnailUrl;

    @Column(name = "episode_url", nullable = false, columnDefinition = "TEXT")
    private String episodeUrl;

    @Column(name = "release_date")
    private LocalDateTime releaseDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_status_id")
    private ContentStatus contentStatus;
}

