package com.axher.backend.billing.subscription.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.subscription.entities.SubscriptionPlans;
import com.axher.backend.billing.subscription.entities.SubscriptionStatus;
import com.axher.backend.billing.subscription.entities.Subscriptions;
import com.axher.backend.users.entities.Users;

public interface SubscriptionsRepository extends JpaRepository<Subscriptions, Integer> {

    Optional<Subscriptions> findByUserAndSubscriptionStatus(
        Users user,
        SubscriptionStatus subscriptionStatus
    );

    boolean existsByUserAndSubscriptionStatus(
        Users user,
        SubscriptionStatus subscriptionStatus
    );

    boolean existsByUserAndSubscriptionPlan(
        Users user,
        SubscriptionPlans subscriptionPlan
    );

    
}