package com.axher.backend.content.core.controller;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.core.DTOs.ContentStatusRequestDto;
import com.axher.backend.content.core.DTOs.ContentStatusResponseDto;
import com.axher.backend.content.core.entities.ContentStatus;
import com.axher.backend.content.core.mapper.ContentStatusMapper;
import com.axher.backend.content.core.service.ContentStatusService;
import com.axher.backend.shared.util.SortUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/content-status")
public class ContentStatusController {

    private final ContentStatusService service;
    private final ContentStatusMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "contentStatusId", "status", "description"
    );

    @GetMapping
    @PreAuthorize("hasAuthority('CONTENT_STATUS:VIEW')")
    public Page<ContentStatusResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "contentStatusId,desc") String sort,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Integer languageId
    ){
        Sort sortObj = SortUtils.parseSort(
            sort,
            ALLOWED_SORT_FIELDS,
            "contentStatusId"
        );

        Page<ContentStatus> statusPage = service.findAll(
            PageRequest.of(page, size, sortObj),
            languageId,
            search
        );

        return statusPage.map(mapper::toDto);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('CONTENT_STATUS:VIEW')")
    public ResponseEntity<ContentStatusResponseDto> findById(@PathVariable Integer id){
        ContentStatus status = service.findById(id);

        return ResponseEntity.ok(
            mapper.toDto(status)
        );    
    }

   @PostMapping
    @PreAuthorize("hasAuthority('CONTENT_STATUS:CREATE')")
    public ResponseEntity<ContentStatusResponseDto> create(
        @Valid @RequestBody ContentStatusRequestDto dto){

        ContentStatus createdStatus = service.create(dto);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(mapper.toDto(createdStatus));

    }
   

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('CONTENT_STATUS:EDIT')")
    public ResponseEntity<ContentStatusResponseDto> update (@PathVariable Integer id,@RequestBody ContentStatusRequestDto dto){
        
        ContentStatus updatedStatus = service.update(id, dto);

        return ResponseEntity.ok(
            mapper.toDto(updatedStatus)
        );
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CONTENT_STATUS:DELETE')")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    

    

}