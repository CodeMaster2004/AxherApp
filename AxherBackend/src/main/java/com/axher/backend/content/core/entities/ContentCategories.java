package com.axher.backend.content.core.entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "content_categories")
public class ContentCategories {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer contentCategoryId;

    /*@NotBlank
    @Size(max = 100)
    @Column(nullable = false,  length = 100)
    private String name;*/

    @Column(nullable = false, unique = true)
    private String slug;

    /*@NotBlank
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String description;*/

    @OneToMany(
        mappedBy = "contentCategory",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private Set<ContentCategoryTranslation> translations = new HashSet<>();
    
}

