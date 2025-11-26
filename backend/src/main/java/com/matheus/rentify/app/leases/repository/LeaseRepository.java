package com.matheus.rentify.app.leases.repository;

import com.matheus.rentify.app.leases.model.Lease;
import com.matheus.rentify.app.leases.model.LeaseStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaseRepository extends JpaRepository<Lease, Long> {
    boolean existsByPropertyId(Long id);
    boolean existsByTenantId(Long id);
    List<Lease> findByEndDateBetween(LocalDate startDate, LocalDate endDate);
    List<Lease> findAllByStatus(LeaseStatusEnum status);
    List<Lease> findByEndDateBetweenAndStatus(LocalDate start, LocalDate end, LeaseStatusEnum status);
}
