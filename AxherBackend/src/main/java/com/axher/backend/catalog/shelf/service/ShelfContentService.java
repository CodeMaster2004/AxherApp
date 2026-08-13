package com.axher.backend.catalog.shelf.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.catalog.shelf.DTOs.CreateShelfContentDto;
import com.axher.backend.catalog.shelf.DTOs.UpdateShelfContentDto;
import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.catalog.shelf.entities.ShelfContent;
import com.axher.backend.catalog.shelf.repositories.ShelfContentRepository;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.core.repositories.ContentRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.PositionUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ShelfContentService {


    private final ShelfContentRepository shelfContentRepository;
    private final ContentRepository contentRepository;
    private final ContentShelfService contentShelfService;


    public List<ShelfContent> findAllByShelf(Integer shelfId){

        contentShelfService.findById(shelfId);

        return shelfContentRepository
                .findByContentShelf_ContentShelfIdOrderByPositionAsc(shelfId);
    }

    public void addContent(Integer shelfId, CreateShelfContentDto dto) {
        ContentShelf shelf = contentShelfService.findById(shelfId);
        Content content = findContent(dto.getContentId());
        validateContentTarget(shelf, content);
        if(shelfContentRepository
                .existsByContentShelfAndContent(shelf, content)) {
            throw new DuplicateResourceException(
                    "El contenido ya existe en el shelf"
            );
        }


        List<ShelfContent> items =
                shelfContentRepository
                        .findByContentShelfOrderByPositionAsc(shelf);
        int position = PositionUtils.normalizeInsertPosition(dto.getPosition(), items.size());
        PositionUtils.openPosition(
                items,
                position,
                ShelfContent::getPosition,
                ShelfContent::setPosition
        );
        ShelfContent shelfContent = new ShelfContent();
        shelfContent.setContentShelf(shelf);
        shelfContent.setContent(content);
        shelfContent.setPosition(position);

        /*
         NUEVO:
         Guardado explícito.
         Aunque Hibernate puede hacerlo con dirty checking,
         esto deja clara la intención del negocio.
        */
        shelfContentRepository.saveAll(items);
        shelfContentRepository.save(shelfContent);
    }




    public void updatePosition(Integer shelfContentId, UpdateShelfContentDto dto) {

        ShelfContent movedItem =
                findShelfContent(shelfContentId);

        List<ShelfContent> items =
                shelfContentRepository
                    .findByContentShelfOrderByPositionAsc(
                        movedItem.getContentShelf()
                    );

        PositionUtils.move(
            items,
            shelfContentId,
            dto.getPosition(),
            ShelfContent::getShelfContentId,
            ShelfContent::getPosition,
            ShelfContent::setPosition
        );

        shelfContentRepository.saveAll(items);
        shelfContentRepository.flush();
        //shelfContentRepository.save(movedItem);

    }

    public void delete(Integer shelfContentId) {

        ShelfContent shelfContent = findShelfContent(shelfContentId);
        ContentShelf shelf = shelfContent.getContentShelf();
        int deletedPosition = shelfContent.getPosition();

        List<ShelfContent> items =
                shelfContentRepository
                    .findByContentShelfAndPositionGreaterThanOrderByPositionAsc(
                            shelf,
                            deletedPosition
                    );
        PositionUtils.closePosition(
            items,
            deletedPosition,
            ShelfContent::getPosition,
            ShelfContent::setPosition
        );

        shelfContentRepository.saveAll(items);
        shelfContentRepository.delete(shelfContent);
    }


    

    private Content findContent(Integer id){
        return contentRepository.findById(id)

                .orElseThrow(
                    () -> new ResourceNotFoundException(
                        "Contenido no encontrado: " + id
                    )
                );
    }


    private ShelfContent findShelfContent(Integer id){

        return shelfContentRepository.findById(id)
                .orElseThrow(
                    () -> new ResourceNotFoundException(
                        "Registro no encontrado: " + id
                    )
                );
    }


    private void validateContentTarget(
            ContentShelf shelf,
            Content content
    ){

        switch(shelf.getTarget()){

            case HOME:
                return;

            case MOVIES:
                if(content.getType() != ContentTypeEnum.MOVIE){

                    throw new IllegalArgumentException(
                        "Solo se pueden agregar películas"
                    );
                }
                return;

            case SERIES:
                if(content.getType() != ContentTypeEnum.SERIE){
                    throw new IllegalArgumentException(
                        "Solo se pueden agregar series"
                    );
                }

                return;

            default:

                throw new IllegalArgumentException(
                    "Target no soportado: "
                    + shelf.getTarget()
                );
        }
    }

}