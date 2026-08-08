package com.axher.backend.content.series.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.core.service.ContentService;
import com.axher.backend.content.series.entities.Series;
import com.axher.backend.content.series.repositories.SeriesRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SeriesService {
    
    private final SeriesRepository seriesRepository;
    private final ContentService contentService;

    @Transactional(readOnly = true)
    public Series findById(Integer id) {
        return seriesRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Serie no encontrada: " + id));
    }

    /*public Series findPublicById(Integer id) {

        Series serie = findByContentId(id);
        Content content = serie.getContent();

        if(!content.getContentStatus()
                .getStatus()
                .equalsIgnoreCase("PUBLISHED")){

            throw new ResourceNotFoundException(
                "Serie no disponible"
            );
                
        }
        return serie;
    }*/

    @Transactional(readOnly = true)
    public Series findPublicByIdd(Integer contentId) {

        return seriesRepository.findPublicByContentId(contentId)
            .orElseThrow(() -> new ResourceNotFoundException("Serie no encontrada"));
    }

    public Series findByContentId(Integer contentId){
        Content content = contentService.findById(contentId);

        if(!ContentTypeEnum.SERIE.equals(content.getType())){
            throw new ResourceNotFoundException("El contenido con ID " + contentId + "no es una serie");
        }
        return content.getSeries();
    }

    public void delete(Integer id){
        seriesRepository.deleteById(id);
    }
}
