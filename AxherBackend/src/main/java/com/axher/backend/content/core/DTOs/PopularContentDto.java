package com.axher.backend.content.core.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PopularContentDto {
    
    private Integer contentId;
    private String title;
    private String posterUrl;
    private Long watchedSeconds;
}
