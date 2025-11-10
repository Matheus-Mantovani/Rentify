package com.matheus.rentify.app.leases.repository;

import com.matheus.rentify.app.leases.model.LeaseGuarantor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaseGuarantorRepository extends JpaRepository<LeaseGuarantor, Long> {
    boolean existsByGuarantorId(Long id);
}
