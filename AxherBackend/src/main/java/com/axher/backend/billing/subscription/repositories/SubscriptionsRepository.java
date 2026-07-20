package com.axher.backend.billing.subscription.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.subscription.entities.Subscriptions;

public interface SubscriptionsRepository extends JpaRepository<Subscriptions, Integer> {

}