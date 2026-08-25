package com.axher.backend.support.tickets.entities;


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
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "support_categories")
public class SupportCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer supportCategoryId;

    @Column(length = 50, nullable = false, unique = true)
    private String code;

    //@Column(length = 100, nullable = false, unique = true)
    //private String name;

    //@Column(length = 200)
    //private String description;

    @OneToMany(
        mappedBy = "supportCategory",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private Set<SupportCategoryTranslation> translations = new HashSet<>();
    
}
