package com.axher.backend.catalog.shelf.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final SlugGeneratorService slugGenerator;

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

    public List<ShelfOptionDto> getOptions(ShelfTarget target) {

        return repository
            .findByTargetAndActiveTrueOrderByNameAsc(target)
            .stream()
            .map(shelf -> new ShelfOptionDto(
                shelf.getContentShelfId(),
                shelf.getName(),
                shelf.getSlug()
            ))
            .toList();
    }

    public ContentShelf create(CreateShelfDto dto) {

        String name = dto.getName().trim();
        if(repository.existsByTargetAndNameIgnoreCase(dto.getTarget(), name)){
            throw new DuplicateResourceException("El shelf ya existe: " + dto.getTarget());
        }
        ContentShelf shelf = new ContentShelf();
        shelf.setName(name);
        ShelfTarget target = dto.getTarget();

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

        return repository.save(shelf);
    }

    @Transactional
    public ContentShelf update(Integer id, UpdateShelfDto dto) {

        ContentShelf shelf = findById(id);

        if (dto.getName() != null) {

            String name = dto.getName() != null
                ? dto.getName().trim()
                : shelf.getName();

            if(name.isBlank()){
                throw new IllegalArgumentException("El nombre no puede estar vacío");
            }

            ShelfTarget target = dto.getTarget() != null
                    ? dto.getTarget()
                    : shelf.getTarget();

            if ((!name.equalsIgnoreCase(shelf.getName())
                    || target != shelf.getTarget())
                    && repository.existsByTargetAndNameIgnoreCaseAndContentShelfIdNot(
                            target,
                            name,
                            id)) {

                throw new DuplicateResourceException(
                        "Ya existe el shelf '" + name + "' para " + target
                );
            }

            shelf.setName(name);

            shelf.setSlug(
                slugGenerator.generate(
                    name,
                    slug -> repository.existsByTargetAndSlugAndContentShelfIdNot(
                        target,
                        slug,
                        id
                    )
                )
            );
        }

        if (dto.getTarget() != null) {
            shelf.setTarget(dto.getTarget());
        }

        if (dto.getSource() != null) {
            shelf.setSource(dto.getSource());
        }

        if (dto.getLayout() != null) {
            shelf.setLayout(dto.getLayout());
        }

        /*if (dto.getDisplayOrder() != null) {
            shelf.setDisplayOrder(dto.getDisplayOrder());
        }*/

        if (dto.getActive() != null) {
            shelf.setActive(dto.getActive());
        }

        return repository.save(shelf);
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
