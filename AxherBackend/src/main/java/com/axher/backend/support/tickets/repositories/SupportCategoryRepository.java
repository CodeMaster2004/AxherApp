package com.axher.backend.support.tickets.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.support.tickets.entities.SupportCategory;

public interface SupportCategoryRepository extends JpaRepository<SupportCategory, Integer> {
    
}
