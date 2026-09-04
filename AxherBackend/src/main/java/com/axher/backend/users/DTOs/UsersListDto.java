package com.axher.backend.users.DTOs;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class UsersListDto {
    public Integer userId;
    public String email;
    public String username;
    public String preferredLanguageCode;
    public Boolean isConfirmed;
    public Instant createdAt;
    public Instant lastLogin;
    public List<String> roles;
}
