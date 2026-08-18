package com.axher.backend.billing.subscription.controller;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusRequestDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusResponseDto;
import com.axher.backend.billing.subscription.entities.SubscriptionStatus;
import com.axher.backend.billing.subscription.mapper.SubscriptionStatusMapper;
import com.axher.backend.billing.subscription.service.SubscriptionStatusService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/subscription-status")
public class AdminSubscriptionStatusController {

    private final SubscriptionStatusService service;
    private final SubscriptionStatusMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "subscriptionStatusId", "code", "name", "description"
    );

    @GetMapping
    public Page<SubscriptionStatusResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "subscriptionStatusId,desc") String sort,
        @RequestParam(required = false) String search
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "subscriptionStatusId");
        Page<SubscriptionStatus> subscriptionStatus = service.findAll(PageRequest.of(page, size, sortObj), search);
        return subscriptionStatus.map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionStatusResponseDto> findById(@PathVariable Integer id){
        SubscriptionStatus subscriptionStatus = service.findById(id);
        return ResponseEntity.ok(mapper.toDto(subscriptionStatus));    
    }

    @PostMapping
    public ResponseEntity<SubscriptionStatusResponseDto> create(
        @RequestBody SubscriptionStatusRequestDto dto
    ){
        SubscriptionStatus createdSubscriptionStatus = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(createdSubscriptionStatus));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SubscriptionStatusResponseDto> update(
        @PathVariable Integer id,
        @RequestBody SubscriptionStatusRequestDto dto
    ){
        SubscriptionStatus updatedSubscriptionStatus = service.update(id, dto);
        return ResponseEntity.ok(mapper.toDto(updatedSubscriptionStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
