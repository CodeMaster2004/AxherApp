package com.axher.backend.support.reports.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;
import com.axher.backend.support.reports.entities.ReportStatus;
import com.axher.backend.support.reports.repositories.ReportStatusRepository;
import com.axher.backend.support.reports.DTOS.ReportStatusRequestDto;
import com.axher.backend.support.reports.DTOS.ReportStatusTranslationRequestDto;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportStatusService {

    private final ReportStatusRepository repository;
    private final ReportStatusTranslationService translationService;

    public Page<ReportStatus> findAll(Pageable pageable, Integer languageId, String search) {

        if(search == null || search.isBlank()){
            return repository.findAll(pageable);
        }
        return repository.search(search, languageId, pageable);
    }

    public ReportStatus findById(Integer id){
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Estado de reporte no encontrado: " + id));
    }

    public ReportStatus getStatus(String code) {
        return repository.findByCode(code)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Estado de reporte no encontrado: " + code
                        )
                );
    }

    public ReportStatus create(ReportStatusRequestDto dto){

        if (dto.getCode() == null || dto.getCode().isBlank()) {
            throw new IllegalArgumentException(
                    "El código no puede estar vacío"
            );
        }

        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new IllegalArgumentException(
                    "El nombre no puede estar vacío"
            );
        }

        if (dto.getLanguageId() == null) {
            throw new IllegalArgumentException(
                    "El idioma es obligatorio"
            );
        }

        String normalizedCode = TextNormalizer.normalizeCode(dto.getCode());

        if(repository.existsByCode(normalizedCode)){
            throw new DuplicateResourceException("El estado de reporte ya existe: " + normalizedCode);
        }

        if (translationService.existsByNameAndLanguage(
                dto.getName().trim(),
                dto.getLanguageId()
        )) {
            throw new DuplicateResourceException(
                    "El nombre ya existe en este idioma: "
                            + dto.getName()
            );
        }

        ReportStatus status = new ReportStatus();

        status.setCode(normalizedCode);

        ReportStatus saved = repository.save(status);

        ReportStatusTranslationRequestDto translationDto =
                new ReportStatusTranslationRequestDto();

        translationDto.setLanguageId(dto.getLanguageId());
        translationDto.setName(dto.getName().trim());
        translationDto.setDescription(dto.getDescription());

        translationService.create(
                saved.getReportStatusId(),
                translationDto
        );

        return saved;
    }

    public ReportStatus update(Integer id, ReportStatusRequestDto dto){

        ReportStatus existing = findById(id);

        if(dto.getCode() != null){


            if(dto.getCode().isBlank()){
                throw new IllegalArgumentException("El estado de reporte no puede estar vacío");
            }
            String normalize = TextNormalizer.normalizeCode(dto.getCode());

            if(!normalize.equals(existing.getCode()) && repository.existsByCode(normalize)){
                throw new DuplicateResourceException("El estado de reporte ya existe: " + normalize);
            }

            existing.setCode(normalize);
        }

        if (dto.getName() != null) {

            String name = dto.getName().trim();

            if (name.isBlank()) {
                throw new IllegalArgumentException(
                        "El nombre del estado de reporte no puede estar vacío"
                );
            }

            if (dto.getLanguageId() == null) {
                throw new IllegalArgumentException(
                        "El idioma es obligatorio"
                );
            }

            if (translationService
                    .existsByNameAndLanguageAndStatusNot(
                            name,
                            dto.getLanguageId(),
                            id
                    )) {

                throw new DuplicateResourceException(
                        "El nombre ya existe en este idioma: "
                                + name
                );
            }

            ReportStatusTranslationRequestDto translationDto =
                    new ReportStatusTranslationRequestDto();

            translationDto.setLanguageId(dto.getLanguageId());
            translationDto.setName(name);
            translationDto.setDescription(dto.getDescription());

            translationService.update(
                    existing.getReportStatusId(),
                    dto.getLanguageId(),
                    translationDto
            );
        }

        return repository.save(existing);
    }

    public void delete(Integer id){
        if(!repository.existsById(id)){
            throw new ResourceNotFoundException("Estado de reporte no encontrado: " + id);
        }
        repository.deleteById(id);
    }
    
}
