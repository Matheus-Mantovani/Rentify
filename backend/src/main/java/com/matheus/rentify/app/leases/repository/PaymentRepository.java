package com.matheus.rentify.app.leases.repository;

import com.matheus.rentify.app.leases.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByLeaseIdOrderByPaymentDateDesc(Long id);
    List<Payment> findTop5ByOrderByPaymentDateDesc();
    List<Payment> findByLeaseTenantIdOrderByPaymentDateDesc(Long tenantId);

    @Query("SELECT SUM(p.amountPaid) FROM Payment p WHERE p.referenceMonth = :month AND p.referenceYear = :year")
    BigDecimal sumRevenueByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT p.referenceYear, p.referenceMonth, SUM(p.amountPaid) FROM Payment p GROUP BY p.referenceYear, p.referenceMonth")
    List<Object[]> findMonthlyRevenueGrouped();

    @Query("SELECT p.lease.id FROM Payment p WHERE p.referenceMonth = :month AND p.referenceYear = :year")
    List<Long> findLeaseIdsWithPaymentInMonth(@Param("month") int month, @Param("year") int year);
}
