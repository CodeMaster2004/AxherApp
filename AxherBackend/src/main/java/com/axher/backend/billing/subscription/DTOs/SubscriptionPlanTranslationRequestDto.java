package com.axher.backend.billing.subscription.DTOs;

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
public class SubscriptionPlanTranslationRequestDto {

    @NotNull
    private Integer languageId;

    @NotBlank
    @Size(max = 50)
    private String name;

    @Size(max = 500)
    private String description;
}