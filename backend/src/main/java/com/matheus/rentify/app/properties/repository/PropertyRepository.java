package com.matheus.rentify.app.properties.repository;

import com.matheus.rentify.app.properties.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    @Query("SELECT COUNT(p) FROM Property p")
    long countTotalProperties();

    @Query("SELECT COUNT(p) FROM Property p WHERE p.status = 'AVAILABLE'")
    long countAvailableProperties();

    @Query("SELECT COUNT(p) FROM Property p WHERE p.status = 'RENTED'")
    long countRentedProperties();

    @Query("SELECT COUNT(p) FROM Property p WHERE p.status = 'UNDER_MAINTENANCE'")
    long countMaintenanceProperties();
}
