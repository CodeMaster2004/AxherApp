package com.axher.backend.content.people.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonResponseDto {
    
    private Integer personId;
    private String firstName;
    private String lastName;
    private String photo;
}
