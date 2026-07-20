package com.axher.backend.billing.payment.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.payment.entities.MoviePayments;

public interface MoviePaymentsRepository extends JpaRepository<MoviePayments, Integer> {

}
