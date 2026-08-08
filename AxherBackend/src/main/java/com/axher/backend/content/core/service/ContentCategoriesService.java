package com.axher.backend.content.core.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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


    public Page<ContentCategories> findAll(Pageable pageable, String search){

        if(search == null || search.isBlank()){
            return repository.findAll(pageable);
        }
        return repository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search, pageable);
    }

    public ContentCategories findById(Integer id){
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada: " + id));
    }

    public ContentCategories findBySlug(String slug) {

        return repository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException("Slug no encontrada: " + slug));
    }


    public ContentCategories create(ContentCategories contentCategory){

        String name = contentCategory.getName().trim();

        if(repository.existsByNameIgnoreCase(name)){
            throw new DuplicateResourceException("La categoría ya existe: " + name);
        }

        String slug = slugGenerator.generate(name, repository::existsBySlug);

        contentCategory.setName(name);
        contentCategory.setSlug(slug);
        
        return repository.save(contentCategory);
    }
 
    public ContentCategories update (Integer id, ContentCategories contentCategories){
        ContentCategories existing = findById(id);

        if(contentCategories.getName() != null){

            String name = contentCategories.getName().trim();

            if(name.isBlank()){
                throw new IllegalArgumentException("El nombre de la categoria no puede estar vacio");
            }


            if(!name.equalsIgnoreCase(existing.getName()) && repository.existsByNameIgnoreCase(name)){
                throw new DuplicateResourceException("La categoria ya existe: " + name);
            }
            existing.setName(name);

            existing.setSlug(
                slugGenerator.generate(name, slug -> repository.existsBySlugAndContentCategoryIdNot(slug, id))
            );
        }
        

        if(contentCategories.getDescription() != null){
            existing.setDescription(contentCategories.getDescription());;
        }

        return repository.save(existing);
    }


    public void delete(Integer id){
        if(!repository.existsById(id)){
            throw new ResourceNotFoundException("Categoria no encontrada: " + id);
        }
        repository.deleteById(id);
    }
    

    
}

