package com.axher.backend.billing.subscription.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "subscription_plans")
public class SubscriptionPlans {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer subscriptionPlanId;

    //@Column(nullable = false, unique = true)
    //private String name;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    //@Column(length = 500)
    //private String description;

    @Column(nullable = false)
    private Integer durationDays;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(
        mappedBy = "subscriptionPlan",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private Set<SubscriptionPlanTranslation> translations =
            new HashSet<>();
}

