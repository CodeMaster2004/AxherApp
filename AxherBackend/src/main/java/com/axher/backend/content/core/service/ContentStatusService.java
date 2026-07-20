package com.axher.backend.content.core.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.ContentStatus;
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
        return repository.findByStatusContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search, pageable);
    }

    public ContentStatus findById(Integer id){
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Estado no encotrado: " + id));
    }

    public ContentStatus create (ContentStatus contentStatus){
        
        String normalize = TextNormalizer.normalize(contentStatus.getStatus());

        contentStatus.setStatus(normalize);
        
        if(repository.existsByStatus(normalize)){
            throw new DuplicateResourceException("El estado ya existe: " + normalize);
        }
        return repository.save(contentStatus);
    }

    public ContentStatus update(Integer id, ContentStatus status){
        ContentStatus existing = findById(id);

        if (status.getStatus() != null) {


            if (status.getStatus().isBlank()) {
                throw new IllegalArgumentException("Status no puede estar vacío");
            }

            String normalized = TextNormalizer.normalize(status.getStatus());


            if(!normalized.equals(existing.getStatus())
                && repository.existsByStatus(normalized)){
                throw new DuplicateResourceException("El estado ya existe: " + normalized);
            }

            existing.setStatus(normalized);
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
    
