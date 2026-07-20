package com.axher.backend.authorization.DTOs;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class AssignRolesRequestDto {

    @NotEmpty(message = "Debe proporcionar al menos un rol")
    private List<String> roles;
    
}

