package com.axher.backend.billing.subscription.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "suscription_plans")
public class SubscriptionPlans {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer suscriptionPlanId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Integer durationDays;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime createdAt;
}

