package com.axher.backend.catalog.shelf.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.catalog.shelf.DTOs.ContentShelfAiTranslationRequestDto;
import com.axher.backend.catalog.shelf.DTOs.ContentShelfAiTranslationResponseDto;
import com.axher.backend.catalog.shelf.DTOs.ContentShelfTranslationRequestDto;
import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.catalog.shelf.entities.ContentShelfTranslation;
import com.axher.backend.catalog.shelf.repositories.ContentShelfRepository;
import com.axher.backend.catalog.shelf.repositories.ContentShelfTranslationRepository;
import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentShelfTranslationService {

    private final ContentShelfTranslationRepository translationRepository;
    private final ContentShelfRepository shelfRepository;
    private final LanguageRepository languageRepository;
    private final AiTranslationService aiTranslationService;

    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================

    public Optional<ContentShelfTranslation> findByShelfAndLanguage(
            Integer shelfId,
            String languageCode
    ) {
        return translationRepository
                .findByContentShelf_ContentShelfIdAndLanguage_Code(
                        shelfId,
                        languageCode
                );
    }

    public Optional<ContentShelfTranslation> findFirstAvailable(
            Integer shelfId
    ) {
        return translationRepository
                .findFirstByContentShelf_ContentShelfId(
                        shelfId
                );
    }

    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================

    public List<ContentShelfTranslation> findByShelf(
            Integer shelfId
    ) {

        if (!shelfRepository.existsById(shelfId)) {
            throw new ResourceNotFoundException(
                    "Shelf no encontrado: " + shelfId
            );
        }

        return translationRepository
                .findByContentShelf_ContentShelfId(shelfId);
    }

    // ==========================================
    // VALIDAR NOMBRE
    // ==========================================

    public boolean existsByNameAndLanguage(
            String name,
            Integer languageId
    ) {
        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageId(
                        name,
                        languageId
                );
    }

    public boolean existsByNameAndLanguageAndShelfNot(
            String name,
            Integer languageId,
            Integer shelfId
    ) {
        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageIdAndContentShelf_ContentShelfIdNot(
                        name,
                        languageId,
                        shelfId
                );
    }

    // ==========================================
    // CREAR TRADUCCIÓN
    // ==========================================
    public ContentShelfTranslation create(
            Integer shelfId,
            ContentShelfTranslationRequestDto dto
    ) {

        ContentShelf shelf = shelfRepository.findById(shelfId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Shelf no encontrado: " + shelfId
                        )
                );

        Language language = languageRepository.findById(
                dto.getLanguageId()
        ).orElseThrow(() ->
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

        boolean exists =
                translationRepository
                        .existsByContentShelf_ContentShelfIdAndLanguage_LanguageId(
                                shelfId,
                                language.getLanguageId()
                        );

        if (exists) {
            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        ContentShelfTranslation translation =
                new ContentShelfTranslation();

        translation.setContentShelf(shelf);
        translation.setLanguage(language);
        translation.setName(dto.getName());

        return translationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================
    public ContentShelfTranslation update(
            Integer shelfId,
            Integer languageId,
            ContentShelfTranslationRequestDto dto
    ) {

        ContentShelfTranslation translation =
                translationRepository
                        .findByContentShelf_ContentShelfIdAndLanguage_LanguageId(
                                shelfId,
                                languageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "La traducción no existe"
                                )
                        );

        translation.setName(dto.getName());

        return translationRepository.save(translation);
    }

    // ==========================================
    // TRADUCIR CON AI
    // ==========================================

    public ContentShelfAiTranslationResponseDto translateWithAi(
            Integer shelfId,
            Integer sourceLanguageId,
            ContentShelfAiTranslationRequestDto dto
    ) {

        
        shelfRepository.findById(shelfId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Shelf no encontrado: " + shelfId
                        )
                );


        Language sourceLanguage =
                languageRepository.findById(sourceLanguageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Idioma origen no encontrado: "
                                                + sourceLanguageId
                                )
                        );

        Language targetLanguage =
                languageRepository.findById(
                        dto.getTargetLanguageId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Idioma de destino no encontrado: "
                                        + dto.getTargetLanguageId()
                        )
                );

        if (!Boolean.TRUE.equals(sourceLanguage.getActive())) {

            throw new IllegalArgumentException(
                    "Idioma origen esta inactivo: "
                            + sourceLanguage.getCode()
            );
        }

        if (!Boolean.TRUE.equals(targetLanguage.getActive())) {

            throw new IllegalArgumentException(
                    "Idioma destino esta inactivo: "
                            + targetLanguage.getCode()
            );
        }


        if (sourceLanguage.getLanguageId()
                .equals(targetLanguage.getLanguageId())) {

            throw new IllegalArgumentException(
                    "El idioma origen y destino no pueden ser iguales"
            );
        }


        ContentShelfTranslation sourceTranslation =
                translationRepository
                        .findByContentShelf_ContentShelfIdAndLanguage_LanguageId(
                                shelfId,
                                sourceLanguageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No existe una traducción "
                                                + "en el idioma origen"
                                )
                        );

        AiTranslationRequest request =
                new AiTranslationRequest(
                        sourceLanguage.getCode(),
                        targetLanguage.getCode(),
                        Map.of(
                                "name",
                                sourceTranslation.getName()
                        )
                );

        AiTranslationResult result =
                aiTranslationService.translate(request);



        ContentShelfAiTranslationResponseDto response =
                new ContentShelfAiTranslationResponseDto();

        response.setSourceLanguageId(sourceLanguageId);

        response.setTargetLanguageId(
                targetLanguage.getLanguageId()
        );

        response.setSourceName(
                sourceTranslation.getName()
        );

        response.setTranslatedName(
                result.fields().get("name")
        );

        return response;
    }



    // ==========================================
    // ELIMINAR
    // ==========================================

    public void delete(
            Integer shelfId,
            Integer languageId
    ) {

        if (!shelfRepository.existsById(shelfId)) {
            throw new ResourceNotFoundException(
                    "Shelf no encontrado: " + shelfId
            );
        }

        ContentShelfTranslation translation =
                translationRepository
                        .findByContentShelf_ContentShelfIdAndLanguage_LanguageId(
                                shelfId,
                                languageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "La traducción no existe"
                                )
                        );

        translationRepository.delete(translation);
    }
}
