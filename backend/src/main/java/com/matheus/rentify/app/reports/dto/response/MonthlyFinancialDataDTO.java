package com.matheus.rentify.app.reports.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

/**
 * Data Transfer Object representing financial summary for a single month.
 * Used within the Annual Income Report.
 */
public record MonthlyFinancialDataDTO(

        @Schema(description = "The month number (1-12).", example = "1")
        int month,

        @Schema(description = "The localized name of the month.", example = "Janeiro")
        String monthName,

        @Schema(description = "Total income received in this month.", example = "15000.00")
        BigDecimal totalIncome
) {
}