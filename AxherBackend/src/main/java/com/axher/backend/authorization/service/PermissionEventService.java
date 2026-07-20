package com.axher.backend.authorization.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class PermissionEventService {
    private final SimpMessagingTemplate messagingTemplate;

    public PermissionEventService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // userId = usuario afectado
    public void sendPermissionUpdate(Integer userId) {
        messagingTemplate.convertAndSend("/topic/permissions/" + userId, "updated");
    }
}
