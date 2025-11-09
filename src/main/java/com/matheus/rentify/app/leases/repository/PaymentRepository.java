package com.matheus.rentify.app.leases.repository;

import com.matheus.rentify.app.leases.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
