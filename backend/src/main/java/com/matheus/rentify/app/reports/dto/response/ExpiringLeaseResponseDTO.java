package com.matheus.rentify.app.reports.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

/**
 * Data Transfer Object for listing leases that are about to expire.
 * Useful for proactive contract renewal alerts.
 */
public record ExpiringLeaseResponseDTO(

        @Schema(description = "Unique identifier of the lease.", example = "15")
        Long leaseId,

        @Schema(description = "Address of the property related to the lease.", example = "123 Main St, Apt 4B")
        String propertyAddress,

        @Schema(description = "Full name of the tenant.", example = "João da Silva")
        String tenantName,

        @Schema(description = "The date the lease agreement ends.", example = "01-12-2025")
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate endDate,

        @Schema(description = "Number of days remaining until the lease expires.", example = "5")
        Long daysRemaining
) {
}