package com.axher.backend.content.people.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.people.Dtos.PersonResponseDto;
import com.axher.backend.content.people.entities.Person;

@Component
public class PersonMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    public PersonResponseDto toDto(Person person) {
        PersonResponseDto dto = new PersonResponseDto();
        dto.setPersonId(person.getPersonId());
        dto.setFirstName(person.getFirstName());
        dto.setLastName(person.getLastName());
        dto.setPhoto(buildUrl(person.getPhoto()));
        return dto;
    }

    public String buildUrl(String path){
        if(path == null){
            return null;
        }
        return baseUrl + path;
    }
    
}
