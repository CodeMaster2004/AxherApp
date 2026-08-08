package com.axher.backend.content.core.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.axher.backend.content.movies.entities.Movies;
import com.axher.backend.content.series.entities.Series;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "content")
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer contentId;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private ContentTypeEnum type;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String posterUrl;

    @Column(nullable = false)
    private String backdropUrl;
    
    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String trailerUrl;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;  

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "content_categories_map", 
        joinColumns = @JoinColumn(name = "content_id"), 
        inverseJoinColumns = @JoinColumn(name = "content_category_id"))
    private Set<ContentCategories> categories = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_status_id")
    private ContentStatus contentStatus;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discount_id")
    private Discounts discount;  

    private LocalDateTime releaseDate;

    @Column(name = "registered_at", insertable = false, updatable = false)
    private LocalDate registeredAt;

    @OneToOne(mappedBy = "content")
    private Movies movie;

    @OneToOne(mappedBy = "content")
    private Series series;
}
