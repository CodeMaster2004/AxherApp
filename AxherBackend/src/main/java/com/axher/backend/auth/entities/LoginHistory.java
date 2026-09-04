package com.axher.backend.auth.entities;

import java.time.Instant;
import java.time.LocalDateTime;

import com.axher.backend.users.entities.Users;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "login_history")
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer loginHistoryId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    private Instant loginTime;

    private String ipAddress;

    private String userAgent;

    private Boolean success;
    
}
