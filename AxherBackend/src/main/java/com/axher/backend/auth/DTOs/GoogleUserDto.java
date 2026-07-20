package com.axher.backend.auth.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GoogleUserDto {

    private String googleId;
    private String email;
    private String name;
    private String givenName;
    private String familyName;
    private String picture;
}
