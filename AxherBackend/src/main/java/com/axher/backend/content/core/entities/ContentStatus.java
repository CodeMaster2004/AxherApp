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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "content_status")
public class ContentStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer contentStatusId;

    @NotBlank
    @Size(max = 20)
    @Column(unique = true, length = 20, nullable = false)
    private String code;

    /*@NotBlank
    @Size(max = 100)
    @Column(length = 100)
    private String name;

    @Size(max = 200)
    @Column(length = 200, nullable = true)
    private String description;*/

     @OneToMany(
        mappedBy = "contentStatus",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private Set<ContentStatusTranslation> translations = new HashSet<>();


}
