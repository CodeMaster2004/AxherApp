package com.axher.backend.content.core.controller;

import java.math.BigDecimal;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.core.DTOs.ContentDetailDto;
import com.axher.backend.content.core.DTOs.CreateContentDto;
import com.axher.backend.content.core.DTOs.ContentStatusUpdateDto;
import com.axher.backend.content.core.DTOs.UpdateContentDto;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.core.mapper.ContentMapper;
import com.axher.backend.content.core.service.ContentService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/contents")
public class AdminContentController {

    private final ContentService service;
    private final ContentMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "contentId", "title", "price", "registeredAt", "type"
    );

    //==============================
    // OBTENER LISTADO PAGINADO CON BUSQUEDA SIMPLE
    //==============================
    @GetMapping
    @PreAuthorize("hasAuthority('CONTENT:VIEW')")
    public Page<ContentDetailDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "contentId,desc") String sort,
        @RequestParam(required = false) String search
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "contentId");
        Page<Content> contentPage = service.findAll(PageRequest.of(page, size, sortObj), search);
        return contentPage.map(mapper::toDto);
    }

    //==============================
    // BUSQUEDA AVANZADA CON MULTIPLES FILTROS
    //==============================
    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public Page<ContentDetailDto> search(
        @RequestParam(required = false) String title,
        @RequestParam(required = false) Integer categoryId,
        @RequestParam(required = false) Integer statusId,
        @RequestParam(required = false) BigDecimal discountAmount,
        @RequestParam(required = false) ContentTypeEnum type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "contentId,desc") String sort
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "contentId");
        Page<Content> contentPage = service.searchContents(title, categoryId, statusId, discountAmount, type, PageRequest.of(page, size, sortObj)
      );
      return contentPage.map(mapper::toDto);
    }

    // ==============================
    // OBTENER SOLO LOS CONTENIDOS CON DESCUENTO APLICADO (PÚBLICO)
    // ==============================
    @GetMapping("/with-discount")
    @PreAuthorize("permitAll()")
    public Page<ContentDetailDto> findWithDiscount(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "contentId,desc") String sort
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "contentId");
        Page<Content> contentPage = service.findWithDiscount(PageRequest.of(page, size, sortObj));
        return contentPage.map(mapper::toDto);
    }
    
    // ==============================
    // OBTENER POR ID
    // ==============================
    @GetMapping("/{contentId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ContentDetailDto> findById(@PathVariable Integer contentId){
        Content content = service.findPublicById(contentId);
        return ResponseEntity.ok(mapper.toDto(content));
    }


    // ==============================
    // CREAR
    // ==============================
    @PostMapping
    @PreAuthorize("hasAuthority('CONTENT:CREATE')")
    public ResponseEntity<ContentDetailDto> create(
        @ModelAttribute CreateContentDto dto
    ){
        Content createcContent = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(createcContent));
    }

    //=============================
    // ACTUALIZAR
    //=============================
    @PatchMapping("/{contentId}")
    @PreAuthorize("hasAuthority('CONTENT:EDIT')")
    public ResponseEntity<ContentDetailDto> update(
        @PathVariable Integer contentId,
        @ModelAttribute UpdateContentDto dto
    ){
        Content updateContent = service.update(contentId, dto);
        return ResponseEntity.ok(mapper.toDto(updateContent));
    }

    // ==============================
    // ACTUALIZAR ESTADO
    // ==============================
    @PatchMapping("/{contentId}/status")
    @PreAuthorize("hasAuthority('CONTENT:EDIT')")
    public ResponseEntity<ContentDetailDto> updateStatus(
        @PathVariable Integer contentId,
        @RequestBody ContentStatusUpdateDto dto
    ){
        Content updatedContent = service.updateStatus(contentId, dto.getStatusId());
        return ResponseEntity.ok(mapper.toDto(updatedContent));
    }

    // ==============================
    // ELIMINAR
    // ==============================
    @DeleteMapping("/{contentId}")
    @PreAuthorize("hasAuthority('CONTENT:DELETE')")
    public ResponseEntity<Void> delete(@PathVariable Integer contentId){
        service.delete(contentId);
        return ResponseEntity.noContent().build();
    }

}

