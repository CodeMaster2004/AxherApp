package com.axher.backend.content.series.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.series.entities.Series;

public interface SeriesRepository extends JpaRepository<Series, Integer> {

}
