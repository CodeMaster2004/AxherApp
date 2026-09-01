package com.axher.backend.support.SupportFaq.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.infrastructure.specification.SupportFaqSpecification;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.PositionUtils;
import com.axher.backend.support.SupportFaq.DTOs.SupportFaqRequestDto;
import com.axher.backend.support.SupportFaq.DTOs.SupportFaqTranslationRequestDto;
import com.axher.backend.support.SupportFaq.entities.SupportFaq;
import com.axher.backend.support.SupportFaq.repositories.SupportFaqRepository;
import com.axher.backend.support.tickets.entities.SupportCategory;
import com.axher.backend.support.tickets.repositories.SupportCategoryRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SupportFaqService {

    private final SupportFaqRepository repository;
    private final SupportFaqTranslationService translationService;
    private final SupportCategoryRepository categoryRepository;

    // ==========================================
    // LISTAR
    // ==========================================
    public Page<SupportFaq> findAll(
            Pageable pageable,
            String search,
            Integer supportCategoryId,
            Boolean active
    ) {
        return repository.findAll(
                SupportFaqSpecification.filter(
                        search,
                        supportCategoryId,
                        active
                ),
                pageable
        );
    }

    // ==========================================
    // OBTENER POR ID
    // ==========================================
    public SupportFaq findById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "FAQ no encontrada: " + id
                        )
                );
    }

    // ==========================================
    // OBTENER FAQ ACTIVA POR ID
    // ==========================================
    public SupportFaq findActiveById(Integer id) {
        return repository.findBySupportFaqIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "FAQ activa no encontrada: " + id
                        )
                );
        
    }

    // ==========================================
    // OBTENER POR CATEGORÍA
    // ==========================================
    public List<SupportFaq> findByCategory(
            Integer categoryId
    ) {

        validateCategory(categoryId);

        return repository
                .findBySupportCategory_SupportCategoryIdOrderByDisplayOrderAsc(
                        categoryId
                );
    }

    // ==========================================
    // OBTENER FAQS ACTIVAS
    // ==========================================
    public List<SupportFaq> findAllActive() {

        return repository
                .findByActiveTrueOrderByDisplayOrderAsc();
    }

    // ==========================================
    // CREAR
    // ==========================================
    public SupportFaq create(
            SupportFaqRequestDto dto
    ) {

        validateCreateDto(dto);

        SupportCategory category =
                categoryRepository.findById(
                        dto.getSupportCategoryId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoría de soporte no encontrada: "
                                        + dto.getSupportCategoryId()
                        )
                );

        List<SupportFaq> faqs =
                repository
                        .findBySupportCategory_SupportCategoryIdOrderByDisplayOrderAsc(
                                category.getSupportCategoryId()
                        );

        int displayOrder =
                PositionUtils.normalizeInsertPosition(
                        dto.getDisplayOrder(),
                        faqs.size()
                );

        PositionUtils.openPosition(
                faqs,
                displayOrder,
                SupportFaq::getDisplayOrder,
                SupportFaq::setDisplayOrder
        );

        repository.saveAll(faqs);

        SupportFaq faq = new SupportFaq();

        faq.setSupportCategory(category);
        faq.setDisplayOrder(displayOrder);
        faq.setActive(
                dto.getActive() != null
                        ? dto.getActive()
                        : true
        );

        SupportFaq saved =
                repository.save(faq);

        saveTranslation(
                saved.getSupportFaqId(),
                dto.getLanguageId(),
                dto.getQuestion(),
                dto.getAnswer()
        );

        return saved;
    }

    // ==========================================
    // ACTUALIZAR
    // ==========================================
    public SupportFaq update(
            Integer id,
            SupportFaqRequestDto dto
    ) {

        SupportFaq existing = findById(id);

        Integer currentCategoryId =
                existing.getSupportCategory()
                        .getSupportCategoryId();

        Integer targetCategoryId =
                dto.getSupportCategoryId() != null
                        ? dto.getSupportCategoryId()
                        : currentCategoryId;

        boolean categoryChanged =
                !currentCategoryId.equals(targetCategoryId);

        // ==========================================
        // CAMBIO DE CATEGORÍA
        // ==========================================
        if (categoryChanged) {

            moveToCategory(
                    existing,
                    currentCategoryId,
                    targetCategoryId,
                    dto.getDisplayOrder()
            );

        }
        // ==========================================
        // SOLO CAMBIO DE POSICIÓN
        // ==========================================
        else if (
                dto.getDisplayOrder() != null
                && !dto.getDisplayOrder()
                        .equals(existing.getDisplayOrder())
        ) {

            List<SupportFaq> faqs =
                    repository
                            .findBySupportCategory_SupportCategoryIdOrderByDisplayOrderAsc(
                                    currentCategoryId
                            );

            PositionUtils.move(
                    faqs,
                    existing.getSupportFaqId(),
                    dto.getDisplayOrder(),
                    SupportFaq::getSupportFaqId,
                    SupportFaq::getDisplayOrder,
                    SupportFaq::setDisplayOrder
            );

            repository.saveAll(faqs);
            repository.flush();
        }

        // ==========================================
        // ESTADO
        // ==========================================
        if (dto.getActive() != null) {
            existing.setActive(dto.getActive());
        }

        // ==========================================
        // TRADUCCIÓN
        // ==========================================
        if (
                dto.getQuestion() != null
                || dto.getAnswer() != null
        ) {

            if (dto.getLanguageId() == null) {
                throw new IllegalArgumentException(
                        "El idioma es obligatorio"
                );
            }

            saveTranslation(
                    existing.getSupportFaqId(),
                    dto.getLanguageId(),
                    dto.getQuestion(),
                    dto.getAnswer()
            );
        }

        return repository.save(existing);
    }

    // ==========================================
    // ELIMINAR
    // ==========================================
    public void delete(Integer id) {

        SupportFaq faq = findById(id);

        Integer categoryId =
                faq.getSupportCategory()
                        .getSupportCategoryId();

        List<SupportFaq> faqs =
                repository
                        .findBySupportCategory_SupportCategoryIdOrderByDisplayOrderAsc(
                                categoryId
                        );

        PositionUtils.closePosition(
                faqs,
                faq.getDisplayOrder(),
                SupportFaq::getDisplayOrder,
                SupportFaq::setDisplayOrder
        );

        repository.saveAll(faqs);

        repository.delete(faq);
    }

    // ==========================================
    // ACTIVAR / DESACTIVAR
    // ==========================================
    public SupportFaq toggleActive(Integer id) {

        SupportFaq faq = findById(id);

        faq.setActive(
                !Boolean.TRUE.equals(
                        faq.getActive()
                )
        );

        return repository.save(faq);
    }

    // ==========================================
    // CAMBIAR DE CATEGORÍA
    // ==========================================
    private void moveToCategory(
            SupportFaq faq,
            Integer oldCategoryId,
            Integer newCategoryId,
            Integer requestedPosition
    ) {

        SupportCategory newCategory =
                categoryRepository.findById(newCategoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Categoría de soporte no encontrada: "
                                                + newCategoryId
                                )
                        );

        // ------------------------------------------
        // CERRAR POSICIÓN EN CATEGORÍA ANTERIOR
        // ------------------------------------------
        List<SupportFaq> oldCategoryFaqs =
                repository
                        .findBySupportCategory_SupportCategoryIdOrderByDisplayOrderAsc(
                                oldCategoryId
                        );

        PositionUtils.closePosition(
                oldCategoryFaqs,
                faq.getDisplayOrder(),
                SupportFaq::getDisplayOrder,
                SupportFaq::setDisplayOrder
        );

        repository.saveAll(oldCategoryFaqs);

        // ------------------------------------------
        // ABRIR POSICIÓN EN NUEVA CATEGORÍA
        // ------------------------------------------
        List<SupportFaq> newCategoryFaqs =
                repository
                        .findBySupportCategory_SupportCategoryIdOrderByDisplayOrderAsc(
                                newCategoryId
                        );

        int newPosition =
                PositionUtils.normalizeInsertPosition(
                        requestedPosition,
                        newCategoryFaqs.size()
                );

        PositionUtils.openPosition(
                newCategoryFaqs,
                newPosition,
                SupportFaq::getDisplayOrder,
                SupportFaq::setDisplayOrder
        );

        repository.saveAll(newCategoryFaqs);

        // ------------------------------------------
        // ACTUALIZAR FAQ
        // ------------------------------------------
        faq.setSupportCategory(newCategory);
        faq.setDisplayOrder(newPosition);
    }

    // ==========================================
    // GUARDAR TRADUCCIÓN
    // ==========================================
    private void saveTranslation(
            Integer faqId,
            Integer languageId,
            String question,
            String answer
    ) {

        SupportFaqTranslationRequestDto translationDto =
                new SupportFaqTranslationRequestDto();

        translationDto.setLanguageId(languageId);

        if (question != null) {
            translationDto.setQuestion(
                    question.trim()
            );
        }

        if (answer != null) {
            translationDto.setAnswer(
                    answer.trim()
            );
        }

        translationService.create(
                faqId,
                translationDto
        );
    }

    // ==========================================
    // VALIDACIONES
    // ==========================================
    private void validateCreateDto(
            SupportFaqRequestDto dto
    ) {

        if (dto.getSupportCategoryId() == null) {
            throw new IllegalArgumentException(
                    "La categoría es obligatoria"
            );
        }

        if (dto.getLanguageId() == null) {
            throw new IllegalArgumentException(
                    "El idioma es obligatorio"
            );
        }

        if (
                dto.getQuestion() == null
                || dto.getQuestion().isBlank()
        ) {
            throw new IllegalArgumentException(
                    "La pregunta es obligatoria"
            );
        }

        if (
                dto.getAnswer() == null
                || dto.getAnswer().isBlank()
        ) {
            throw new IllegalArgumentException(
                    "La respuesta es obligatoria"
            );
        }
    }

    private void validateCategory(
            Integer categoryId
    ) {

        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException(
                    "Categoría de soporte no encontrada: "
                            + categoryId
            );
        }
    }
}