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

import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanRequestDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanResponseDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPlans;
import com.axher.backend.billing.subscription.mapper.SubscriptionPlanMapper;
import com.axher.backend.billing.subscription.service.SubscriptionPlansService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/subscription-plans")
public class AdminSubscriptionPlansController {

    private final SubscriptionPlansService service;
    private final SubscriptionPlanMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "subscriptionPlanId",
        "name",
        "price",
        "durationDays",
        "createdAt"
    );

    @GetMapping
    public Page<SubscriptionPlanResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "subscriptionPlanId,desc") String sort,
        @RequestParam(required = false) String search
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "subscriptionPlanId");
        Page<SubscriptionPlans> subscriptionPlansPage = service.findAll(PageRequest.of(page, size, sortObj), search);
        return subscriptionPlansPage.map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlanResponseDto> findById(@PathVariable Integer id) {
        SubscriptionPlans plan = service.findById(id);
        return ResponseEntity.ok(mapper.toDto(plan));
    }

    @PostMapping
    public ResponseEntity<SubscriptionPlanResponseDto> create(
        @RequestBody SubscriptionPlanRequestDto dto
    ) {

        SubscriptionPlans createdPlan =service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(createdPlan));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SubscriptionPlanResponseDto> update(
        @PathVariable Integer id,
        @RequestBody SubscriptionPlanRequestDto dto
    ) {

        SubscriptionPlans updatedPlan = service.update(id, dto);

        return ResponseEntity.ok(mapper.toDto(updatedPlan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {

        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
