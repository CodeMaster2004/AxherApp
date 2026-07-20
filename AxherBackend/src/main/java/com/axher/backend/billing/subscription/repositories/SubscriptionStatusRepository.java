package com.axher.backend.billing.subscription.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.subscription.entities.SubscriptionStatus;

public interface SubscriptionStatusRepository extends JpaRepository<SubscriptionStatus, Integer> {

}
