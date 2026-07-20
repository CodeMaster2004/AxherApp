package com.axher.backend.users.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.users.entities.UserProfiles;
import com.axher.backend.users.entities.Users;

public interface UserProfilesRepository extends JpaRepository<UserProfiles, Integer> {
    Optional<UserProfiles> findByUsername(String username);

    Optional<UserProfiles> findByUser(Users user);
}
