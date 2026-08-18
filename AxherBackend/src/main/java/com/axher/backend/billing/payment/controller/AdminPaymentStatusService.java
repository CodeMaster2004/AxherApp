package com.axher.backend.billing.payment.controller;

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

import com.axher.backend.billing.payment.DTOs.PaymentStatusRequestDto;
import com.axher.backend.billing.payment.DTOs.PaymentStatusResponseDto;
import com.axher.backend.billing.payment.entities.PaymentStatus;
import com.axher.backend.billing.payment.mapper.PaymentStatusMapper;
import com.axher.backend.billing.payment.services.PaymentStatusService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/payment-status")
public class AdminPaymentStatusService {

    private final PaymentStatusService service;
    private final PaymentStatusMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "paymentStatusId", "code", "name", "description"
    );

    @GetMapping
    public Page<PaymentStatusResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "paymentStatusId,desc") String sort,
        @RequestParam(required = false) String search
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "paymentStatusId");
        Page<PaymentStatus> paymentStatus = service.findAll(PageRequest.of(page, size, sortObj), search);
        return paymentStatus.map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentStatusResponseDto> findById(@PathVariable Integer id){
        PaymentStatus paymentStatus = service.findById(id);
        return ResponseEntity.ok(mapper.toDto(paymentStatus));    
    }

    @PostMapping
    public ResponseEntity<PaymentStatusResponseDto> create(
        @RequestBody PaymentStatusRequestDto dto
    ){
        PaymentStatus createdPaymentStatus = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(createdPaymentStatus));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PaymentStatusResponseDto> update(
        @PathVariable Integer id,
        @RequestBody PaymentStatusRequestDto dto
    ){
        PaymentStatus updatedPaymentStatus = service.update(id, dto);
        return ResponseEntity.ok(mapper.toDto(updatedPaymentStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
