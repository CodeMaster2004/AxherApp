package com.axher.backend.content.people.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.content.people.Dtos.CinematicRoleAiTranslationRequestDto;
import com.axher.backend.content.people.Dtos.CinematicRoleAiTranslationResponseDto;
import com.axher.backend.content.people.Dtos.CinematicRoleTranslationRequestDto;
import com.axher.backend.content.people.entities.CinematicRole;
import com.axher.backend.content.people.entities.CinematicRoleTranslation;
import com.axher.backend.content.people.repositories.CinematicRoleRepository;
import com.axher.backend.content.people.repositories.CinematicRoleTranslationRepository;
import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CinematicRoleTranslationService {

    private final CinematicRoleTranslationRepository translationRepository;
    private final CinematicRoleRepository roleRepository;
    private final LanguageRepository languageRepository;
    private final AiTranslationService aiTranslationService;


    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================

    public Optional<CinematicRoleTranslation> findByRoleAndLanguage(
            Integer roleId,
            String languageCode
    ) {

        return translationRepository
                .findByCinematicRole_CinematicRoleIdAndLanguage_Code(
                        roleId,
                        languageCode
                );
    }


    public Optional<CinematicRoleTranslation> findFirstAvailable(
            Integer roleId
    ) {

        return translationRepository
                .findFirstByCinematicRole_CinematicRoleId(
                        roleId
                );
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


    public boolean existsByNameAndLanguageAndRoleNot(
            String name,
            Integer languageId,
            Integer roleId
    ) {

        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageIdAndCinematicRole_CinematicRoleIdNot(
                        name,
                        languageId,
                        roleId
                );
    }
    
    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================
    public List<CinematicRoleTranslation> findByRole(
            Integer roleId
    ) {

        if (!roleRepository.existsById(roleId)) {
            throw new ResourceNotFoundException(
                    "Rol cinematográfico no encontrado: " + roleId
            );
        }

        return translationRepository
                .findByCinematicRole_CinematicRoleId(roleId);
    }


    // ==========================================
    // CREAR
    // ==========================================
    public CinematicRoleTranslation create(
            Integer roleId,
            CinematicRoleTranslationRequestDto dto
    ) {

        CinematicRole role = roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Rol cinematográfico no encontrado: "
                                        + roleId
                        )
                );

        Language language = languageRepository
                .findById(dto.getLanguageId())
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

        boolean exists =
                translationRepository
                        .existsByCinematicRole_CinematicRoleIdAndLanguage_LanguageId(
                                roleId,
                                language.getLanguageId()
                        );

        if (exists) {
            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        CinematicRoleTranslation translation =
                new CinematicRoleTranslation();

        translation.setCinematicRole(role);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }


    // ==========================================
    // ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================
    public CinematicRoleTranslation update(
            Integer roleId,
            Integer languageId,
            CinematicRoleTranslationRequestDto dto
    ) {

        CinematicRoleTranslation translation =
                translationRepository
                        .findByCinematicRole_CinematicRoleIdAndLanguage_LanguageId(
                                roleId,
                                languageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "La traducción no existe"
                                )
                        );

        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }


    // ==========================================
    // ELIMINAR UNA TRADUCCIÓN
    // ==========================================
    public void delete(
            Integer roleId,
            Integer languageId
    ) {

        if (!roleRepository.existsById(roleId)) {
            throw new ResourceNotFoundException(
                    "Rol cinematográfico no encontrado: "
                            + roleId
            );
        }

        CinematicRoleTranslation translation =
                translationRepository
                        .findByCinematicRole_CinematicRoleIdAndLanguage_LanguageId(
                                roleId,
                                languageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "La traducción no existe"
                                )
                        );

        translationRepository.delete(translation);
    }


    // ==========================================
    // TRADUCIR CON AI
    // ==========================================
    public CinematicRoleAiTranslationResponseDto translateWithAi(
            Integer roleId,
            Integer sourceLanguageId,
            CinematicRoleAiTranslationRequestDto dto
    ) {

        roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Rol cinematográfico no encontrado: "
                                        + roleId
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
                languageRepository
                        .findById(dto.getTargetLanguageId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Idioma destino no encontrado: "
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

        CinematicRoleTranslation sourceTranslation =
                translationRepository
                        .findByCinematicRole_CinematicRoleIdAndLanguage_LanguageId(
                                roleId,
                                sourceLanguageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No existe una traducción en el idioma origen"
                                )
                        );

        AiTranslationRequest request =
                new AiTranslationRequest(
                        sourceLanguage.getCode(),
                        targetLanguage.getCode(),
                        Map.of(
                                "name",
                                sourceTranslation.getName(),
                                "description",
                                sourceTranslation.getDescription() == null
                                        ? ""
                                        : sourceTranslation.getDescription()
                        )
                );

        AiTranslationResult result =
                aiTranslationService.translate(request);

        CinematicRoleAiTranslationResponseDto response =
                new CinematicRoleAiTranslationResponseDto();

        response.setSourceLanguageId(sourceLanguageId);
        response.setTargetLanguageId(
                targetLanguage.getLanguageId()
        );

        response.setSourceName(
                sourceTranslation.getName()
        );

        response.setSourceDescription(
                sourceTranslation.getDescription()
        );

        response.setTranslatedName(
                result.fields().get("name")
        );

        response.setTranslatedDescription(
                result.fields().get("description")
        );

        return response;
    }
}
