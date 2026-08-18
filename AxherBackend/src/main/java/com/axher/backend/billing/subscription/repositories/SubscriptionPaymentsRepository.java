package com.axher.backend.billing.subscription.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.payment.entities.PaymentStatus;
import com.axher.backend.billing.subscription.entities.SubscriptionPayments;
import com.axher.backend.billing.subscription.entities.Subscriptions;

public interface SubscriptionPaymentsRepository extends JpaRepository<SubscriptionPayments, Integer> {

    List<SubscriptionPayments> findBySubscription(Subscriptions subscription);

    Optional<SubscriptionPayments> findBySubscriptionAndPaymentStatus(
        Subscriptions subscription,
        PaymentStatus paymentStatus
    );

    boolean existsBySubscriptionAndPaymentStatus(
        Subscriptions subscription,
        PaymentStatus paymentStatus
    );

    List<SubscriptionPayments> findBySubscriptionOrderByPaymentDateDesc(
            Subscriptions subscription
    );

    Optional<SubscriptionPayments> findByProviderPaymentId(
            String providerPaymentId
    );

   
}
