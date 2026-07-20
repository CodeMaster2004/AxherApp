package com.axher.backend.users.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.axher.backend.users.entities.Users;

public interface UsersRepository extends JpaRepository <Users, Integer>, JpaSpecificationExecutor<Users>{

    boolean existsByEmail(String email);
    Optional<Users> findByEmail(String email);

    // Este es el que te falta:
    Optional<Users> findByProviderUserId(String providerUserId);
    // 🔹 Buscar usuario por username (a través de profile)

    Page<Users> findByIsConfirmedTrue(Pageable pageable);

    List<Users> findAllByIsConfirmedFalseAndOtpExpiresAtBefore(LocalDateTime dateTime);

}
