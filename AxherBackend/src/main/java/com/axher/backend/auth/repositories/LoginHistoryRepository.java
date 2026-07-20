package com.axher.backend.auth.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.auth.entities.LoginHistory;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Integer>{
    List<LoginHistory> findByUser_UserId(Integer userId);    
}
