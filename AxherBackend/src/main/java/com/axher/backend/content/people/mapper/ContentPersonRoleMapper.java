package com.axher.backend.content.people.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.people.Dtos.ContentPersonRoleResponseDto;
import com.axher.backend.content.people.entities.ContentPersonRole;
import com.axher.backend.content.people.service.CinematicRoleLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ContentPersonRoleMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    private final CinematicRoleLocalizationService localizationService;

    public ContentPersonRoleResponseDto toDto(
            ContentPersonRole contentPersonRole
    ) {

        ContentPersonRoleResponseDto dto =
                new ContentPersonRoleResponseDto();

        var localized =
                localizationService.resolve(
                        contentPersonRole.getCinematicRole()
                );

        dto.setContentPersonRoleId(
                contentPersonRole.getContentPersonRoleId()
        );

        dto.setPersonId(
                contentPersonRole
                        .getPerson()
                        .getPersonId()
        );

        dto.setPersonName(
                buildPersonName(
                        contentPersonRole
                                .getPerson()
                                .getFirstName(),
                        contentPersonRole
                                .getPerson()
                                .getLastName()
                )
        );

        dto.setPersonPhoto(
                buildUrl(
                        contentPersonRole
                                .getPerson()
                                .getPhoto()
                )
        );

        dto.setCinematicRoleId(
                contentPersonRole
                        .getCinematicRole()
                        .getCinematicRoleId()
        );

        dto.setCinematicRoleCode(
                contentPersonRole
                        .getCinematicRole()
                        .getCode()
        );

        dto.setCinematicRoleName(
                localized.name()
        );

        dto.setCharacterName(
                contentPersonRole
                        .getCharacterName()
        );

        dto.setOrderIndex(
                contentPersonRole
                        .getOrderIndex()
        );

        return dto;
    }

    private String buildPersonName(
            String firstName,
            String lastName
    ) {

        if (lastName == null || lastName.isBlank()) {
            return firstName;
        }

        return firstName + " " + lastName;
    }

    private String buildUrl(String path) {

        if (path == null) {
            return null;
        }

        return baseUrl + path;
    }
}