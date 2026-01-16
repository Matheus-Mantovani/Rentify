package com.matheus.rentify.app.reports.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.List;

/**
 * Data Transfer Object for the Annual Income Report.
 * Aggregates monthly income data for a specific landlord profile.
 */
public record AnnualIncomeReportResponseDTO(

        @Schema(description = "The year of the report.", example = "2025")
        int year,

        @Schema(description = "ID of the landlord profile.", example = "1")
        Long landlordProfileId,

        @Schema(description = "Name of the landlord (Individual or Company).", example = "Matheus Real Estate LLC")
        String landlordName,

        @Schema(description = "Total income accumulated in the year.", example = "180000.00")
        BigDecimal yearTotal,

        @Schema(description = "List of financial data broken down by month.")
        List<MonthlyFinancialDataDTO> monthlyData
) {
}