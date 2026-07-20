package com.axher.backend.content.series.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.series.entities.Seasons;

public interface SeasonsRepository extends JpaRepository<Seasons, Integer> {
    // Obtener todas las temporadas por id de la serie
    Page<Seasons> findBySeries_ContentId(Integer contentId, Pageable pageable); 

    // Validar si ya existe una temporada con ese número en la serie
    boolean existsBySeries_ContentIdAndSeasonNumber(Integer contentId, Integer seasonNumber);

    List<Seasons> findBySeries_ContentIdAndReleaseDateBetween(Integer contentId, LocalDate start, LocalDate end);

    List<Seasons> findBySeries_ContentIdAndTitleContainingIgnoreCase(Integer contentId, String keyword);

    Optional<Seasons> findBySeasonIdAndSeries_ContentId(Integer seasonId, Integer seriesId);

    boolean existsBySeries_ContentIdAndSeasonNumberAndSeasonIdNot(Integer seriesId, Integer seasonNumber, Integer seasonId);
}

