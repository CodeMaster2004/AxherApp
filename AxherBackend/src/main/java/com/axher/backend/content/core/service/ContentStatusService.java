package com.axher.backend.content.core.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.ContentStatusRequestDto;
import com.axher.backend.content.core.DTOs.ContentStatusTranslationRequestDto;
import com.axher.backend.content.core.entities.ContentStatus;
import com.axher.backend.content.core.entities.ContentStatusCode;
import com.axher.backend.content.core.repositories.ContentStatusRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
@Transactional
public class ContentStatusService {

    private final ContentStatusRepository repository;
    private final ContentStatusTranslationService translationService;


    // ==========================================
    // OBTENER LISTADO
    // ==========================================
    public Page<ContentStatus> findAll(Pageable pageable, Integer languageId, String search){

        if(search == null || search.isBlank()){
            return repository.findAll(pageable);
        }
        return repository.search(search, languageId, pageable);
    }

    // ==========================================
    // OBTENER POR ID
    // ==========================================
    public ContentStatus findById(Integer id){
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Estado no encotrado: " + id));
    }

    // ==========================================
    // OBTENER POR CODE
    // ==========================================
    public ContentStatus getStatus(ContentStatusCode code) {
        return repository.findByCode(code.name())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Estado no encontrado: " + code
                        )
                );
    }

    // ==========================================
    // CREAR
    // ==========================================
    public ContentStatus create (ContentStatusRequestDto dto){
                
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

        String normalizedCode =
                TextNormalizer.normalizeCode(dto.getCode());

        if (repository.existsByCode(normalizedCode)) {
            throw new DuplicateResourceException(
                    "El estado ya existe: " + normalizedCode
            );
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
        ContentStatus status = new ContentStatus();
        status.setCode(normalizedCode);
        ContentStatus saved = repository.save(status);

        ContentStatusTranslationRequestDto translationDto =
                new ContentStatusTranslationRequestDto();

        translationDto.setLanguageId(dto.getLanguageId());
        translationDto.setName(dto.getName().trim());
        translationDto.setDescription(dto.getDescription());
    
        translationService.save(
                saved.getContentStatusId(),
                translationDto
        );

        return saved;
    }

    public ContentStatus update(Integer id, ContentStatusRequestDto dto){

        ContentStatus existing = findById(id);

        if (dto.getCode() != null) {



            if (dto.getCode().isBlank()) {
                throw new IllegalArgumentException("Status no puede estar vacío");
            }

            String normalized = TextNormalizer.normalizeCode(dto.getCode());


            if(!normalized.equals(existing.getCode())
                && repository.existsByCode(normalized)){
                throw new DuplicateResourceException("El estado ya existe: " + normalized);
            }

            existing.setCode(normalized);
        }
        
        //==========================
        // TRADUCCIÓN
        //==========================
        if (dto.getName() != null) {

            String name = dto.getName().trim();

            if (name.isBlank()) {
                throw new IllegalArgumentException("El nombre no puede estar vacío");
            }

            if (dto.getLanguageId() == null) {
                throw new IllegalArgumentException(
                        "El idioma es obligatorio"
                );
            }

            if (translationService.existsByNameAndLanguageAndStatusNot(
                    name,
                    dto.getLanguageId(),
                    id
            )) {

                throw new DuplicateResourceException(
                        "El nombre ya existe en este idioma: " + name
                );
            }

            ContentStatusTranslationRequestDto translationDto =
                    new ContentStatusTranslationRequestDto();

            translationDto.setLanguageId(dto.getLanguageId());
            translationDto.setName(name);
            translationDto.setDescription(dto.getDescription());

            translationService.save(
                    existing.getContentStatusId(),
                    translationDto
            );

        }

        return repository.save(existing);
    }



    public void delete(Integer id){
        if(!repository.existsById(id)){
            throw new ResourceNotFoundException("Estado no encotrado: " + id);
        }
        repository.deleteById(id);
    }

}
    
