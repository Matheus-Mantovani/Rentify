package com.matheus.rentify.app.history.repository;

import com.matheus.rentify.app.history.model.PropertyFinancialsHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyFinancialsHistoryRepository extends JpaRepository<PropertyFinancialsHistory, Long> {
    List<PropertyFinancialsHistory> findByPropertyIdOrderByRecordDateDesc(Long propertyId);
}
