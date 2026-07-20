package com.axher.backend.users.DTOs;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import com.axher.backend.users.entities.GenderEnum;

import lombok.Data;

@Data
public class UpdateUserProfileRequestDto {
    private String displayName;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private GenderEnum gender;
    private String bio;
    private String location;
    private String website;
    private MultipartFile profilePicture;
    private MultipartFile profileBannerUrl;
    private String profileVisibility; // PUBLIC o PRIVATE
}
