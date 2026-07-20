package com.axher.backend.users.service;

import static com.axher.backend.infrastructure.specification.UsersSpecifications.emailLike;
import static com.axher.backend.infrastructure.specification.UsersSpecifications.isConfirmed;
import static com.axher.backend.infrastructure.specification.UsersSpecifications.usernameLike;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.axher.backend.users.DTOs.UsersListDto;
import com.axher.backend.users.entities.Users;
import com.axher.backend.users.repositories.UserRoleAssignmentsRepository;
import com.axher.backend.users.repositories.UsersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsersService {

    private final UsersRepository usersRepository;
    private final UserRoleAssignmentsRepository userRoleAssignmentsRepository;

    /** LISTADO DE USUARIOS PARA ADMIN **/
    public Page<UsersListDto> listUsers(String search, int page, int size) {
        Specification<Users> spec = Specification.where(isConfirmed());

        if (search != null && !search.isBlank()) {
            spec = spec.and(
                Specification.where(emailLike(search))
                            .or(usernameLike(search))
            );
        }

        Pageable pageable = PageRequest.of(page, size);

        return usersRepository.findAll(spec, pageable)
            .map(user -> {
                UsersListDto dto = new UsersListDto();
                dto.userId = user.getUserId();
                dto.email = user.getEmail();
                dto.username = user.getProfile() != null ? user.getProfile().getUsername() : null;
                dto.isConfirmed = user.getIsConfirmed();
                dto.createdAt = user.getCreatedAt();
                dto.lastLogin = user.getLastLogin();
                dto.roles = userRoleAssignmentsRepository.findRoleNamesByUserId(user.getUserId());
                return dto;
            });
    }
}

