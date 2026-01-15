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
    List<Lease> findAllByStatus(LeaseStatusEnum status);
    List<Lease> findByLandlordProfileId(Long landlordProfileId);
    List<Lease> findByEndDateBetweenAndStatus(LocalDate start, LocalDate end, LeaseStatusEnum status);
    List<Lease> findByTenantId(Long tenantId);
    List<Lease> findByTenantIdAndStatus(Long tenantId, LeaseStatusEnum status);

    @Query("SELECT l FROM Lease l WHERE l.endDate BETWEEN :startDate AND :endDate AND l.status = :status")
    List<Lease> findExpiringLeases(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") LeaseStatusEnum status
    );

    @Query("SELECT COUNT(l) FROM Lease l WHERE l.startDate <= :date AND (l.moveOutDate IS NULL OR l.moveOutDate > :date)")
    long countActiveLeasesOnDate(@Param("date") LocalDate date);
}
