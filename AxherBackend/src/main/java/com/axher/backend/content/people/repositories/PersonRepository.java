package com.axher.backend.content.people.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.people.entities.Person;

public interface PersonRepository
        extends JpaRepository<Person, Integer> {

    Optional<Person> findByFirstNameIgnoreCaseAndLastNameIgnoreCase(
            String firstName,
            String lastName
    );

    Page<Person> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
            String firstName,
            String lastName,
            Pageable pageable
    );

    boolean existsByFirstNameIgnoreCaseAndLastNameIgnoreCase(
            String firstName,
            String lastName
    );

    boolean existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndPersonIdNot(
            String firstName,
            String lastName,
            Integer personId
    );
}
