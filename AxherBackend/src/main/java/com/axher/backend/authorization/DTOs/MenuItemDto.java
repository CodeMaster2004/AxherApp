package com.axher.backend.authorization.DTOs;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemDto {
    private String id;
    private String label;
    private String href;
    private String permission;
    private List<MenuItemDto> children;
}
