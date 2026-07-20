package com.axher.backend.auth.DTOs;

import lombok.Data;

@Data
public class UserLoginRequestDto {
    private String login;
    private String password;
}
