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
@Table(name = "seasons")
public class Seasons {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer seasonId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "series_content_id", nullable = false)
    private Series series;

    @Column(nullable = false)
    private Integer seasonNumber;

    /*@Column(length = 150)
    private String title;

    @Column(length = 500)
    private String description;*/

    @Column(name = "release_date")
    private Instant releaseDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_status_id")
    private ContentStatus contentStatus;

    @OneToMany(mappedBy = "season", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Episodes> episodes = new ArrayList<>();

    @OneToMany(
        mappedBy = "season",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private List<SeasonTranslation> translations = new ArrayList<>();
}
