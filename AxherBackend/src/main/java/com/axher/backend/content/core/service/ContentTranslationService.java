package com.axher.backend.content.core.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.ContentAiTranslationRequestDto;
import com.axher.backend.content.core.DTOs.ContentAiTranslationResponseDto;
import com.axher.backend.content.core.DTOs.ContentTranslationRequestDto;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTranslation;
import com.axher.backend.content.core.repositories.ContentRepository;
import com.axher.backend.content.core.repositories.ContentTranslationRepository;
import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
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
    private final AiTranslationService aiTranslationService;

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
    // CREAR TRADUCCIÓN
    // ==========================================
    public ContentTranslation create(
            Integer contentId,
            ContentTranslationRequestDto dto
    ) {
        Content content =
                contentRepository.findById(contentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contenido no encontrado: "
                                                + contentId
                                )
                        );

        Language language =
                languageRepository.findById(dto.getLanguageId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Idioma no encontrado: "
                                                + dto.getLanguageId()
                                )
                        );

        if (!Boolean.TRUE.equals(language.getActive())) {
            throw new IllegalArgumentException(
                    "Idioma inactivo: " + language.getCode()
            );
        }

        // ==========================================
        // EL IDIOMA ORIGINAL NO ES UNA TRADUCCIÓN
        // ==========================================

        if (content.getOriginalLanguage()
                .getLanguageId()
                .equals(language.getLanguageId())) {

            throw new IllegalArgumentException(
                    "No se puede crear una traducción "
                            + "para el idioma original del contenido"
            );
        }

        boolean exists =
                contentTranslationRepository
                        .findByContent_ContentIdAndLanguage_LanguageId(
                                contentId,
                                language.getLanguageId()
                        )
                        .isPresent();

        if (exists) {
            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        ContentTranslation translation =
                new ContentTranslation();

        translation.setContent(content);
        translation.setLanguage(language);
        translation.setTitle(dto.getTitle());
        translation.setDescription(dto.getDescription());

        return contentTranslationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR TRADUCCIÓN
    // ==========================================
    public ContentTranslation update(
            Integer contentId,
            Integer languageId,
            ContentTranslationRequestDto dto
    ) {
        Content content =
                contentRepository.findById(contentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Contenido no encontrado: "
                                                + contentId
                                )
                        );

        // ==========================================
        // EL IDIOMA ORIGINAL NO PUEDE ACTUALIZARSE
        // COMO TRADUCCIÓN
        // ==========================================

        if (content.getOriginalLanguage()
                .getLanguageId()
                .equals(languageId)) {

            throw new IllegalArgumentException(
                    "El idioma original del contenido "
                            + "no es una traducción"
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

        translation.setTitle(dto.getTitle());
        translation.setDescription(dto.getDescription());

        return contentTranslationRepository.save(translation);
    }

    // ==========================================
    // TRADUCIR CON AI
    // ==========================================
    public ContentAiTranslationResponseDto translateWithAi(
            Integer contentId,
            Integer sourceLanguageId,
            ContentAiTranslationRequestDto dto
    ) {

        Content content = contentRepository.findById(contentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contenido no encontrado: " + contentId
                        )
                );

        Language sourceLanguage = languageRepository.findById(sourceLanguageId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Idioma origen no encontrado: "
                                        + sourceLanguageId
                        )
                );

        Language targetLanguage = languageRepository.findById(
                dto.getTargetLanguageId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Idioma de destino no encontrado: "
                                + dto.getTargetLanguageId()
                )
        );

        if (!Boolean.TRUE.equals(sourceLanguage.getActive())) {
            throw new IllegalArgumentException(
                    "Idioma origen está inactivo: "
                            + sourceLanguage.getCode()
            );
        }

        if (!Boolean.TRUE.equals(targetLanguage.getActive())) {
            throw new IllegalArgumentException(
                    "Idioma destino está inactivo: "
                            + targetLanguage.getCode()
            );
        }

        if (sourceLanguage.getLanguageId()
                .equals(targetLanguage.getLanguageId())) {

            throw new IllegalArgumentException(
                    "El idioma origen y destino no pueden ser iguales"
            );
        }

        ContentTranslation sourceTranslation =
                contentTranslationRepository
                        .findByContent_ContentIdAndLanguage_LanguageId(
                                contentId,
                                sourceLanguageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No existe una traducción en el idioma origen"
                                )
                        );

        // ==========================================
        // PREPARAR CONTENIDO PARA LA IA
        // ==========================================

        AiTranslationRequest request =
                new AiTranslationRequest(
                        sourceLanguage.getCode(),
                        targetLanguage.getCode(),
                        Map.of(
                                "title",
                                sourceTranslation.getTitle(),

                                "description",
                                sourceTranslation.getDescription()
                        )
                );

        // ==========================================
        // EJECUTAR TRADUCCIÓN
        // ==========================================

        AiTranslationResult result =
                aiTranslationService.translate(request);

        // ==========================================
        // CONSTRUIR RESPUESTA
        // ==========================================

        ContentAiTranslationResponseDto response =
                new ContentAiTranslationResponseDto();

        response.setSourceLanguageId(sourceLanguageId);

        response.setTargetLanguageId(
                targetLanguage.getLanguageId()
        );

        response.setSourceTitle(
                sourceTranslation.getTitle()
        );

        response.setSourceDescription(
                sourceTranslation.getDescription()
        );

        response.setTranslatedTitle(
                result.fields().get("title")
        );

        response.setTranslatedDescription(
                result.fields().get("description")
        );

        return response;
    }


    // ==========================================
    // ELIMINAR TRADUCCIÓN
    // ==========================================
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
