package com.axher.backend.content.people.controller;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.people.Dtos.PersonCreateDto;
import com.axher.backend.content.people.Dtos.PersonResponseDto;
import com.axher.backend.content.people.Dtos.PersonUpdateDto;
import com.axher.backend.content.people.entities.Person;
import com.axher.backend.content.people.mapper.PersonMapper;
import com.axher.backend.content.people.service.PersonService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/people")
public class AdminPersonController {

    private final PersonService service;
    private final PersonMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "personId",
            "firstName",
            "lastName"
    );

    // ==============================
    // OBTENER LISTADO PAGINADO
    // ==============================
    @GetMapping
    public Page<PersonResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "personId,asc") String sort,
        @RequestParam(required = false) String search
    ){
        Sort sortObj = SortUtils.parseSort(
                sort,
                ALLOWED_SORT_FIELDS,
                "personId"
        );

        Page<Person> personPage =
                service.findAll(
                        PageRequest.of(
                                page,
                                size,
                                sortObj
                        ),
                        search
                );
        return personPage.map(mapper::toDto);
    }

    // ==============================
    // OBTENER POR ID
    // ==============================
    @GetMapping("/{id}")
    public ResponseEntity<PersonResponseDto> findById(
        @PathVariable Integer id
    ){
        Person person = service.findById(id);

        return ResponseEntity.ok(
                mapper.toDto(person)
        );
    }

    // ==============================
    // CREAR
    // ==============================
    @PostMapping
    public ResponseEntity<PersonResponseDto> create(
            @ModelAttribute PersonCreateDto dto
    ) {
        Person created = service.create(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(mapper.toDto(created));
    }

    // ==============================
    // ACTUALIZAR
    // ==============================
    @PatchMapping("/{id}")
    public ResponseEntity<PersonResponseDto> update(

            @PathVariable Integer id,

            @ModelAttribute PersonUpdateDto dto

    ) {
        Person updated =
                service.update(id, dto);

        return ResponseEntity.ok(
                mapper.toDto(updated)
        );
    }

    // ==============================
    // ELIMINAR
    // ==============================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id
    ) {

        service.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
    
}
