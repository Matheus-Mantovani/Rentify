package com.matheus.rentify.app.leases.repository;

import com.matheus.rentify.app.leases.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByLeaseIdOrderByPaymentDateDesc(Long id);
}
