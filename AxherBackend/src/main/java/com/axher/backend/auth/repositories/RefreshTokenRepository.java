package com.axher.backend.auth.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.auth.entities.RefreshToken;
import com.axher.backend.users.entities.Users;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUserAndFamilyIdAndRevokedFalse(Users user, String familyId);
    List<RefreshToken> findByUserOrderByCreatedAtDesc(Users user);
    
}
