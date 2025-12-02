package com.matheus.rentify.app.people.repository;

import com.matheus.rentify.app.people.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Long> {
    @Query(value = "SELECT * FROM tenants WHERE cpf = :cpf", nativeQuery = true)
    Optional<Tenant> findByCpfIncludingDeleted(@Param("cpf") String cpf);
}
