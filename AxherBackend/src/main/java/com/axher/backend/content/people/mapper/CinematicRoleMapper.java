package com.axher.backend.content.people.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.people.Dtos.CinematicRoleResponseDto;
import com.axher.backend.content.people.entities.CinematicRole;
import com.axher.backend.content.people.service.CinematicRoleLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CinematicRoleMapper {

    private final CinematicRoleLocalizationService localizationService;

    public CinematicRoleResponseDto toDto(
            CinematicRole role
    ) {

        if (role == null) {
            return null;
        }

        CinematicRoleResponseDto dto = new CinematicRoleResponseDto();

        dto.setCinematicRoleId(role.getCinematicRoleId());
        dto.setCode(role.getCode());

        var localized = localizationService.resolve(role);

        dto.setName(localized.name());
        dto.setDescription(localized.description());
        dto.setLanguageId(localized.languageId());

        return dto;
    }
}