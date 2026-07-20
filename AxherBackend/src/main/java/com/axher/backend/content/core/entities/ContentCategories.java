package com.axher.backend.content.core.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false,  length = 100)
    private String name;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String description;
    
}

