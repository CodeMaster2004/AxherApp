package com.axher.backend.billing.payment.entities;

import java.time.LocalDateTime;

import com.axher.backend.users.entities.Users;

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
@Table(name = "payment_methods")
public class PaymentMethods {

     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentMethodId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users userId;

    @Column(nullable = false, length = 50)
    private String paymentType;

    @Column(length = 500)
    private String paymentDetails;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime registeredAt;

}

