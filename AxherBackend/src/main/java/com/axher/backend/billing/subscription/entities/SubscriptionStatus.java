package com.axher.backend.billing.subscription.entities;

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
@Table(name = "subscription_status")
public class SubscriptionStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer subscriptionStatusId;

    @Column(nullable = false, unique = true, length = 30)
    private String code;

    //@Column(nullable = false, unique = true, length = 50)
    //private String name;

    //@Column(length = 200)
    //private String description;

    @OneToMany(
        mappedBy = "subscriptionStatus",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private Set<SubscriptionStatusTranslation> translations =
            new HashSet<>();
}
