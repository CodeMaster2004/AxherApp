package com.axher.backend.catalog.shelf.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "content_shelves")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContentShelf {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer contentShelfId;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 100, nullable = false, unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ShelfTarget target;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private ShelfLayout layout;

    private Integer displayOrder;

    private Boolean active;

    private LocalDateTime createdAt;

    @OneToMany(
        mappedBy = "contentShelf",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<ShelfContent> shelfContents = new ArrayList<>();


    
}
