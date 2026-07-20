package com.axher.backend.users.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.axher.backend.auth.DTOs.GoogleUserDto;
import com.axher.backend.infrastructure.storage.FileStorageService;
import com.axher.backend.users.DTOs.UpdateUserProfileRequestDto;
import com.axher.backend.users.entities.UserProfiles;
import com.axher.backend.users.entities.Users;
import com.axher.backend.users.repositories.UserProfilesRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProfilesService {

    private final UserProfilesRepository userProfilesRepository;
    private final FileStorageService fileStorageService;

    public UserProfiles createProfile(Users user, GoogleUserDto userInfo) {

    return userProfilesRepository.findByUser(user)
        .orElseGet(() -> {
            UserProfiles profile = new UserProfiles();
            profile.setUser(user);

            String emailPrefix = user.getEmail().split("@")[0];

            // Prioridad: OAuth → fallback email
            String firstName = userInfo != null && userInfo.getGivenName() != null
                ? userInfo.getGivenName()
                : generateFirstName(emailPrefix);

            String lastName = userInfo != null && userInfo.getFamilyName() != null
                ? userInfo.getFamilyName()
                : generateLastName(emailPrefix);

            String displayName = userInfo != null && userInfo.getName() != null
                ? userInfo.getName()
                : firstName;

            String picture = userInfo != null && userInfo.getPicture() != null
                ? userInfo.getPicture()
                : "profile_pictures/default/avatar.png";

            profile.setFirstName(firstName);
            profile.setLastName(lastName);
            profile.setDisplayName(displayName);
            profile.setProfilePicture(picture);

            // Username SIEMPRE propio
            profile.setUsername(generateUsername(emailPrefix));

            profile.setProfileBannerUrl("profile_banners/default/banner.png");
            profile.setProfileVisibility("PUBLIC");

            profile.setCreatedAt(LocalDateTime.now());
            profile.setUpdatedAt(LocalDateTime.now());

            return userProfilesRepository.save(profile);
        });
}
    //Obtenr Perfil Por usuario
    public UserProfiles getProfileByUser(Users user) {
        return userProfilesRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
    }

    //Obtener perfil por id
    public UserProfiles getProfileById(Integer profileId){
        return userProfilesRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
    }

    //Acutualizar perfil
    public UserProfiles updateProfile(Integer profileId, UpdateUserProfileRequestDto dto){

        UserProfiles profile = userProfilesRepository.findById(profileId)
            .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

        if(dto.getDisplayName() != null){
            profile.setDisplayName(dto.getDisplayName());
        }
        if(dto.getFirstName() != null){
            profile.setFirstName(dto.getFirstName());
        }
        if(dto.getLastName() != null){
            profile.setLastName(dto.getLastName());
        }
        if(dto.getBirthDate() != null){
            profile.setBirthDate(dto.getBirthDate());
        }
        if(dto.getGender() != null){
            profile.setGender(dto.getGender());
        }
        if(dto.getBio() != null){
            profile.setBio(dto.getBio());
        }
        if(dto.getLocation() != null){
            profile.setLocation(dto.getLocation());
        }
        if(dto.getWebsite() != null){
            profile.setWebsite(dto.getWebsite());
        }

        if(dto.getProfilePicture() != null && !dto.getProfilePicture().isEmpty()){
            String newProfilePicture = fileStorageService.saveFile(dto.getProfilePicture(), "profile_pictures");
            
            // Solo borrar si no es la imagen por defecto
            if(!profile.getProfilePicture().contains("default/avatar.png")){
                fileStorageService.deleteFile(profile.getProfilePicture());
            }

            profile.setProfilePicture(newProfilePicture);
        }

        if(dto.getProfileBannerUrl() != null && !dto.getProfileBannerUrl().isEmpty()){
            String newProfileBannerUrl = fileStorageService.saveFile(dto.getProfileBannerUrl(), "profile_banners");
            
            if(!profile.getProfileBannerUrl().contains("default/banner.png")){
                fileStorageService.deleteFile(profile.getProfileBannerUrl());
            }

            profile.setProfileBannerUrl(newProfileBannerUrl);
        }
        if(dto.getProfileVisibility() != null){
            profile.setProfileVisibility(dto.getProfileVisibility());
        }

        profile.setUpdatedAt(LocalDateTime.now());
        return userProfilesRepository.save(profile);
    }
    
    private String generateFirstName(String emailPrefix){
        String name = emailPrefix.split("[._-]")[0];
        return capitalize(name);
    }

    private String generateLastName(String emailPrefix){
        String[] parts = emailPrefix.split("[._-]");
        return parts.length > 1 ? capitalize(parts[1]) : "User";
    }

    private String generateUsername(String emailPrefix){
        int random = (int)(Math.random() * 9000 + 1000);
        //permite guiones, puntos o subrayados en el username
        return emailPrefix.replaceAll("[^a-zA-Z0-9._-]", "") + random;
    }

    private String capitalize (String str){
        if(str == null || str.isEmpty()) return str;
        return str.substring(0,1).toUpperCase() + str.substring(1).toLowerCase();
    }
}

