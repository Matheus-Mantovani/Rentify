package com.matheus.rentify.app.properties.repository;

import com.matheus.rentify.app.properties.model.MaintenanceJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceJobRepository extends JpaRepository<MaintenanceJob, Long> {
}
