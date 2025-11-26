package com.matheus.rentify.app.reports.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

/**
 * Data Transfer Object for the main dashboard summary widgets.
 * Aggregates high-level metrics about properties and monthly revenue.
 */
public record DashboardSummaryResponseDTO(

        @Schema(description = "Total number of properties registered in the system.", example = "50")
        Long totalProperties,

        @Schema(description = "Number of properties currently available for rent.", example = "5")
        Long availableProperties,

        @Schema(description = "Number of properties currently rented.", example = "42")
        Long rentedProperties,

        @Schema(description = "Current occupancy rate (percentage).", example = "84.0")
        Double occupancyRate,

        @Schema(description = "Number of properties currently under maintenance.", example = "3")
        Long maintenanceProperties,

        @Schema(description = "Total revenue received in the current month.", example = "45200.00")
        BigDecimal currentMonthRevenue,

        @Schema(description = "Total outstanding costs for maintenance jobs in the current month.", example = "1200.50")
        BigDecimal outstandingMaintenanceCosts
) {
}