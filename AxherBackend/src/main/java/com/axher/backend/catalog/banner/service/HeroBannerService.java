package com.axher.backend.catalog.banner.service;


import java.time.Instant;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.catalog.banner.DTOs.HeroBannerRequestDto;
import com.axher.backend.catalog.banner.DTOs.HeroBannerTranslationRequestDto;
import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.catalog.banner.repositories.HeroBannerRepository;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.repositories.ContentRepository;
import com.axher.backend.infrastructure.storage.FileStorageService;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.DateValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HeroBannerService {

    private final HeroBannerRepository repository;
    private final ContentRepository contentRepository;
    private final FileStorageService fileStorageService;
    private final HeroBannerTranslationService translationService;

    public Page<HeroBanner> findAll(
        String search,
        Pageable pageable
    ) {

        if(search != null && !search.isBlank()) {
            return repository
                .searchByTitle(
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

        DateValidator.validateDateTimeRange(dto.getStartDate(), dto.getEndDate());

        if (dto.getContentId() == null) {
            throw new IllegalArgumentException(
                    "El contenido es obligatorio"
            );
        }
        if (dto.getLanguageId() == null) {
            throw new IllegalArgumentException(
                    "El idioma es obligatorio"
            );
        }
        Content content = contentRepository.findById(dto.getContentId())
                .orElseThrow(() -> new ResourceNotFoundException("Contenido no encontrado: " + dto.getContentId()));

        String backdropUrl = null;

        if (dto.getBackdropFile() != null && !dto.getBackdropFile().isEmpty()) {
            backdropUrl = fileStorageService.saveFile(
                dto.getBackdropFile(),
                "hero-banners"
            );
        }

        HeroBanner banner = new HeroBanner();
        banner.setContent(content);
        banner.setBackdropUrl(backdropUrl);
        banner.setPriority(dto.getPriority());
        banner.setStartDate(dto.getStartDate());
        banner.setEndDate(dto.getEndDate());
        banner.setActive(dto.getActive() != null ? dto.getActive() : true);

        HeroBanner saved = repository.save(banner);

        HeroBannerTranslationRequestDto translationDto =
            new HeroBannerTranslationRequestDto();

        translationDto.setLanguageId(
                dto.getLanguageId()
        );

        translationDto.setTitleOverride(
                dto.getTitleOverride()
        );

        translationDto.setDescriptionOverride(
                dto.getDescriptionOverride()
        );

        translationService.create(
                saved.getHeroBannerId(),
                translationDto
        );


        return saved;
    }

    public HeroBanner update(Integer id, HeroBannerRequestDto dto) {

        HeroBanner banner = findById(id);

        Instant startDate =
            dto.getStartDate() != null
                ? dto.getStartDate()
                : banner.getStartDate();

        Instant endDate =
            dto.getEndDate() != null
                ? dto.getEndDate()
                : banner.getEndDate();

        DateValidator.validateDateTimeRange(
            startDate,
            endDate
        );
        if(dto.getContentId() != null) {
            Content content = contentRepository.findById(dto.getContentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Contenido no encontrado: " + dto.getContentId()));
            banner.setContent(content);
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

        if(dto.getLanguageId() != null) {
            
            HeroBannerTranslationRequestDto translationDto =
                new HeroBannerTranslationRequestDto();

            translationDto.setLanguageId(
                    dto.getLanguageId()
            );

            translationDto.setTitleOverride(
                    dto.getTitleOverride()
            );

            translationDto.setDescriptionOverride(
                    dto.getDescriptionOverride()
            );

            translationService.update(
                    banner.getHeroBannerId(),
                    dto.getLanguageId(),
                    translationDto
            );
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
