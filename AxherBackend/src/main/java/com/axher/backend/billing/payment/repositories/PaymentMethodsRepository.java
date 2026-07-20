package com.axher.backend.billing.payment.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.payment.entities.PaymentMethods;

public interface PaymentMethodsRepository extends JpaRepository<PaymentMethods, Integer> {

}
