package com.axher.backend.catalog.shelf.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.catalog.shelf.DTOs.ContentShelfTranslationRequestDto;
import com.axher.backend.catalog.shelf.DTOs.CreateShelfDto;
import com.axher.backend.catalog.shelf.DTOs.ShelfOptionDto;
import com.axher.backend.catalog.shelf.DTOs.UpdateShelfDto;
import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.catalog.shelf.entities.ShelfTarget;
import com.axher.backend.catalog.shelf.repositories.ContentShelfRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.SlugGeneratorService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentShelfService {

    private final ContentShelfRepository repository;
    private final ContentShelfTranslationService translationService;
    private final SlugGeneratorService slugGenerator;
    private final ContentShelfLocalizationService localizationService;

    public Page<ContentShelf> findAll(ShelfTarget target, Pageable pageable) {
        if (target != null) {
            return repository.findByTarget(
                    target,
                    pageable
            );
        }

        return repository.findAll(pageable);
    }

    public ContentShelf findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrusuel no encontrado: " + id));
    }

    public List<ShelfOptionDto> getOptions(
            ShelfTarget target
    ) {

        return repository
                .findByTargetAndActiveTrue(target)
                .stream()
                .map(shelf -> {

                    var localized =
                            localizationService.resolve(shelf);

                    return new ShelfOptionDto(
                            shelf.getContentShelfId(),
                            localized.name(),
                            shelf.getSlug()
                    );
                })
                .toList();
    }

    public ContentShelf create(CreateShelfDto dto) {

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

        String name = dto.getName().trim();

        ShelfTarget target = dto.getTarget();

        if (translationService.existsByNameAndLanguage(
                name,
                dto.getLanguageId()
        )) {
            throw new DuplicateResourceException(
                    "El nombre ya existe en este idioma: " + name
            );
        }
        ContentShelf shelf = new ContentShelf();

        shelf.setSlug(
            slugGenerator.generate(
                name,
                slug -> repository.existsByTargetAndSlug(target, slug)
            )
        );
        shelf.setTarget(dto.getTarget());
        shelf.setSource(dto.getSource());
        shelf.setLayout(dto.getLayout());
        //shelf.setDisplayOrder(dto.getDisplayOrder());
        shelf.setActive(Boolean.TRUE.equals(dto.getActive()));

        ContentShelf saved = repository.save(shelf);

        ContentShelfTranslationRequestDto translationDto =
                new ContentShelfTranslationRequestDto();

        translationDto.setLanguageId(dto.getLanguageId());
        translationDto.setName(name);

        translationService.create(
                saved.getContentShelfId(),
                translationDto
        );

        return saved;
    }

    @Transactional
    public ContentShelf update(Integer id, UpdateShelfDto dto) {

        ContentShelf existing = findById(id);

        if (dto.getName() != null) {

            String name = dto.getName().trim();

            if(name.isBlank()){
                throw new IllegalArgumentException("El nombre no puede estar vacío");
            }

            if (dto.getLanguageId() == null) {
                throw new IllegalArgumentException(
                        "El idioma es obligatorio"
                );
            }

            if (translationService.existsByNameAndLanguageAndShelfNot(
                    name,
                    dto.getLanguageId(),
                    id
            )) {
                throw new DuplicateResourceException(
                        "El nombre ya existe en este idioma: " + name
                );
            }

            ContentShelfTranslationRequestDto translationDto =
                    new ContentShelfTranslationRequestDto();

            translationDto.setLanguageId(dto.getLanguageId());
            translationDto.setName(name);

            translationService.update(
                    existing.getContentShelfId(),
                    dto.getLanguageId(),
                    translationDto
            );
        }

        if (dto.getTarget() != null) {
            existing.setTarget(dto.getTarget());
        }

        if (dto.getSource() != null) {
            existing.setSource(dto.getSource());
        }

        if (dto.getLayout() != null) {
            existing.setLayout(dto.getLayout());
        }

        /*if (dto.getDisplayOrder() != null) {
            shelf.setDisplayOrder(dto.getDisplayOrder());
        }*/

        if (dto.getActive() != null) {
            existing.setActive(dto.getActive());
        }

        return repository.save(existing);
    }

    @Transactional
    public void delete(Integer id) {
        ContentShelf shelf = findById(id);
        repository.delete(shelf);
    }

    @Transactional
    public ContentShelf toggleActive(Integer id) {
        ContentShelf shelf = findById(id);
        shelf.setActive(!Boolean.TRUE.equals(shelf.getActive()));
        return repository.save(shelf);
    }
    
}
