package com.axher.backend.content.core.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.ContentTranslationRequestDto;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTranslation;
import com.axher.backend.content.core.repositories.ContentRepository;
import com.axher.backend.content.core.repositories.ContentTranslationRepository;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentTranslationService {

    private final ContentTranslationRepository contentTranslationRepository;
    private final ContentRepository contentRepository;
    private final LanguageRepository languageRepository;

    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================
    public Optional<ContentTranslation> findByContentAndLanguage(
            Integer contentId,
            String languageCode
    ) {
        return contentTranslationRepository
                .findByContent_ContentIdAndLanguage_Code(
                        contentId,
                        languageCode
                );
    }

    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================
    public List<ContentTranslation> findByContent(Integer contentId) {
        if(!contentRepository.existsById(contentId)){
                throw new ResourceNotFoundException(
                        "Contenido no encontrado: " + contentId
                );
        }
        return contentTranslationRepository.findByContent_ContentId(contentId);
    }

    // ==========================================
    // CREAR O ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================
    public ContentTranslation save(
        Integer contentId,
        ContentTranslationRequestDto dto
    ){
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contenido no encontrado: " + contentId
                        )
                );

        Language language = languageRepository.findById(dto.getLanguageId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Idioma no encontrado: " + dto.getLanguageId()
                        )
                );

        if(!Boolean.TRUE.equals(language.getActive())){
                throw new IllegalArgumentException(
                        "Idioma inactivo: " + dto.getLanguageId()
                );
        }

        // No permitimos traducir al idioma original del contenido
        if(content.getOriginalLanguage().getLanguageId().equals(language.getLanguageId())){
                throw new IllegalArgumentException(
                        "No se puede crear una traduccion "
                        + "para el idioma original del contenido"
                );
        }

        ContentTranslation translation = contentTranslationRepository
                .findByContent_ContentIdAndLanguage_LanguageId(
                        contentId,
                        language.getLanguageId()
                ).orElseGet(ContentTranslation::new);
        translation.setContent(content);
        translation.setLanguage(language);
        translation.setTitle(dto.getTitle());
        translation.setDescription(dto.getDescription());

        return contentTranslationRepository.save(translation);
        
    }

    public void delete(Integer contentId, Integer languageId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contenido no encontrado: " + contentId
                        )
                );

        if(content.getOriginalLanguage().getLanguageId().equals(languageId)){
                throw new IllegalArgumentException(
                        "No se puede eliminar el idioma original"
                );
        }

        
        ContentTranslation translation =
            contentTranslationRepository
                .findByContent_ContentIdAndLanguage_LanguageId(
                    contentId,
                    languageId
                )
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "La traducción no existe"
                    )
                );
        contentTranslationRepository.delete(translation);
    }
    

    
}
