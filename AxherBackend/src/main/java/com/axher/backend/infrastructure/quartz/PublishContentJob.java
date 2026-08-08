package com.axher.backend.infrastructure.quartz;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.service.ContentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@DisallowConcurrentExecution
@RequiredArgsConstructor
public class PublishContentJob implements Job{
    
    private final ContentService contentService;
    
    @Override
    public void execute(JobExecutionContext context) {

        Integer contentId = 
            context.getMergedJobDataMap()
                .getInt("contentId");

        try {
            log.info("Iniciando publicacion automatica del contentido {}", contentId);
            contentService.publish(contentId);
            log.info("Contenido {} publicado exitosamente", contentId);
        } catch (Exception e) {
            log.error("Error al publicar el contenido {}", contentId, e);
            throw new RuntimeException(e);
        }


    }
}
