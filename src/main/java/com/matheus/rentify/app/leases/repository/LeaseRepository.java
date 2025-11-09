package com.matheus.rentify.app.leases.repository;

import com.matheus.rentify.app.leases.model.Lease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaseRepository extends JpaRepository<Lease, Long> {
    boolean existsByPropertyId(Long id);
}
