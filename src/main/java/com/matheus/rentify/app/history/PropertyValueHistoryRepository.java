package com.matheus.rentify.app.history;

import com.matheus.rentify.app.history.model.PropertyValueHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyValueHistoryRepository extends JpaRepository<PropertyValueHistory, Long> {
}
