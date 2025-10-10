package com.matheus.rentify.app.history;

import com.matheus.rentify.app.history.model.LeaseHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaseHistoryRepository extends JpaRepository<LeaseHistory, Long> {
}
