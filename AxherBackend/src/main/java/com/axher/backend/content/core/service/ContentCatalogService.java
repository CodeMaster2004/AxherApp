package com.axher.backend.content.core.service;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import static com.axher.backend.infrastructure.specification.ContentSpecifications.hasCategory;
import static com.axher.backend.infrastructure.specification.ContentSpecifications.hasDiscountAmount;
import static com.axher.backend.infrastructure.specification.ContentSpecifications.hasStatus;
import static com.axher.backend.infrastructure.specification.ContentSpecifications.hasType;
import com.axher.backend.content.core.DTOs.ContentFiltersDto;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentStatusCode;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.core.mapper.CategoryMapper;
import com.axher.backend.content.core.repositories.ContentCategoriesRepository;
import com.axher.backend.content.core.repositories.ContentRepository;
import com.axher.backend.infrastructure.specification.ContentSpecifications;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentCatalogService {

    private final ContentRepository contentRepository;
    private final ContentCategoriesRepository categoriesRepository;
    private final CategoryMapper categoryMapper;

    public Page<Content> findPublicContent(
            Pageable pageable,
            String search,
            ContentTypeEnum type
    ){

        Specification<Content> spec = Specification.allOf();


        // Solo publicados
        spec = spec.and(
            (root, query, cb) ->
                cb.equal(
                    root.get("contentStatus").get("code"),
                    ContentStatusCode.PUBLISHED.name()
                )
        );


        // Filtrar MOVIE o SERIE
        if(type != null){
            spec = spec.and(
                hasType(type)
            );
        }


        // Buscar dentro del catálogo si viene texto
        if(search != null && !search.isBlank()){
            spec = spec.and(
                ContentSpecifications.globalSearch(search)
            );
        }


        return contentRepository.findAll(spec, pageable);
    }
    
    public Content findPublicById(Integer id){

        Content content = contentRepository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Contenido no encontrado: " + id
                )
            );


        if(!content.getContentStatus()
                .getCode()
                .equals(ContentStatusCode.PUBLISHED.name())){

            throw new ResourceNotFoundException(
                "Contenido no disponible"
            );
        }


        return content;
    }

    public Page<Content> globalSearch(
            String query,
            Pageable pageable
    ){

        Specification<Content> spec = Specification.allOf();

        // Solo contenido activo
        spec = spec.and(
            (root, q, cb) ->
                cb.equal(
                    root.get("contentStatus").get("code"),
                    ContentStatusCode.PUBLISHED.name()
                )
        );

        if(query != null && !query.isBlank()){
            spec = spec.and(ContentSpecifications.globalSearch(query));
        }

        return contentRepository.findAll(spec, pageable);
    }

    public Page<Content> findUpcoming(
            ContentTypeEnum type,
            Pageable pageable
    ) {

        return contentRepository.findUpcoming(
                ContentStatusCode.UPCOMING.name(),
                type,
                pageable
        );
    }

    public Content findCatalogById(Integer id) {

        Content content = contentRepository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Contenido no encontrado: " + id
                )
            );

        String status =
            content.getContentStatus().getCode();

        if (
            !ContentStatusCode.PUBLISHED.name().equals(status)
            &&
            !ContentStatusCode.UPCOMING.name().equals(status)
        ) {
            throw new ResourceNotFoundException(
                "Contenido no disponible"
            );
        }

        return content;
    }
    public Page<Content> filterCatalog(
            String query,
            Integer categoryId,
            Integer year,
            Integer statusId,
            BigDecimal discountAmount,
            ContentTypeEnum type,
            Pageable pageable
    ){

        Specification<Content> spec = Specification.allOf();

        spec = spec.and(
            (root,q,cb) ->
                cb.equal(
                    root.get("contentStatus")
                       .get("code"),
                    ContentStatusCode.PUBLISHED.name()
                )
        );
        
        if(query != null && !query.isBlank()){
            spec = spec.and(
                ContentSpecifications.globalSearch(query)
            );
        }


        if(categoryId != null){
            spec = spec.and(
                hasCategory(
                    categoriesRepository.getReferenceById(categoryId)
                )
            );
        }

        if(year != null){
            spec = spec.and(
                ContentSpecifications.hasReleaseYear(year)
            );
        }


        if(statusId != null){
            spec = spec.and(
                hasStatus(statusId)
            );
        }


        if(discountAmount != null){
            spec = spec.and(
                hasDiscountAmount(discountAmount)
            );
        }


        if(type != null){
            spec = spec.and(
                hasType(type)
            );
        }


        return contentRepository.findAll(spec,pageable);
    }

    
    public Page<Content> findNewContent(
        ContentTypeEnum type, Pageable pageable) {

            return contentRepository
                .findByTypeAndContentStatus_CodeOrderByReleaseDateDesc(
                    type, "PUBLISHED", pageable);
                

        }

    public ContentFiltersDto getFilters(ContentTypeEnum type){
        
        ContentFiltersDto dto = new ContentFiltersDto();

        dto.setCategories(
            categoriesRepository.findAvailableCategories(type)
                .stream()
                .map(categoryMapper::toDto)
                .toList()
        );

        dto.setYears(
            contentRepository.findAvailableYears(type)
        );
        return dto;
    }

    
        
    
    
}
