package com.axher.backend.support.tickets.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupportCategoryTranslationRequestDto {

    private Integer languageId;
    private String name;
    private String description;
}
