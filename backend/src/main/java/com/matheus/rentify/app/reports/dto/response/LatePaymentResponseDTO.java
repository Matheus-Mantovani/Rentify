package com.matheus.rentify.app.reports.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

/**
 * Data Transfer Object for reporting late payments (defaulters).
 * Identifies tenants who have not paid rent for a specific reference month.
 */
public record LatePaymentResponseDTO(

        @Schema(description = "Unique identifier of the lease.", example = "22")
        Long leaseId,

        @Schema(description = "Address of the property.", example = "Rua 9, Centro")
        String propertyAddress,

        @Schema(description = "Full name of the tenant who is late.", example = "Maria Oliveira")
        String tenantName,

        @Schema(description = "Day of the month the payment was expected.", example = "10")
        Integer paymentDueDay,

        @Schema(description = "The month (1-12) related to the missing payment.", example = "11")
        Integer referenceMonth,

        @Schema(description = "The base rent value that is overdue.", example = "2200.00")
        BigDecimal rentValue,

        @Schema(description = "Number of days the payment is overdue (calculated based on current date).", example = "16")
        Long daysLate
) {
}