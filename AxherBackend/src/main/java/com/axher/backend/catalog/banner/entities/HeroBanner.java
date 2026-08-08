package com.axher.backend.catalog.banner.entities;

import java.time.LocalDateTime;

import com.axher.backend.content.core.entities.Content;

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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hero_banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HeroBanner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer heroBannerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(length = 100, nullable = true)
    private String titleOverride;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String descriptionOverride;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String backdropUrl;

    private Integer priority;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Boolean active;

    private LocalDateTime createdAt = LocalDateTime.now();
    
}
