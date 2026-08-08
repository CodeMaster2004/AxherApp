package com.axher.backend.catalog.shelf.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.axher.backend.catalog.shelf.DTOs.ShelfDto;
import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.catalog.shelf.entities.ShelfContent;
import com.axher.backend.catalog.shelf.entities.ShelfTarget;
import com.axher.backend.catalog.shelf.repositories.ContentShelfRepository;
import com.axher.backend.catalog.shelf.repositories.ShelfContentRepository;
import com.axher.backend.content.core.DTOs.ContentDetailDto;
import com.axher.backend.content.core.mapper.ContentMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShelfService {

    private final ContentShelfRepository contentShelfRepository;
    private final ShelfContentRepository shelfContentRepository;
    private final ContentMapper contentMapper;


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
                .findByTargetAndActiveTrueOrderByDisplayOrderAsc(
                    target
                );
        }


        List<ShelfDto> response = new ArrayList<>();


        for(ContentShelf shelf : shelves){

            ShelfDto dto = new ShelfDto();

            dto.setName(shelf.getName());
            dto.setSlug(shelf.getSlug());


            List<ContentDetailDto> contents =
                    shelfContentRepository
                    .findByContentShelfOrderByPositionAsc(shelf)
                    .stream()
                    .map(ShelfContent::getContent)
                    .map(contentMapper::toDto)
                    .toList();


            dto.setContents(contents);

            response.add(dto);
        }


        return response;
    }
}