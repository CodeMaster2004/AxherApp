package com.axher.backend.catalog.shelf.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContentShelfTranslationRequestDto {

    @NotNull
    private Integer languageId;

    @NotBlank
    @Size(max = 100)
    private String name;
}