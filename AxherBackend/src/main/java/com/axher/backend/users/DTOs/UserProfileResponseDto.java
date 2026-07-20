package com.axher.backend.users.DTOs;

import java.time.LocalDate;

import com.axher.backend.users.entities.GenderEnum;

import lombok.Data;

@Data
public class UserProfileResponseDto {
    private Integer profileId;
    private String username;
    private String displayName;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private GenderEnum gender;
    private String bio;
    private String location;
    private String website;
    private String profilePicture;
    private String profileBannerUrl;
    private String profileVisibility;
}
