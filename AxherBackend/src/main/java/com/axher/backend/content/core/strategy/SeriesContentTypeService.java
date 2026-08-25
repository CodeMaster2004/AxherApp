package com.axher.backend.content.core.strategy;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.media.service.VideoMetadataService;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.CreateEpisodeRequestDto;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.UpdateEpisodeRequestDto;
import com.axher.backend.content.series.DTOs.SeriesDTOs.CreateSeriesRequestDto;
import com.axher.backend.content.series.DTOs.SeriesDTOs.UpdateSeriesRequestDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.CreateSeasonRequestDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.UpdateSeasonRequestDto;
import com.axher.backend.content.series.entities.EpisodeTranslation;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.entities.SeasonTranslation;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.entities.Series;
import com.axher.backend.content.series.repositories.EpisodeTranslationRepository;
import com.axher.backend.content.series.repositories.EpisodesRepository;
import com.axher.backend.content.series.repositories.SeasonTranslationRepository;
import com.axher.backend.content.series.repositories.SeasonsRepository;
import com.axher.backend.content.series.repositories.SeriesRepository;
import com.axher.backend.infrastructure.storage.FileStorageService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeriesContentTypeService implements ContentTypeService{
    
    private final SeriesRepository seriesRepository;
    private final SeasonsRepository seasonRepository;
    private final FileStorageService fileStorageService;
    private final EpisodesRepository episodesRepository;
    private final VideoMetadataService videoMetadataService;
    private final SeasonTranslationRepository seasonTranslationRepository;
    private final EpisodeTranslationRepository episodeTranslationRepository;


    public ContentTypeEnum getType() {
        return ContentTypeEnum.SERIE;
    }

    @Transactional
    public void create(Content content, Object dtoObj){
        
        CreateSeriesRequestDto dto = (CreateSeriesRequestDto) dtoObj;

        Series series = new Series();
        series.setContent(content);

        seriesRepository.save(series);

        if(dto.getSeasons() != null){
            for(CreateSeasonRequestDto seasonDto : dto.getSeasons()){
                Seasons season = new Seasons();
                season.setSeries(series);
                season.setSeasonNumber(seasonDto.getSeasonNumber());
                season.setReleaseDate(seasonDto.getReleaseDate());
                seasonRepository.save(season);

                // Crear traduccion original
                SeasonTranslation seasonTranslation = new SeasonTranslation();
                seasonTranslation.setSeason(season);
                seasonTranslation.setLanguage(
                        content.getOriginalLanguage()
                );
                seasonTranslation.setTitle(
                        seasonDto.getTitle()
                );
                seasonTranslation.setDescription(
                        seasonDto.getDescription()
                );

                seasonTranslationRepository.save(
                        seasonTranslation
                );


                if(seasonDto.getEpisodes() != null){
                    for(CreateEpisodeRequestDto episodeDto : seasonDto.getEpisodes()){
                        Episodes episode = new Episodes();
                        episode.setSeason(season);
                        episode.setEpisodeNumber(episodeDto.getEpisodeNumber());
                        String thumbnailUrl = fileStorageService.saveFile(episodeDto.getThumbnailFile(), "episodes");
                        episode.setThumbnailUrl(thumbnailUrl);
                        String url = fileStorageService.saveFile(episodeDto.getEpisodeFile(), "episodes");
                        Integer duration = videoMetadataService.getDurationMinutes(fileStorageService.getAbsolutePath(url));
                        episode.setDurationSeconds(duration);
                        episode.setEpisodeUrl(url);
                        episode.setReleaseDate(episodeDto.getReleaseDate());
                        
                        episodesRepository.save(episode);

                        // Crear traducción original del episodio
                        EpisodeTranslation episodeTranslation =
                                new EpisodeTranslation();

                        episodeTranslation.setEpisode(episode);
                        episodeTranslation.setLanguage(
                                content.getOriginalLanguage()
                        );
                        episodeTranslation.setTitle(
                                episodeDto.getTitle()
                        );
                        episodeTranslation.setDescription(
                                episodeDto.getDescription()
                        );

                        episodeTranslationRepository.save(
                                episodeTranslation
                        );
                    }
                }
            }
        }
    }

    @Transactional
    public void update(Content content, Object dtoObj){

        UpdateSeriesRequestDto dto = (UpdateSeriesRequestDto) dtoObj;

        Series series = content.getSeries();

        if(series == null){
            throw new IllegalStateException("El contenido no tiene serie asociada");
        }

        for(UpdateSeasonRequestDto seasonDto : dto.getSeasons()){
            Seasons season = series.getSeasons().stream()
                .filter(s -> s.getSeasonId().equals(seasonDto.getSeasonId()))
                .findFirst()
                .orElseGet(() -> {
                    Seasons newSeason = new Seasons();
                    newSeason.setSeries(series);
                    series.getSeasons().add(newSeason);
                    return newSeason;
                });
            season.setSeries(series);
            season.setSeasonNumber(seasonDto.getSeasonNumber());
            season.setReleaseDate(seasonDto.getReleaseDate());
            SeasonTranslation seasonTranslation =
                seasonTranslationRepository
                    .findBySeason_SeasonIdAndLanguage_LanguageId(
                        season.getSeasonId(),
                        content.getOriginalLanguage().getLanguageId()
                    )
                    .orElseThrow(() -> new IllegalStateException(
                        "Traducción original no encontrada para la temporada: "
                        + season.getSeasonId()
                    ));

            seasonTranslation.setTitle(seasonDto.getTitle());
            seasonTranslation.setDescription(seasonDto.getDescription());

            // Manejar episodios de la temporada
            for(UpdateEpisodeRequestDto episodeDto : seasonDto.getEpisodes()){
                Episodes episode = season.getEpisodes().stream()
                    .filter(e -> e.getEpisodeId().equals(episodeDto.getEpisodeId()))
                    .findFirst()
                   .orElseGet(() -> {
                        Episodes newEpisode = new Episodes();
                        newEpisode.setSeason(season);
                        season.getEpisodes().add(newEpisode);
                        return newEpisode;
                    });
                episode.setSeason(season);
                episode.setEpisodeNumber(episodeDto.getEpisodeNumber());
                EpisodeTranslation episodeTranslation =
                    episodeTranslationRepository
                        .findByEpisode_EpisodeIdAndLanguage_LanguageId(
                            episode.getEpisodeId(),
                            content.getOriginalLanguage().getLanguageId()
                        )
                        .orElseThrow(() -> new IllegalStateException(
                            "Traducción original no encontrada para el episodio: "
                            + episode.getEpisodeId()
                        ));

                episodeTranslation.setTitle(episodeDto.getTitle());
                episodeTranslation.setDescription(episodeDto.getDescription());
                // Guardar archivo si viene nuevo
                if(episodeDto.getThumbnailFile() != null && !episodeDto.getThumbnailFile().isEmpty()){
                    String newThumbnail = fileStorageService.saveFile(episodeDto.getThumbnailFile(), "episodes");
                    fileStorageService.deleteFile(episode.getThumbnailUrl());
                    episode.setThumbnailUrl(newThumbnail);
                }
                if(episodeDto.getEpisodeFile() != null && !episodeDto.getEpisodeFile().isEmpty()){
                    String newTrailer = fileStorageService.saveFile(episodeDto.getEpisodeFile(), "episodes");

                    Integer duration = videoMetadataService.getDurationMinutes(fileStorageService.getAbsolutePath(newTrailer));

                    fileStorageService.deleteFile(episode.getEpisodeUrl());
                    
                    episode.setEpisodeUrl(newTrailer);
                    episode.setDurationSeconds(duration);
                }
               
            }
        }
        // 2️⃣ Eliminar temporadas que no están en el DTO
        series.getSeasons().removeIf(s -> 
            dto.getSeasons().stream().noneMatch(d -> d.getSeasonId().equals(s.getSeasonId()))
        );

        // 3️⃣ Eliminar episodios que no están en el DTO
        for(Seasons seasonItem : series.getSeasons()){
            UpdateSeasonRequestDto seasonDtoItem = dto.getSeasons().stream()
                .filter(d -> d.getSeasonId().equals(seasonItem.getSeasonId()))
                .findFirst().orElse(null);

            if(seasonDtoItem != null){
                seasonItem.getEpisodes().removeIf(ep ->
                    seasonDtoItem.getEpisodes().stream()
                        .noneMatch(e -> e.getEpisodeId().equals(ep.getEpisodeId()))
                );
            }
        }
    }

    @Transactional
    public void delete(Content content){
        Series series = content.getSeries();

        if(series != null){

            for(Seasons season : series.getSeasons()){
                for(Episodes episode : season.getEpisodes()){

                    if(episode.getThumbnailUrl() != null){
                        fileStorageService.deleteFile(episode.getThumbnailUrl());
                    }

                    if(episode.getEpisodeUrl() != null){
                        fileStorageService.deleteFile(episode.getEpisodeUrl());
                    }
                }
            }
            seriesRepository.delete(series);
        }
    }
}

