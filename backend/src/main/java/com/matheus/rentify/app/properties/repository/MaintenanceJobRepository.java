package com.matheus.rentify.app.properties.repository;

import com.matheus.rentify.app.properties.model.MaintenanceJob;
import com.matheus.rentify.app.properties.model.MaintenanceStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MaintenanceJobRepository extends JpaRepository<MaintenanceJob, Long> {
    List<MaintenanceJob> findByPropertyIdOrderByRequestDateDesc(Long propertyId);

    @Query("SELECT SUM(m.totalCost) FROM MaintenanceJob m WHERE m.maintenanceStatus IN :statuses")
    BigDecimal sumOutstandingCosts(@Param("statuses") List<MaintenanceStatusEnum> statuses);

    @Query("SELECT YEAR(m.completionDate), MONTH(m.completionDate), SUM(m.totalCost) FROM MaintenanceJob m WHERE m.maintenanceStatus = 'COMPLETED' GROUP BY YEAR(m.completionDate), MONTH(m.completionDate)")
    List<Object[]> findMonthlyExpensesGrouped();
}
