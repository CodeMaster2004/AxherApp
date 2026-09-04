package com.axher.backend.content.people.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.people.Dtos.ContentPersonRoleResponseDto;
import com.axher.backend.content.people.entities.ContentPersonRole;
import com.axher.backend.content.people.mapper.ContentPersonRoleMapper;
import com.axher.backend.content.people.service.ContentPersonRoleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/contents")
public class ContentPersonRoleController {

    private final ContentPersonRoleService service;
    private final ContentPersonRoleMapper mapper;

    @GetMapping("/{contentId}/people")
    public List<ContentPersonRoleResponseDto> getByContent(
            @PathVariable Integer contentId
    ) {

        List<ContentPersonRole> contentPersonRoles =
                service.getPublicByContent(contentId);

        return contentPersonRoles
                .stream()
                .map(mapper::toDto)
                .toList();
    }
    
}
