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

        validatePosition(dto.getPosition());

        List<ShelfContent> items =
                shelfContentRepository
                        .findByContentShelfOrderByPositionAsc(shelf);
        int position = Math.min(
                dto.getPosition(),
                items.size() + 1
        );

        /*
         NUEVO:
         Movemos los elementos existentes para abrir espacio
         antes de insertar el nuevo.
        */
        for (ShelfContent item : items) {

            if(item.getPosition() >= position){

                item.setPosition(
                    item.getPosition() + 1
                );
            }
        }
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


        validatePosition(dto.getPosition());

        ShelfContent movedItem =
                findShelfContent(shelfContentId);

        int oldPosition = movedItem.getPosition();
        int newPosition = dto.getPosition();

        if(oldPosition == newPosition){
            return;
        }

        List<ShelfContent> items =
                shelfContentRepository
                    .findByContentShelfOrderByPositionAsc(
                        movedItem.getContentShelf()
                    );

        /*
         Evita posiciones mayores al tamaño del shelf.
        */
        newPosition = Math.min(
                newPosition,
                items.size()
        );

        if(newPosition < oldPosition){

            /*

             los elementos 2 y 3 bajan una posición.
            */
            for(ShelfContent item : items){
                if(item.getShelfContentId()
                        .equals(shelfContentId)){
                    continue;
                }
                if(item.getPosition() >= newPosition
                    && item.getPosition() < oldPosition){
                    item.setPosition(
                        item.getPosition() + 1
                    );
                }
            }

        }else{

            /*
             los elementos 2 y 3 suben una posición.
            */
            for(ShelfContent item : items){

                if(item.getShelfContentId()
                        .equals(shelfContentId)){
                    continue;
                }

                if(item.getPosition() <= newPosition
                    && item.getPosition() > oldPosition){
                    item.setPosition(
                        item.getPosition() - 1
                    );
                }

            }
        }

        movedItem.setPosition(newPosition);

        /*
         NUEVO:
         Persistimos primero los cambios del resto.
         Importante si tienes UNIQUE(shelf_id, position)
         */
        shelfContentRepository.saveAll(items);
        shelfContentRepository.flush();
        shelfContentRepository.save(movedItem);

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
        /*
         Después de eliminar,
         cerramos el hueco de posiciones.
        */
        for(ShelfContent item : items){

            item.setPosition(
                    item.getPosition() - 1
            );
        }

        shelfContentRepository.saveAll(items);
        shelfContentRepository.delete(shelfContent);
    }


    private void validatePosition(Integer position){
        if(position == null || position <= 0){

            throw new IllegalArgumentException(
                    "La posición debe ser mayor a 0"
            );
        }
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