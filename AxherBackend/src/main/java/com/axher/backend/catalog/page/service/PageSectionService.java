package com.axher.backend.catalog.page.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.axher.backend.catalog.page.DTOs.PageSectionCreateDto;
import com.axher.backend.catalog.page.DTOs.PageSectionDto;
import com.axher.backend.catalog.page.DTOs.PageSectionUpdateDto;
import com.axher.backend.catalog.page.entities.PageSection;
import com.axher.backend.catalog.page.entities.PageType;
import com.axher.backend.catalog.page.mapper.PageSectionMapper;
import com.axher.backend.catalog.page.repositories.PageSectionRepository;
import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.catalog.shelf.repositories.ContentShelfRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.PositionUtils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PageSectionService {

    private final PageSectionRepository repository;
    private final PageSectionMapper mapper;
    private final ContentShelfRepository contentShelfRepository;

    public List<PageSectionDto> getPageSection(PageType page) {
        
        return repository.findByPageAndActiveTrueOrderByDisplayOrderAsc(page)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public List<PageSectionDto> getAllByPage(PageType page) {

        return repository.findByPageOrderByDisplayOrderAsc(page)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public PageSectionDto getById(Integer id) {
        PageSection section = repository.findById(id)
            .orElseThrow(() -> 
                new ResourceNotFoundException(
                    "PageSection no encontrada: " + id
                )
            );
        return mapper.toDto(section);
    }   

    public PageSectionDto create(PageSectionCreateDto dto) {

        List<PageSection> sections =
                repository.findByPageOrderByDisplayOrderAsc(
                        dto.getPage()
                );

        int displayOrder =
                PositionUtils.normalizeInsertPosition(
                        dto.getDisplayOrder(),
                        sections.size()
                );

        PositionUtils.openPosition(
                sections,
                displayOrder,
                PageSection::getDisplayOrder,
                PageSection::setDisplayOrder
        );

        PageSection section =
                new PageSection();

        section.setPage(dto.getPage());
        section.setType(dto.getType());
        section.setDisplayOrder(displayOrder);

        section.setActive(
                dto.getActive() != null
                        ? dto.getActive()
                        : true
        );


        if (dto.getContentShelfId() != null) {

            ContentShelf shelf =
                    contentShelfRepository
                            .findById(dto.getContentShelfId())
                            .orElseThrow(
                                    () -> new ResourceNotFoundException(
                                            "Shelf no encontrado: "
                                                    + dto.getContentShelfId()
                                    )
                            );

            section.setContentShelf(shelf);
        }

        repository.saveAll(sections);

        return mapper.toDto(
                repository.save(section)
        );
    }



    public PageSectionDto update(Integer id, PageSectionUpdateDto dto){

        PageSection section = repository.findById(id)
            .orElseThrow(() -> 
                new ResourceNotFoundException(
                    "PageSection no encontrada: " + id
                ));
        if(dto.getType() != null ) {
            
            section.setType(dto.getType());
        }
        if(dto.getActive() != null) {
            
            section.setActive(dto.getActive());
        }

        if (dto.getContentShelfId() != null) {

            ContentShelf shelf =
                contentShelfRepository
                    .findById(dto.getContentShelfId())
                    .orElseThrow(() ->
                        new ResourceNotFoundException(
                            "Shelf no encontrado: "
                            + dto.getContentShelfId()
                        )
                    );

            section.setContentShelf(shelf);
        }

        if (dto.getDisplayOrder() != null &&
            !dto.getDisplayOrder()
                .equals(section.getDisplayOrder())) {

            List<PageSection> sections =
                repository.findByPageOrderByDisplayOrderAsc(
                    section.getPage()
                );

            PositionUtils.move(
                sections,
                id,
                dto.getDisplayOrder(),
                PageSection::getPageSectionId,
                PageSection::getDisplayOrder,
                PageSection::setDisplayOrder
            );

            repository.saveAll(sections);
            repository.flush();
        }
        return mapper.toDto(repository.save(section));


    }

    public void delete(Integer id) {

        PageSection section = findById(id);
        PageType page = section.getPage();
        int deletedOrder = section.getDisplayOrder();

        List<PageSection> sections = repository.findByPageOrderByDisplayOrderAsc(page);

        PositionUtils.closePosition(
                sections,
                deletedOrder,
                PageSection::getDisplayOrder,
                PageSection::setDisplayOrder
        );

        repository.saveAll(sections);
        repository.delete(section);
    }

    @Transactional
    public PageSection toggleActive(Integer id) {
        PageSection section = findById(id);
        section.setActive(
            !Boolean.TRUE.equals(section.getActive())
        );
        return repository.save(section);
    }


    private PageSection findById(Integer id) {

        return repository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "PageSection no encontrada: " + id
                )
            );
    }

    
    
}
