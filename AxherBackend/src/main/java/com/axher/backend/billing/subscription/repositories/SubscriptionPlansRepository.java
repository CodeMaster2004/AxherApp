package com.axher.backend.billing.subscription.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.subscription.entities.SubscriptionPlans;

public interface SubscriptionPlansRepository extends JpaRepository<SubscriptionPlans, Integer> {

}
