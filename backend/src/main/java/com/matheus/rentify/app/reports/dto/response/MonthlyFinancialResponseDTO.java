package com.matheus.rentify.app.reports.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

/**
 * Data Transfer Object for monthly financial history reports.
 * Used to populate revenue vs. expenses charts.
 */
public record MonthlyFinancialResponseDTO(

        @Schema(description = "The month number (1-12).", example = "10")
        Integer month,

        @Schema(description = "The year of the record.", example = "2025")
        Integer year,

        @Schema(description = "Total revenue (payments received) in this month.", example = "15000.00")
        BigDecimal totalRevenue,

        @Schema(description = "Total expenses (completed maintenance jobs) in this month.", example = "2000.00")
        BigDecimal totalExpenses,

        @Schema(description = "Net income (Revenue - Expenses).", example = "13000.00")
        BigDecimal netIncome
) {
}