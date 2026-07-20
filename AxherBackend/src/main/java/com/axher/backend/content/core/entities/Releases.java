package com.axher.backend.content.core.entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "releases")
public class Releases {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer releaseId;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Content content;

    @Column(nullable = false)
    private Integer contentId; 

    @Column(nullable = false, columnDefinition = "DATE")
    private LocalDate releaseDate;
}
