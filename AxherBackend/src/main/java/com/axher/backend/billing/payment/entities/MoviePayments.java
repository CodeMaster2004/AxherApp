package com.axher.backend.billing.payment.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.axher.backend.content.movies.entities.Movies;
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
@Table(name = "movie_payments")
public class MoviePayments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer moviePaymentId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users userId;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movies movieId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime paymentDate;

    @ManyToOne
    @JoinColumn(name = "payment_method_id")
    private PaymentMethods paymentMethodId;
    
    @ManyToOne
    @JoinColumn(name = "payment_status_id")
    private PaymentStatus paymentStatusId;
}

