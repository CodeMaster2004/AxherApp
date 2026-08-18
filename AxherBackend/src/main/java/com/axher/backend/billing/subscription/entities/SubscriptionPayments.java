package com.axher.backend.billing.subscription.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.axher.backend.billing.payment.entities.PaymentMethods;
import com.axher.backend.billing.payment.entities.PaymentStatus;

import jakarta.persistence.Column;
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
@Table(name = "subscription_payments")
public class SubscriptionPayments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer subscriptionPaymentId;

    @ManyToOne
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscriptions subscription;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    private LocalDateTime paymentDate;

    @ManyToOne
    @JoinColumn(name = "payment_method_id")
    private PaymentMethods paymentMethod;

    @ManyToOne
    @JoinColumn(name = "payment_status_id")
    private PaymentStatus paymentStatus;

    @Column(nullable = false, unique = true, length = 150)
    private String providerPaymentId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
}
