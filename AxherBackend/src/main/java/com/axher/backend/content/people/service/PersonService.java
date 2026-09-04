package com.axher.backend.content.people.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.content.people.Dtos.PersonCreateDto;
import com.axher.backend.content.people.Dtos.PersonUpdateDto;
import com.axher.backend.content.people.entities.Person;
import com.axher.backend.content.people.repositories.ContentPersonRoleRepository;
import com.axher.backend.content.people.repositories.PersonRepository;
import com.axher.backend.infrastructure.storage.FileStorageService;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonService {

    private final PersonRepository repository;
    private final ContentPersonRoleRepository contentPersonRoleRepository;
    private final FileStorageService fileStorageService;


    // ==========================================
    // LISTAR
    // ==========================================
    public Page<Person> findAll(Pageable pageable, String search){
        
        if(search == null || search.isBlank()){
            return repository.findAll(pageable);
        }
        return repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                search.trim(),
                search.trim(),
                pageable
        );
    }

    // ==========================================
    // OBTENER POR ID
    // ==========================================
    public Person findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                    "Persona no encontrada" + id
                ));
    }

    // ==========================================
    // CREAR
    // ==========================================
    public Person create(PersonCreateDto dto) {

        validateCreate(dto);

        Person person = new Person();

        person.setFirstName(normalizeRequiredName(dto.getFirstName()));
        person.setLastName(normalizeOptionalName(dto.getLastName()));
        if(dto.getPhoto() != null && !dto.getPhoto().isEmpty()){
            String photoUrl = fileStorageService.saveFile(dto.getPhoto(), "people");
            person.setPhoto(photoUrl);
        }
        
        return repository.save(person);
    }

    // ==========================================
    // ACTUALIZAR
    // ==========================================
    public Person update(Integer id, PersonUpdateDto dto) {
        
        Person person = findById(id);

        if(dto.getFirstName() != null){
            person.setFirstName(normalizeRequiredName(dto.getFirstName()));

        }
        if(dto.getLastName() != null){
            person.setLastName(normalizeOptionalName(dto.getLastName()));
        }

        if (dto.getPhoto() != null
                && !dto.getPhoto().isEmpty()) {

            String oldPhoto =
                    person.getPhoto();

            String newPhoto =
                    fileStorageService.saveFile(
                            dto.getPhoto(),
                            "people"
                    );

            person.setPhoto(newPhoto);

            fileStorageService.deleteFile(oldPhoto);
        }

        return repository.save(person);
    }

    public void delete(Integer id) {

        Person person = findById(id);

        if(contentPersonRoleRepository.countByPerson_PersonId(id) > 0){
            throw new IllegalStateException(
                    "No se puede eliminar la persona porque "
                    + "tiene créditos asociados a contenido"
            );
        }

        String photo = person.getPhoto();

        repository.delete(person);

        fileStorageService.deleteFile(photo);
    }

    // ==========================================
    // VALIDACIONES
    // ==========================================
    private void validateCreate(PersonCreateDto dto) {

        if(dto.getFirstName() == null || dto.getFirstName().isBlank()){
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
    }

    private String normalizeRequiredName(String value){

        if(value == null){
            throw new IllegalArgumentException("El nombre es obligatorio");
        }

        String normalized = value.trim();

        if(normalized.isBlank()){
            throw new IllegalArgumentException("El nombre no puede estar vacío");
        }

        return normalized;
    }

    private String normalizeOptionalName(String value){

        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isBlank()
                ? null
                : normalized;
    }

    
}
