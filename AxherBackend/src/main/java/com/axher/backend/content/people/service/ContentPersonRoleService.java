package com.axher.backend.content.people.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.repositories.ContentRepository;
import com.axher.backend.content.core.service.ContentCatalogService;
import com.axher.backend.content.people.Dtos.ContentPersonRoleCreateDto;
import com.axher.backend.content.people.Dtos.ContentPersonRoleUpdateDto;
import com.axher.backend.content.people.entities.CinematicRole;
import com.axher.backend.content.people.entities.ContentPersonRole;
import com.axher.backend.content.people.entities.Person;
import com.axher.backend.content.people.repositories.CinematicRoleRepository;
import com.axher.backend.content.people.repositories.ContentPersonRoleRepository;
import com.axher.backend.content.people.repositories.PersonRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.PositionUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ContentPersonRoleService {

    private final ContentPersonRoleRepository repository;
    private final ContentRepository contentRepository;
    private final PersonRepository personRepository;
    private final CinematicRoleRepository cinematicRoleRepository;
    private final ContentCatalogService contentCatalogService;

    public Page<ContentPersonRole> findByContent(
        Integer contentId,
        Pageable pageable,
        String search
    ){
        
        findContentById(contentId);

        if (search == null || search.isBlank()) {

            return repository.findByContent_ContentIdOrderByOrderIndexAsc(
                    contentId,
                    pageable
            );
        }

        return repository.searchByContent(
                contentId,
                search.trim(),
                pageable
        );
    }

    public List<ContentPersonRole> getPublicByContent(
            Integer contentId
    ) {

    contentCatalogService.findCatalogById(contentId);

    return repository
            .findByContent_ContentIdOrderByOrderIndexAsc(
                    contentId
            );
    }

    public ContentPersonRole getById(Integer contentId, Long contentPersonRoleId){
        
        return findById(contentId, contentPersonRoleId);
    }

    public ContentPersonRole create(
        Integer contentId,
        ContentPersonRoleCreateDto dto
    ){
        Content content = findContentById(contentId);

        Person person = findPersonById(dto.getPersonId());

        CinematicRole cinematicRole = findCinematicRoleById(
                dto.getCinematicRoleId()
        );

        String characterName = normalizeCharacterName(
                dto.getCharacterName()
        );

        validateDuplicate(
                contentId,
                person.getPersonId(),
                cinematicRole.getCinematicRoleId(),
                characterName
        );

        List<ContentPersonRole> contentPersonRoles = repository
                .findByContent_ContentIdOrderByOrderIndexAsc(
                        contentId
                );

        int orderIndex = PositionUtils.normalizeInsertPosition(
                dto.getOrderIndex(),
                contentPersonRoles.size()
        );

        PositionUtils.openPosition(
                contentPersonRoles,
                orderIndex,
                ContentPersonRole::getOrderIndex,
                ContentPersonRole::setOrderIndex
        );

        ContentPersonRole contentPersonRole = new ContentPersonRole();

        contentPersonRole.setContent(content);
        contentPersonRole.setPerson(person);
        contentPersonRole.setCinematicRole(cinematicRole);
        contentPersonRole.setCharacterName(characterName);
        contentPersonRole.setOrderIndex(orderIndex);

        repository.saveAll(contentPersonRoles);

        return repository.save(contentPersonRole);
    }

    public ContentPersonRole update(
        Integer contentId,
        Long contentPersonRoleId,
        ContentPersonRoleUpdateDto dto
    ){

        ContentPersonRole contentPersonRole = findById(
                contentId,
                contentPersonRoleId
        );

        if(dto.getPersonId() != null){
            Person person = findPersonById(dto.getPersonId());
            contentPersonRole.setPerson(person);
        }

        if(dto.getCinematicRoleId() != null){
            CinematicRole cinematicRole = findCinematicRoleById(
                    dto.getCinematicRoleId()
            );
            contentPersonRole.setCinematicRole(cinematicRole);
        }

        if (dto.getCharacterName() != null) {

            contentPersonRole.setCharacterName(
                    normalizeCharacterName(
                            dto.getCharacterName()
                    )
            );
        }

        validateDuplicateForUpdate(
                contentPersonRole
        );

        if (dto.getOrderIndex() != null
                && !dto.getOrderIndex()
                        .equals(contentPersonRole.getOrderIndex())) {

            List<ContentPersonRole> contentPersonRoles =
                    repository
                            .findByContent_ContentIdOrderByOrderIndexAsc(
                                    contentId
                            );

            PositionUtils.move(
                    contentPersonRoles,
                    contentPersonRoleId,
                    dto.getOrderIndex(),
                    ContentPersonRole::getContentPersonRoleId,
                    ContentPersonRole::getOrderIndex,
                    ContentPersonRole::setOrderIndex
            );

            repository.saveAll(contentPersonRoles);

            repository.flush();
        }

        return repository.save(contentPersonRole);
    }

    public void delete(
        Integer contentId,
        Long contentPersonRoleId
    ){
        ContentPersonRole contentPersonRole = findById(
                contentId,
                contentPersonRoleId
        );

        List<ContentPersonRole> contentPersonRoles =
                repository
                        .findByContent_ContentIdOrderByOrderIndexAsc(
                                contentId
                        );

        PositionUtils.closePosition(
                contentPersonRoles,
                contentPersonRole.getOrderIndex(),
                ContentPersonRole::getOrderIndex,
                ContentPersonRole::setOrderIndex
        );

        repository.saveAll(contentPersonRoles);

        repository.delete(contentPersonRole);
    }

    private ContentPersonRole findById(Integer contentId, Long contentPersonRoleId){

        return repository
                .findByContentPersonRoleIdAndContent_ContentId(
                        contentPersonRoleId,
                        contentId
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Crédito no encontrado: "
                                        + contentPersonRoleId
                        )
                );
    }

    private Content findContentById(Integer contentId){
        return contentRepository
                .findById(contentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Contenido no encontrado: "
                                        + contentId
                        )
                );
    }

    private Person findPersonById(Integer personId){

        return personRepository
                .findById(personId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Persona no encontrada: "
                                        + personId
                        )
                );
    }

    private CinematicRole findCinematicRoleById(Integer cinematicRoleId){

        return cinematicRoleRepository
                .findById(cinematicRoleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Rol cinematográfico no encontrado: "
                                        + cinematicRoleId
                        )
                );
    }

    private void validateDuplicate(
        Integer contentId,
        Integer personId,
        Integer cinematicRoleId,
        String characterName
    ){
        boolean exists =
                repository.findByContent_ContentIdAndPerson_PersonId(
                    contentId, personId
                )
                .stream()
                .anyMatch(existing -> {

                    Integer existingRoleId =
                            existing.getCinematicRole()
                                    .getCinematicRoleId();

                    if(!existingRoleId.equals(cinematicRoleId)){
                        return false;
                    }

                    String existingCharacter = existing.getCharacterName();

                    if(characterName == null){
                        return existingCharacter == null;
                    }

                    return existingCharacter != null
                                    && characterName.equalsIgnoreCase(
                                            existingCharacter
                                    );

                });

        if (exists) {
            throw new DuplicateResourceException(
                    "El crédito ya existe para esta persona, "
                            + "rol y personaje"
            );
        }
    }

    private void validateDuplicateForUpdate(ContentPersonRole contentPersonRole){

        Integer conentId = contentPersonRole.getContent().getContentId();
        Integer personId = contentPersonRole.getPerson().getPersonId();
        Integer cinematicRoleId = contentPersonRole.getCinematicRole().getCinematicRoleId();
        String characterName = contentPersonRole.getCharacterName();

        boolean exists = repository
                .findByContent_ContentIdAndPerson_PersonId(
                    conentId, personId
                )
                .stream()
                .filter(existing -> 
                        !existing
                                .getContentPersonRoleId()
                                .equals(
                                    contentPersonRole
                                        .getContentPersonRoleId()
                                )
                )
                .anyMatch(existing -> {
                    
                    Integer existingRoleId =
                            existing.getCinematicRole()
                                    .getCinematicRoleId();

                    if(!existingRoleId.equals(cinematicRoleId)){
                        return false;
                    }

                    String existingCharacter = existing.getCharacterName();

                    if(characterName == null){
                        return existingCharacter == null;
                    }

                    return existingCharacter != null
                                    && characterName.equalsIgnoreCase(
                                            existingCharacter
                                    );
                });

        if(exists){
            throw new DuplicateResourceException(
                    "El crédito ya existe para esta persona, "
                            + "rol y personaje"
            );
        }
    }

    private String normalizeCharacterName(String characterName){
        
        if(characterName == null){
            return null;
        }

        String normalized = characterName.trim();

        return normalized.isBlank()
                ? null
                : normalized;
    }
}
