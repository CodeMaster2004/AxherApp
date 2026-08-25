package com.axher.backend.billing.payment.entities;

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
@Table(name = "payment_status")
public class PaymentStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentStatusId;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    //@Column(nullable = false, unique = true, length = 50)
    //private String name;

    //@Column(length = 200)
    //private String description;

    @OneToMany(
        mappedBy = "paymentStatus",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private Set<PaymentStatusTranslation> translations = new HashSet<>();
}
