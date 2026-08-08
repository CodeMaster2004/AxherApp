package com.axher.backend.infrastructure.quartz;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.stereotype.Component;

import com.axher.backend.content.series.service.EpisodesService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@DisallowConcurrentExecution
@RequiredArgsConstructor
public class PublishEpisodeJob implements Job{

    private final EpisodesService episodesService;

    public void execute(JobExecutionContext context) {

        Integer episodeId = 
            context.getMergedJobDataMap()
                .getInt("episodeId");

        try {
            log.info("Iniciando publicacion automaticamente del episodio {}", episodeId);
            episodesService.publish(episodeId);
            log.info("Episodio {} publicado exitosamente", episodeId);
        } catch (Exception e) {
            log.error("Error al publicar el episodio {}", episodeId, e);
            throw new RuntimeException(e);
        }
    }
    
}
