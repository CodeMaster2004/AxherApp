package com.axher.backend.content.core.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.core.entities.Favorites;


public interface FavoritesRepository extends JpaRepository<Favorites, Integer> {

}
