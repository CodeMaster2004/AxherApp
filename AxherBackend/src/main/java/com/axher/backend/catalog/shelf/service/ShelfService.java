package com.axher.backend.catalog.shelf.service;

import com.axher.backend.catalog.shelf.mapper.ShelfItemMapper;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.axher.backend.catalog.shelf.DTOs.ShelfDto;
import com.axher.backend.catalog.shelf.DTOs.ShelfItemDto;
import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.catalog.shelf.entities.ShelfContent;
import com.axher.backend.catalog.shelf.entities.ShelfTarget;
import com.axher.backend.catalog.shelf.repositories.ContentShelfRepository;
import com.axher.backend.catalog.shelf.repositories.ShelfContentRepository;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.core.service.ContentCatalogService;
import com.axher.backend.content.core.service.PopularityService;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShelfService {

    private final ShelfItemMapper shelfItemMapper;
    private final ContentShelfRepository contentShelfRepository;
    private final ShelfContentRepository shelfContentRepository;
    private final PopularityService popularityService;
    private final ContentCatalogService contentCatalogService;
    private final ContentShelfLocalizationService localizationService;


    public List<ShelfDto> getShelves(
            ShelfTarget target,
            String slug
    ){

        List<ContentShelf> shelves;


        if(slug != null){

            shelves =
                contentShelfRepository
                .findByTargetAndSlugAndActiveTrue(
                    target,
                    slug
                );

        }else{

            shelves =
                contentShelfRepository
                .findByTargetAndActiveTrue(
                    target
                );
        }


        List<ShelfDto> response = new ArrayList<>();


        for(ContentShelf shelf : shelves){

            ShelfDto dto = new ShelfDto();
            var localized = localizationService.resolve(shelf);
            dto.setName(localized.name());
            dto.setSlug(shelf.getSlug());
            dto.setSource(shelf.getSource());
            dto.setItems(
                resolveContents(shelf, target)
            );
            
            
            response.add(dto);
        }


        return response;
    }

      public ShelfDto getShelfById(Integer shelfId) {

            ContentShelf shelf =
                contentShelfRepository
                    .findById(shelfId)
                    .orElseThrow(() ->
                        new ResourceNotFoundException(
                            "Shelf no encontrado: " + shelfId
                        )
                    );

            return toDto(shelf, shelf.getTarget());
        }

    private ShelfDto toDto(
        ContentShelf shelf,
        ShelfTarget target
    ){
        ShelfDto dto = new ShelfDto();
        var localized = localizationService.resolve(shelf);
        dto.setName(localized.name());
        dto.setSlug(shelf.getSlug());
        dto.setSource(shelf.getSource());
        dto.setItems(
            resolveContents(shelf, target)
        );

        return dto;
    }

    private List<ShelfItemDto> resolveContents(
        ContentShelf shelf,
        ShelfTarget target
    ){
        ContentTypeEnum type = resolveContentType(target);

        return switch(shelf.getSource()){

            case MANUAL -> shelfContentRepository
                .findByContentShelfOrderByPositionAsc(shelf)
                .stream()
                .map(ShelfContent::getContent)
                .map(shelfItemMapper::fromContent)
                .toList();

            case TRENDING -> popularityService
                .trending(type, PageRequest.of(0, 20))
                .getContent()
                .stream()
                .map(shelfItemMapper::fromTrending)
                .toList();

            case TOP_RATED -> popularityService
                .topRated(type)
                .stream()
                .map(shelfItemMapper::fromTopRated)
                .toList();
            case NEW_RELEASES -> contentCatalogService
                .findNewContent(
                    type,
                    PageRequest.of(0, 20)
                )
                .getContent()
                .stream()
                .map(shelfItemMapper::fromContent)
                .toList();
            case MOST_WATCHED -> List.of();
        };
    }

    private ContentTypeEnum resolveContentType(
        ShelfTarget target
    ){
        return switch(target){
            case MOVIES -> ContentTypeEnum.MOVIE;
            case SERIES -> ContentTypeEnum.SERIE;
            case HOME -> null;
        };
    }
}