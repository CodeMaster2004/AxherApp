package com.axher.backend.authorization.DTOs;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignPermissionsRequestDto {

    private List<Integer> addPermissionIds;

    private List<Integer> removePermissionIds;
    
}
