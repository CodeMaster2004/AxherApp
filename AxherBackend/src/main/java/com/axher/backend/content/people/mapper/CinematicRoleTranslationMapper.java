package com.axher.backend.content.people.mapper;

import org.springframework.stereotype.Component;
import com.axher.backend.content.people.Dtos.CinematicRoleTranslationDto;
import com.axher.backend.content.people.entities.CinematicRoleTranslation;

@Component
public class CinematicRoleTranslationMapper {

    public CinematicRoleTranslationDto toDto(
            CinematicRoleTranslation translation
    ) {

        if (translation == null) {
            return null;
        }

        CinematicRoleTranslationDto dto =
                new CinematicRoleTranslationDto();

        dto.setCinematicRoleId(
                translation.getCinematicRole()
                        .getCinematicRoleId()
        );

        dto.setLanguageId(
                translation.getLanguage()
                        .getLanguageId()
        );

        dto.setLanguageCode(
                translation.getLanguage()
                        .getCode()
        );

        dto.setLanguageName(
                translation.getLanguage()
                        .getName()
        );

        dto.setName(
                translation.getName()
        );

        dto.setDescription(
                translation.getDescription()
        );

        return dto;
    }
}
