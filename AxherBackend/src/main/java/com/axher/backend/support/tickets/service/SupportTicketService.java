package com.axher.backend.support.tickets.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.billing.subscription.entities.SubscriptionPayments;
import com.axher.backend.billing.subscription.entities.Subscriptions;
import com.axher.backend.billing.subscription.repositories.SubscriptionPaymentsRepository;
import com.axher.backend.billing.subscription.repositories.SubscriptionsRepository;
import com.axher.backend.infrastructure.specification.SupportTicketSpecification;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.support.tickets.DTOs.SupportTicketRequestDto;
import com.axher.backend.support.tickets.DTOs.TicketStatusRequestDto;
import com.axher.backend.support.tickets.entities.SenderType;
import com.axher.backend.support.tickets.entities.SupportCategory;
import com.axher.backend.support.tickets.entities.SupportMessage;
import com.axher.backend.support.tickets.entities.SupportTicket;
import com.axher.backend.support.tickets.entities.SupportTicketStatus;
import com.axher.backend.support.tickets.repositories.SupportCategoryRepository;
import com.axher.backend.support.tickets.repositories.SupportMessageRepository;
import com.axher.backend.support.tickets.repositories.SupportTicketRepository;
import com.axher.backend.support.tickets.repositories.SupportTicketStatusRepository;
import com.axher.backend.users.entities.Users;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SupportTicketService {

    private final SupportTicketRepository repository;

    private final SupportCategoryRepository supportCategoryRepository;
    private final SupportTicketStatusRepository supportTicketStatusRepository;

    private final SubscriptionsRepository subscriptionsRepository;
    private final SubscriptionPaymentsRepository subscriptionPaymentsRepository;
    private final SupportMessageRepository supportMessageRepository;


    // ==============================
    // LISTAR TICKETS DEL USUARIO
    // ==============================
    public Page<SupportTicket> findAll(Pageable pageable) {

        Users user = getCurrentUser();

        return repository.findByUserOrderByCreatedAtDesc(
            user,
            pageable
        );
    }


    // ==============================
    // OBTENER TICKET DEL USUARIO
    // ==============================
    public SupportTicket findById(Integer id) {

        Users user = getCurrentUser();

        SupportTicket ticket =
            repository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Ticket de soporte no encontrado: " + id
                    )
                );

        if (
            ticket.getUser() == null
            || !ticket.getUser()
                .getUserId()
                .equals(user.getUserId())
        ) {
            throw new ResourceNotFoundException(
                "Ticket de soporte no encontrado: " + id
            );
        }

        return ticket;
    }


    // ==============================
    // CREAR TICKET
    // ==============================
    public SupportTicket create(
        SupportTicketRequestDto dto
    ) {

        Users user = getCurrentUser();

        // 1. Validar asunto
        if (
            dto.getSubject() == null
            || dto.getSubject().isBlank()
        ) {
            throw new IllegalArgumentException(
                "El asunto del ticket no puede estar vacío"
            );
        }

        // 2. Obtener categoría
        SupportCategory category =
            supportCategoryRepository
                .findById(dto.getSupportCategoryId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Categoría de soporte no encontrada: "
                        + dto.getSupportCategoryId()
                    )
                );

        // 3. Obtener estado OPEN
        SupportTicketStatus openStatus =
            supportTicketStatusRepository
                .findByCode("OPEN")
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Estado de ticket OPEN no encontrado"
                    )
                );

        // 4. Crear ticket
        SupportTicket ticket = new SupportTicket();

        ticket.setUser(user);
        ticket.setSupportCategory(category);
        ticket.setSupportTicketStatus(openStatus);
        ticket.setSubject(dto.getSubject().trim());

        if(dto.getDescription() == null || dto.getDescription().isBlank()){

            throw new IllegalArgumentException(
                "La descripción del ticket no puede estar vacía"
            );
        }

        // 5. Asociar suscripción
        if (dto.getSubscriptionId() != null) {

            Subscriptions subscription =
                subscriptionsRepository
                    .findById(dto.getSubscriptionId())
                    .orElseThrow(() ->
                        new ResourceNotFoundException(
                            "Suscripción no encontrada: "
                            + dto.getSubscriptionId()
                        )
                    );

            // La suscripción debe pertenecer al usuario
            if (
                subscription.getUser() == null
                || !subscription.getUser()
                    .getUserId()
                    .equals(user.getUserId())
            ) {
                throw new ResourceNotFoundException(
                    "Suscripción no encontrada: "
                    + dto.getSubscriptionId()
                );
            }

            ticket.setSubscription(subscription);

            // 6. Asociar pago
            if (dto.getSubscriptionPaymentId() != null) {

                SubscriptionPayments payment =
                    subscriptionPaymentsRepository
                        .findById(dto.getSubscriptionPaymentId())
                        .orElseThrow(() ->
                            new ResourceNotFoundException(
                                "Pago de suscripción no encontrado: "
                                + dto.getSubscriptionPaymentId()
                            )
                        );

                Subscriptions paymentSubscription =
                    payment.getSubscription();

                // El pago debe pertenecer al usuario
                if (
                    paymentSubscription == null
                    || paymentSubscription.getUser() == null
                    || !paymentSubscription.getUser()
                        .getUserId()
                        .equals(user.getUserId())
                ) {
                    throw new ResourceNotFoundException(
                        "Pago de suscripción no encontrado: "
                        + dto.getSubscriptionPaymentId()
                    );
                }

                // El pago debe pertenecer a la suscripción indicada
                if (
                    !paymentSubscription
                        .getSubscriptionId()
                        .equals(subscription.getSubscriptionId())
                ) {
                    throw new IllegalArgumentException(
                        "El pago de suscripción no pertenece "
                        + "a la suscripción indicada"
                    );
                }

                ticket.setSubscriptionPayment(payment);
            }
        }

        SupportTicket savedTicket = repository.save(ticket);

        SupportMessage initialMessage = new SupportMessage();

        initialMessage.setTicket(savedTicket);
        initialMessage.setSenderUser(user);
        initialMessage.setSenderType(SenderType.USER);
        initialMessage.setMessage(dto.getDescription().trim());

        supportMessageRepository.save(initialMessage);

        return savedTicket;
    }

    // ==========================================
    // LISTAR TICKETS (ADMIN)
    // ==========================================
    public Page<SupportTicket> findAllForAdmin(
        Pageable pageable,
        String search,
        String statusCode,
        Integer supportCategoryId,
        Integer userId,
        LocalDateTime createdAtFrom,
        LocalDateTime createdAtTo
    ) {

        Specification<SupportTicket> specification =
            SupportTicketSpecification.filter(
                search,
                statusCode,
                supportCategoryId,
                userId,
                createdAtFrom,
                createdAtTo
            );

        return repository.findAll(
            specification,
            pageable
        );
    }

    // ==========================================
    // OBTENER TICKET (ADMIN)
    // ==========================================
    public SupportTicket findByIdForAdmin(Integer id) {

        return repository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Ticket de soporte no encontrado: " + id
                )
            );
    }

    // ==========================================
    // ACTUALIZAR ESTADO DEL TICKET (ADMIN)
    // ==========================================
    public SupportTicket updateStatus(Integer id, TicketStatusRequestDto dto){

        SupportTicket ticket = findByIdForAdmin(id);

        SupportTicketStatus status =
            supportTicketStatusRepository
                .findById(dto.getSupportTicketStatusId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Estado de ticket de soporte no encontrado: " + dto.getSupportTicketStatusId()
                    )
                );
        ticket.setSupportTicketStatus(status);
        String code = status.getCode();

        if("RESOLVED". equals(code)){
            if(ticket.getResolvedAt() == null){
                ticket.setResolvedAt(LocalDateTime.now());
            }
        } else {
            ticket.setResolvedAt(null);
        }

        if ("CLOSED".equals(code)) {
            if(ticket.getClosedAt() == null){
                ticket.setClosedAt(LocalDateTime.now());
            }
        } else {
            ticket.setClosedAt(null);
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        return repository.save(ticket);
    }



    // ==============================
    // USUARIO AUTENTICADO
    // ==============================
    private Users getCurrentUser() {

        return (Users) SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getPrincipal();
    }
}