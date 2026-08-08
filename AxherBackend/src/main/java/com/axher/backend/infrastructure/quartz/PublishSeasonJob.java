package com.axher.backend.infrastructure.quartz;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.stereotype.Component;

import com.axher.backend.content.series.service.SeasonsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@DisallowConcurrentExecution
@RequiredArgsConstructor
public class PublishSeasonJob implements Job{

    private final SeasonsService seasonsService;

    public void execute(JobExecutionContext context) {

        Integer seasonId = 
            context.getMergedJobDataMap()
                .getInt("seasonId");

        try {
            log.info("Iniciando publicacion automatica de la temporada {}", seasonId);
            seasonsService.publish(seasonId);
            log.info("Temporada {} publicada exitosamente", seasonId);
        } catch (Exception e) {
            log.error("Error al publicar la temporada {}", seasonId, e);
            throw new RuntimeException(e);
        }
    }
    
}
