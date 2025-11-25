package com.matheus.rentify.app.history.repository;

import com.matheus.rentify.app.history.model.PropertyValueHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyValueHistoryRepository extends JpaRepository<PropertyValueHistory, Long> {
    List<PropertyValueHistory> findByPropertyIdOrderByRecordDateDesc(Long propertyId);
}
