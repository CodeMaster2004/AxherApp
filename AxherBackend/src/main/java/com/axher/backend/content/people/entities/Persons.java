package com.axher.backend.content.people.entities;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "persons")
public class Persons {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer personId;

    @Column(length = 100, nullable = false)
    private String firstName;

    @Column(length = 100, nullable = true)
    private String lastName;

    @Column(nullable = true)
    private Date birthDate;

    @Column(length = 100, nullable = true)
    private String nationality;

    @Column(columnDefinition = "NVARCHAR(MAX)", nullable = true)
    private String bio;

    @Column(columnDefinition = "NVARCHAR(MAX)", nullable = true)
    private String photo;

}
