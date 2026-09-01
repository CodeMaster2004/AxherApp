package com.axher.backend.support.SupportFaq.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.support.SupportFaq.DTOs.SupportFaqAiTranslationRequestDto;
import com.axher.backend.support.SupportFaq.DTOs.SupportFaqAiTranslationResponseDto;
import com.axher.backend.support.SupportFaq.DTOs.SupportFaqTranslationRequestDto;
import com.axher.backend.support.SupportFaq.entities.SupportFaq;
import com.axher.backend.support.SupportFaq.entities.SupportFaqTranslation;
import com.axher.backend.support.SupportFaq.repositories.SupportFaqRepository;
import com.axher.backend.support.SupportFaq.repositories.SupportFaqTranslationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupportFaqTranslationService {

    private final SupportFaqTranslationRepository translationRepository;
    private final SupportFaqRepository faqRepository;
    private final LanguageRepository languageRepository;
    private final AiTranslationService aiTranslationService;
    
    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================
    public Optional<SupportFaqTranslation> findByFaqAndLanguage(
            Integer faqId,
            String languageCode
    ) {
        return translationRepository
                .findBySupportFaq_SupportFaqIdAndLanguage_Code(
                        faqId,
                        languageCode
                );
    }


    public Optional<SupportFaqTranslation> findFirstAvailable(
            Integer faqId
    ) {
        return translationRepository
                .findFirstBySupportFaq_SupportFaqId(faqId);
    }


    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================
    public List<SupportFaqTranslation> findByFaq(
            Integer faqId
    ) {
        if (!faqRepository.existsById(faqId)) {
            throw new ResourceNotFoundException(
                    "FAQ de soporte no encontrado: " + faqId
            );
        }

        return translationRepository
                .findBySupportFaq_SupportFaqId(faqId);
    }


    // ==========================================
    // CREAR
    // ==========================================
    public SupportFaqTranslation create(
        Integer faqId,
        SupportFaqTranslationRequestDto dto
    ){
        SupportFaq faq = faqRepository.findById(faqId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "FAQ de soporte no encontrado: " + faqId
                    )
            );

        Language language = languageRepository.findById(dto.getLanguageId())
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Idioma no encontrado: " + dto.getLanguageId()
                    )
            );

        if (!Boolean.TRUE.equals(language.getActive())) {
                throw new IllegalArgumentException(
                        "Idioma inactivo: " + language.getCode()
                );
        }

        boolean exists =
            translationRepository
                    .existsBySupportFaq_SupportFaqIdAndLanguage_LanguageId(
                            faqId,
                            language.getLanguageId()
                    );

        if (exists) {
                throw new IllegalStateException(
                        "Ya existe una traducción para el idioma: "
                                + language.getCode()
                );
        }

        SupportFaqTranslation translation = new SupportFaqTranslation();
        translation.setSupportFaq(faq);
        translation.setLanguage(language);
        translation.setQuestion(dto.getQuestion());
        translation.setAnswer(dto.getAnswer());

        return translationRepository.save(translation);
    
    }

    // ==========================================
    // ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================
    public SupportFaqTranslation update(
        Integer faqId,
        Integer languageId,
        SupportFaqTranslationRequestDto dto
    ){
        SupportFaqTranslation translation =
            translationRepository
                    .findBySupportFaq_SupportFaqIdAndLanguage_LanguageId(
                            faqId,
                            languageId
                    )
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "La traducción no existe"
                            )
                    );
        translation.setQuestion(dto.getQuestion());
        translation.setAnswer(dto.getAnswer());

        return translationRepository.save(translation);
    }


    // ==========================================
    // ELIMINAR UNA TRADUCCIÓN
    // ==========================================
    public void delete(
            Integer faqId,
            Integer languageId
    ) {

        if (!faqRepository.existsById(faqId)) {
            throw new ResourceNotFoundException(
                    "FAQ de soporte no encontrado: " + faqId
            );
        }


        SupportFaqTranslation translation =
                translationRepository
                        .findBySupportFaq_SupportFaqIdAndLanguage_LanguageId(
                                faqId,
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
    public SupportFaqAiTranslationResponseDto translateWithAi(
        Integer faqId,
        Integer sourceLanguageId,
        SupportFaqAiTranslationRequestDto dto
    ){

        faqRepository.findById(faqId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "FAQ de soporte no encontrado: " + faqId
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
                languageRepository.findById(dto.getTargetLanguageId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Idioma de destino no encontrado: "
                                                + dto.getTargetLanguageId()
                                )
                        );

        if (!Boolean.TRUE.equals(sourceLanguage.getActive())){
                throw new IllegalArgumentException(
                        "Idioma origen esta inactivo: " + sourceLanguage.getCode()
                );
        }

        if (!Boolean.TRUE.equals(targetLanguage.getActive())){
            throw new IllegalArgumentException(
                    "Idioma destino esta inactivo: " + targetLanguage.getCode()
            );
        }

        if(sourceLanguage.getLanguageId().equals(targetLanguage.getLanguageId())){
                throw new IllegalArgumentException(
                        "El idioma origen y destino no pueden ser iguales " 
                );
        }

        SupportFaqTranslation sourceTranslation =
                translationRepository
                        .findBySupportFaq_SupportFaqIdAndLanguage_LanguageId(faqId, sourceLanguageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No existe una traducción en el idioma origen "
                                )
                        );

        AiTranslationRequest request = new AiTranslationRequest(
                sourceLanguage.getCode(),
                targetLanguage.getCode(),
                Map.of(
                        "question", 
                        sourceTranslation.getQuestion(),
                        "answer",
                        sourceTranslation.getAnswer()
                )
        );

        AiTranslationResult result =
            aiTranslationService.translate(request);

        SupportFaqAiTranslationResponseDto response =
                new SupportFaqAiTranslationResponseDto();

        response.setSourceLanguageId(sourceLanguageId);
        response.setTargetLanguageId(targetLanguage.getLanguageId());

        response.setSourceQuestion(sourceTranslation.getQuestion());
        response.setSourceAnswer(sourceTranslation.getAnswer());

        response.setTranslatedQuestion(
                result.fields().get("question")
        );

        response.setTranslatedAnswer(
                result.fields().get("answer")
        );

        return response;
    }
}
