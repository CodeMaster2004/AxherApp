package com.axher.backend.infrastructure.scheduler;


import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.axher.backend.users.entities.Users;
import com.axher.backend.users.repositories.UsersRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CleanupService {

    private final UsersRepository usersRepository;

    @Scheduled(fixedRate = 60 * 60 * 1000) // cada hora
    public void removeExpiredUnconfirmedUsers() {
        List<Users> expiredUsers = usersRepository
            .findAllByIsConfirmedFalseAndOtpExpiresAtBefore(LocalDateTime.now());

        if(!expiredUsers.isEmpty()) {
            usersRepository.deleteAll(expiredUsers);
            System.out.println("Eliminados " + expiredUsers.size() + " usuarios no confirmados");
        }
    }
}
