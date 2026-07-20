package com.axher.backend.auth.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.axher.backend.auth.entities.LoginHistory;
import com.axher.backend.auth.repositories.LoginHistoryRepository;
import com.axher.backend.users.entities.Users;
import com.axher.backend.users.repositories.UsersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LoginHistoryService {

    private final LoginHistoryRepository repository;
    private final UsersRepository  usersRepository;

    public void recordAttempt(Integer userId, boolean success, String ip, String userAgent){
        Users user = usersRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " ));

        LoginHistory history = new LoginHistory();
        history.setUser(user);
        history.setLoginTime(LocalDateTime.now());
        history.setIpAddress(ip);
        history.setUserAgent(userAgent);
        history.setSuccess(success);

        repository.save(history);
    }
    
}
