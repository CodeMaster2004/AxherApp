package com.axher.backend.content.core.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.repositories.ContentCategoriesRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
@Transactional
public class ContentCategoriesService {

    private final ContentCategoriesRepository repository;


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


    public ContentCategories create(ContentCategories contentCategory){

        String normalize = TextNormalizer.normalize(contentCategory.getName());

        contentCategory.setName(normalize);

        if(repository.existsByName(normalize)){
            throw new IllegalArgumentException("La categoría ya existe: " + normalize);
        }
        return repository.save(contentCategory);
    }
 
    public ContentCategories update (Integer id, ContentCategories contentCategories){
        ContentCategories existing = findById(id);

        if(contentCategories.getName() != null){

            if(contentCategories.getName().isBlank()){
                throw new IllegalArgumentException("El nombre de la categoria no puede estar vacio");
            }

            String normalized = TextNormalizer.normalize(contentCategories.getName());

            if(!normalized.equals(existing.getName()) && repository.existsByName(normalized)){
                throw new DuplicateResourceException("La categoria ya existe: " + normalized);
            }
            existing.setName(normalized);
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

