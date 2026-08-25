package com.axher.backend.users.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.users.DTOs.UpdateUserPreferencesRequestDto;
import com.axher.backend.users.service.UsersService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserPreferencesController {

    private final UsersService service;
    @PatchMapping("/preferences")
    public ResponseEntity<Void> updatePreferences(
        @RequestBody UpdateUserPreferencesRequestDto dto
    ) {

        service.updatePreferences(dto);

        return ResponseEntity.noContent().build();
    }
    
}
