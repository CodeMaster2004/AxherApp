package com.axher.backend.users.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.users.DTOs.UserProfileResponseDto;
import com.axher.backend.users.entities.UserProfiles;

@Component
public class UserProfilesMapper {
    
    @Value("${app.base-url}")
    private String baseUrl;

    public UserProfileResponseDto toDto(UserProfiles profile){
        UserProfileResponseDto dto = new UserProfileResponseDto();

        dto.setProfileId(profile.getProfileId());
        dto.setUsername(profile.getUsername());
        dto.setDisplayName(profile.getDisplayName());
        dto.setFirstName(profile.getFirstName());
        dto.setLastName(profile.getLastName());
        dto.setBirthDate(profile.getBirthDate());
        dto.setGender(profile.getGender());
        dto.setBio(profile.getBio());
        dto.setLocation(profile.getLocation());
        dto.setWebsite(profile.getWebsite());
        dto.setProfilePicture(buildUrl(profile.getProfilePicture()));
        dto.setProfileBannerUrl(buildUrl(profile.getProfileBannerUrl()));
        dto.setProfileVisibility(profile.getProfileVisibility());

        return dto;
    }


    private String buildUrl(String path){
        if(path == null) return null;

        // Si ya es URL completa (https:// o http://), no le anteponemos el baseUrl.
        if(path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }

        // De otro modo es ruta relativa interna.
        return baseUrl + path;
    }
}

