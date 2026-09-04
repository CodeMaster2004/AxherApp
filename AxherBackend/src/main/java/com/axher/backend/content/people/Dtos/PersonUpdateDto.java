package com.axher.backend.content.people.Dtos;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonUpdateDto {
    
    @Size(max = 100)
    private String firstName;

    @Size(max = 100)
    private String lastName;

    private MultipartFile photo;
}
