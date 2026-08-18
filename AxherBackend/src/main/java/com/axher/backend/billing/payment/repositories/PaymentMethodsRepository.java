package com.axher.backend.billing.payment.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.payment.entities.PaymentMethods;
import com.axher.backend.users.entities.Users;

public interface PaymentMethodsRepository extends JpaRepository<PaymentMethods, Integer> {

    List<PaymentMethods> findByUserAndActiveTrue(Users user);

    List<PaymentMethods> findByUserOrderByIsDefaultDescCreatedAtDesc(
            Users user
    );

    boolean existsByUserAndProviderAndProviderPaymentMethodId(
            Users user,
            String provider,
            String providerPaymentMethodId
    );
}
