package com.axher.backend.content.core.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentStatus;
import com.axher.backend.content.core.entities.ContentStatusCode;
import com.axher.backend.content.core.repositories.ContentRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ContentPublicationService {
    
    private final ContentRepository contentRepository;
    private final ContentStatusService statusService;

    public void publishScheduledContent() {

        List<Content> contents =
                contentRepository.findByContentStatus_CodeAndReleaseDateLessThanEqual(
                    ContentStatusCode.UPCOMING.name(),
                    LocalDateTime.now()
                );
        if(contents.isEmpty()) {
            return;
        }
        log.info("Publicando {} contenidos programados", contents.size());

        ContentStatus published = 
                statusService.getStatus(ContentStatusCode.PUBLISHED);

        contents.forEach(content -> content.setContentStatus(published));
        contentRepository.saveAll(contents);
    }
}
