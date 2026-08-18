package com.axher.backend.support.tickets.DTOs;

import java.time.LocalDateTime;

import com.axher.backend.support.tickets.entities.SenderType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupportMessageResponseDto {

    private Long messageId;
    private String message;
    private SenderType senderType;
    private Integer senderUserId;
    private LocalDateTime sentAt;
    
}
