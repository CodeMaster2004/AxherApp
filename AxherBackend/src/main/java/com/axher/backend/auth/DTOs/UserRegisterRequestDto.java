package com.axher.backend.auth.DTOs;

import lombok.Data;

@Data
public class UserRegisterRequestDto {
    private String email;
    private String password;
    private String confirmPassword;
}
