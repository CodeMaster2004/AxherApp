package com.axher.backend.users.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.users.DTOs.UpdateUserProfileRequestDto;
import com.axher.backend.users.DTOs.UserProfileResponseDto;
import com.axher.backend.users.entities.UserProfiles;
import com.axher.backend.users.entities.Users;
import com.axher.backend.users.mapper.UserProfilesMapper;
import com.axher.backend.users.repositories.UsersRepository;
import com.axher.backend.users.service.UserProfilesService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class UserProfilesController {
    
    private final UserProfilesService userProfilesService;
    private final UsersRepository usersRepository;
    private final UserProfilesMapper mapper;

    @GetMapping("/{profileId}")
    public ResponseEntity<UserProfileResponseDto> getProfileById(@PathVariable Integer profileId){
        UserProfiles profile = userProfilesService.getProfileById(profileId);
        return ResponseEntity.ok(mapper.toDto(profile));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<UserProfileResponseDto> getProfileByUserId(@PathVariable Integer userId){
        Users user = usersRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserProfiles profile = userProfilesService.getProfileByUser(user);
        return ResponseEntity.ok(mapper.toDto(profile));
    }

    @PatchMapping("/{profileId}")
    @PreAuthorize("hasAuthority('PROFILE:EDIT')")
    public ResponseEntity<UserProfileResponseDto> updateProfile(
        @PathVariable Integer profileId,
        @ModelAttribute UpdateUserProfileRequestDto dto
    ){
        UserProfiles update = userProfilesService.updateProfile(profileId, dto);
        return ResponseEntity.ok(mapper.toDto(update));
    }
}

