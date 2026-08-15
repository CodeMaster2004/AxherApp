package com.axher.backend.support.tickets.entities;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    @Column(length = 100, nullable = false, unique = true)
    private String name;

    @Column(length = 200)
    private String description;
    
}
