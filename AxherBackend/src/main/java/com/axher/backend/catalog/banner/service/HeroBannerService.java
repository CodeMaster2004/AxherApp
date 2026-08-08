package com.axher.backend.catalog.banner.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.catalog.banner.DTOs.HeroBannerRequestDto;
import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.catalog.banner.repositories.HeroBannerRepository;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.repositories.ContentRepository;
import com.axher.backend.infrastructure.storage.FileStorageService;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HeroBannerService {

    private final HeroBannerRepository repository;
    private final ContentRepository contentRepository;
    private final FileStorageService fileStorageService;

    public Page<HeroBanner> findAll(
        String search,
        Pageable pageable
    ) {

        if(search != null && !search.isBlank()) {
            return repository
                .findByContent_TitleContainingIgnoreCase(
                    search,
                    pageable
                );
        }

        return repository.findAll(pageable);
    }

    public HeroBanner findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner no encontrado: " + id));
    }

    public HeroBanner create(HeroBannerRequestDto dto) {

        Content content = contentRepository.findById(dto.getContentId())
                .orElseThrow(() -> new ResourceNotFoundException("Contenido no encontrado: " + dto.getContentId()));
            
        String backdropUrl = fileStorageService.saveFile(dto.getBackdropFile(), "hero-banners");
        HeroBanner banner = new HeroBanner();
        banner.setContent(content);
        banner.setTitleOverride(dto.getTitleOverride());
        banner.setDescriptionOverride(dto.getDescriptionOverride());
        banner.setBackdropUrl(backdropUrl);
        banner.setPriority(dto.getPriority());
        banner.setStartDate(dto.getStartDate());
        banner.setEndDate(dto.getEndDate());
        banner.setActive(dto.getActive() != null ? dto.getActive() : true);

        return repository.save(banner);
    }

    public HeroBanner update(Integer id, HeroBannerRequestDto dto) {

        HeroBanner banner = findById(id);


        if(dto.getContentId() != null) {
            Content content = contentRepository.findById(dto.getContentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Contenido no encontrado: " + dto.getContentId()));
            banner.setContent(content);
        }
        if (dto.getTitleOverride() != null) {
            banner.setTitleOverride(dto.getTitleOverride());
        }
        if (dto.getDescriptionOverride() != null) {
            banner.setDescriptionOverride(dto.getDescriptionOverride());
        }
        if(dto.getBackdropFile() != null && !dto.getBackdropFile().isEmpty()){

            String newBackdrop = fileStorageService.saveFile(
                    dto.getBackdropFile(),
                    "hero-banners"
            );

            fileStorageService.deleteFile(
                    banner.getBackdropUrl()
            );

            banner.setBackdropUrl(newBackdrop);
        }
        if (dto.getPriority() != null) {
            banner.setPriority(dto.getPriority());
        }
        if (dto.getStartDate() != null) {
            banner.setStartDate(dto.getStartDate());
        }
        if (dto.getEndDate() != null) {
            banner.setEndDate(dto.getEndDate());
        }
        if (dto.getActive() != null) {
            banner.setActive(dto.getActive());
        }

        return repository.save(banner);
    }

    public void delete(Integer id){

        HeroBanner banner = findById(id);

        String backdrop = banner.getBackdropUrl();

        repository.delete(banner);

        fileStorageService.deleteFile(backdrop);
    }

    public HeroBanner toggleActive(Integer id) {
        HeroBanner banner = findById(id);
        banner.setActive(!Boolean.TRUE.equals(banner.getActive()));
        return repository.save(banner);
    }
    
}
