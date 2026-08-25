package com.axher.backend.catalog.shelf.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.catalog.shelf.DTOs.ContentShelfTranslationRequestDto;
import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.catalog.shelf.entities.ContentShelfTranslation;
import com.axher.backend.catalog.shelf.repositories.ContentShelfRepository;
import com.axher.backend.catalog.shelf.repositories.ContentShelfTranslationRepository;
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
    // CREAR O ACTUALIZAR
    // ==========================================

    public ContentShelfTranslation save(
            Integer shelfId,
            ContentShelfTranslationRequestDto dto
    ) {

        ContentShelf shelf =
                shelfRepository.findById(shelfId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Shelf no encontrado: " + shelfId
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
                    "Idioma inactivo: " + dto.getLanguageId()
            );
        }

        ContentShelfTranslation translation =
                translationRepository
                        .findByContentShelf_ContentShelfIdAndLanguage_LanguageId(
                                shelfId,
                                language.getLanguageId()
                        )
                        .orElseGet(ContentShelfTranslation::new);

        translation.setContentShelf(shelf);
        translation.setLanguage(language);
        translation.setName(dto.getName());

        return translationRepository.save(translation);
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
