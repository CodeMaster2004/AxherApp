package com.axher.backend.support.SupportFaq.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupportFaqResponseDto {

    private Integer supportFaqId;
    private Integer supportCategoryId;
    private Integer displayOrder;
    private Boolean active;
    private String question;
    private String answer;
    private Integer languageId;
    
}
