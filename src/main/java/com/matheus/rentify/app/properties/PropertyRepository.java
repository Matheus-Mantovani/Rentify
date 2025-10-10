package com.matheus.rentify.app.properties;

import com.matheus.rentify.app.properties.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> { }
