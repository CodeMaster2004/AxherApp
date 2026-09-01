package com.axher.backend.content.core.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.ContentCategoryRequestDto;
import com.axher.backend.content.core.DTOs.ContentCategoryTranslationRequestDto;
import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.repositories.ContentCategoriesRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.SlugGeneratorService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional
public class ContentCategoriesService {

    private final ContentCategoriesRepository repository;
    private final SlugGeneratorService slugGenerator;
    private final ContentCategoryTranslationService translationService;


    public Page<ContentCategories> findAll(Pageable pageable, String search){

        if(search == null || search.isBlank()){
            return repository.findAll(pageable);
        }
        return repository.search( search, pageable);
    }

    public ContentCategories findById(Integer id){
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada: " + id));
    }

    public ContentCategories findBySlug(String slug) {

        return repository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Slug no encontrada: " + slug));
    }


    public ContentCategories create(ContentCategoryRequestDto dto){

        String name = dto.getName().trim();

        if(translationService.existsByNameAndLanguage(name, dto.getLanguageId())) {
            throw new DuplicateResourceException("La categoría ya existe: " + name);
        }

        String slug = slugGenerator.generate(name, repository::existsBySlug);

        ContentCategories contentCategory = new ContentCategories();
        contentCategory.setSlug(slug);
        ContentCategories saved = repository.save(contentCategory);

        ContentCategoryTranslationRequestDto translationDto =
            new ContentCategoryTranslationRequestDto();

        translationDto.setLanguageId(dto.getLanguageId());
        translationDto.setName(dto.getName());
        translationDto.setDescription(dto.getDescription());

        translationService.create(
            saved.getContentCategoryId(),
            translationDto
        );

        return repository.save(contentCategory);
    }
 
    public ContentCategories update (Integer id, ContentCategoryRequestDto dto){
        ContentCategories existing = findById(id);

        if(dto.getName() != null){

            String name = dto.getName().trim();

            if(name.isBlank()){
                throw new IllegalArgumentException("El nombre de la categoria no puede estar vacio");
            }


            if (translationService.existsByNameAndLanguageAndCategoryNot(
                    name,
                    dto.getLanguageId(),
                    id
            )) {
                throw new DuplicateResourceException(
                    "La categoría ya existe en este idioma: " + name
                );
            }

            existing.setSlug(
                slugGenerator.generate(name, slug -> repository.existsBySlugAndContentCategoryIdNot(slug, id))
            );
        }
        

        ContentCategoryTranslationRequestDto translationDto =
            new ContentCategoryTranslationRequestDto();

        translationDto.setLanguageId(dto.getLanguageId());
        translationDto.setName(dto.getName());
        translationDto.setDescription(dto.getDescription());

        translationService.update(
            existing.getContentCategoryId(),
            dto.getLanguageId(),
            translationDto
        );

        return repository.save(existing);
    }


    public void delete(Integer id){
        if(!repository.existsById(id)){
            throw new ResourceNotFoundException("Categoria no encontrada: " + id);
        }
        repository.deleteById(id);
    }
    

    
}

