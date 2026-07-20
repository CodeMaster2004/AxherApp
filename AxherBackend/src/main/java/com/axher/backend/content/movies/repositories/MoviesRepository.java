package com.axher.backend.content.movies.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.movies.entities.Movies;

public interface MoviesRepository extends JpaRepository<Movies, Integer> {


}

