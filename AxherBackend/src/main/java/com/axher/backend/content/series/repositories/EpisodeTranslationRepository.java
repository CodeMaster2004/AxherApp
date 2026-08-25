package com.axher.backend.content.series.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.series.entities.EpisodeTranslation;

public interface EpisodeTranslationRepository extends JpaRepository<EpisodeTranslation, Integer> {

    Optional<EpisodeTranslation>
    findByEpisode_EpisodeIdAndLanguage_Code(
        Integer episodeId,
        String languageCode
    );

    List<EpisodeTranslation>
    findByEpisode_EpisodeId(
        Integer episodeId
    );

    boolean existsByEpisode_EpisodeIdAndLanguage_LanguageId(
        Integer episodeId,
        Integer languageId
    );

    Optional<EpisodeTranslation>
    findByEpisode_EpisodeIdAndLanguage_LanguageId(
        Integer episodeId,
        Integer languageId
    );

    void deleteByEpisode_EpisodeId(
        Integer episodeId
    );

}
