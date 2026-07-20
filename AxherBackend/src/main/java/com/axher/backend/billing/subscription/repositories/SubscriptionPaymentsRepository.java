package com.axher.backend.billing.subscription.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.subscription.entities.SubscriptionPayments;

public interface SubscriptionPaymentsRepository extends JpaRepository<SubscriptionPayments, Integer> {

}
