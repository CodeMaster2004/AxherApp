package com.axher.backend.support.reports.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;
import com.axher.backend.support.reports.DTOS.ReportStatusRequestDto;
import com.axher.backend.support.reports.entities.ReportStatus;
import com.axher.backend.support.reports.repositories.ReportStatusRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportStatusService {

    private final ReportStatusRepository repository;

    
    public Page<ReportStatus> findAll(Pageable pageable, String search) {

        if(search == null || search.isBlank()){
            return repository.findAll(pageable);
        }
        return repository.findByCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(search, search, search, pageable);
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

        String normalize = TextNormalizer.normalizeCode(dto.getCode());

        dto.setCode(normalize);

        if(repository.existsByCode(normalize)){
            throw new DuplicateResourceException("El estado de reporte ya existe: " + normalize);
        }

        if(repository.existsByNameIgnoreCase(dto.getName())){
            throw new DuplicateResourceException("El nombre de estado de reporte ya existe: " + dto.getName());
        }

        ReportStatus reportStatus = new ReportStatus();

        reportStatus.setCode(normalize);
        reportStatus.setName(dto.getName());
        reportStatus.setDescription(dto.getDescription());

        return repository.save(reportStatus);
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

        if(dto.getName() != null) {
            
            if(dto.getName().isBlank()){
                throw new IllegalArgumentException("El nombre de estado de reporte no puede estar vacío");
            }

            if(!dto.getName().equalsIgnoreCase(existing.getName())
                && repository.existsByNameIgnoreCase(dto.getName())){
                throw new DuplicateResourceException("El nombre de estado de reporte ya existe: " + dto.getName());
            }

            existing.setName(dto.getName());
        }
        if(dto.getDescription() != null){
            existing.setDescription(dto.getDescription());
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
