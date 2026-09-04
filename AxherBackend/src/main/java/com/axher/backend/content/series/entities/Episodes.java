package com.axher.backend.content.series.entities;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.axher.backend.content.core.entities.ContentStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String thumbnailUrl;

    @Column(name = "episode_url", nullable = false, columnDefinition = "TEXT")
    private String episodeUrl;

    @Column(name = "release_date")
    private Instant releaseDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_status_id")
    private ContentStatus contentStatus;

    @OneToMany(
        mappedBy = "episode",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private List<EpisodeTranslation> translations = new ArrayList<>();
}

