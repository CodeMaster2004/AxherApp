package com.axher.backend.content.core.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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


    public Page<ContentStatus> findAll(Pageable pageable, String search){

        if(search == null || search.isBlank()){
            return repository.findAll(pageable);
        }
        return repository.findByCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search, search, pageable);
    }

    public ContentStatus findById(Integer id){
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Estado no encotrado: " + id));
    }

    public ContentStatus getStatus(ContentStatusCode code) {
        return repository.findByCode(code.name())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Estado no encontrado: " + code
                        )
                );
    }

    public ContentStatus create (ContentStatus contentStatus){
        
        String normalize = TextNormalizer.normalizeCode(contentStatus.getCode());

        contentStatus.setCode(normalize);
        
        if(repository.existsByCode(normalize)){
            throw new DuplicateResourceException("El estado ya existe: " + normalize);
        }

        if (repository.existsByNameIgnoreCase(contentStatus.getName())) {
            throw new DuplicateResourceException(
                "El nombre ya existe: " + contentStatus.getName()
            );
        }
        return repository.save(contentStatus);
    }

    public ContentStatus update(Integer id, ContentStatus status){
        ContentStatus existing = findById(id);

        if (status.getCode() != null) {



            if (status.getCode().isBlank()) {
                throw new IllegalArgumentException("Status no puede estar vacío");
            }

            String normalized = TextNormalizer.normalizeCode(status.getCode());


            if(!normalized.equals(existing.getCode())
                && repository.existsByCode(normalized)){
                throw new DuplicateResourceException("El estado ya existe: " + normalized);
            }

            existing.setCode(normalized);
        }

        if (status.getName() != null) {

            if (status.getName().isBlank()) {
                throw new IllegalArgumentException("El nombre no puede estar vacío");
            }

            if (!status.getName().equalsIgnoreCase(existing.getName())
                    && repository.existsByNameIgnoreCase(status.getName())) {

                throw new DuplicateResourceException(
                    "El nombre ya existe: " + status.getName()
                );
            }

            existing.setName(status.getName());
        }

        if (status.getDescription() != null) {
            existing.setDescription(status.getDescription());
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
    
