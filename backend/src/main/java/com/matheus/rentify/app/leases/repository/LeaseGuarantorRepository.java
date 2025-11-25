package com.matheus.rentify.app.leases.repository;

import com.matheus.rentify.app.leases.model.LeaseGuarantor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaseGuarantorRepository extends JpaRepository<LeaseGuarantor, Long> {
    List<LeaseGuarantor> findByLeaseId(Long id);
    boolean existsByGuarantorId(Long id);
    boolean existsByLeaseIdAndGuarantorId(Long leaseId, Long guarantorId);
}
