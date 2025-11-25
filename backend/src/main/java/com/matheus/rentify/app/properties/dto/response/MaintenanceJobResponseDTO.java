package com.matheus.rentify.app.properties.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.matheus.rentify.app.properties.model.MaintenanceStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for responding with maintenance job details.
 * This record provides a safe and flattened view of the MaintenanceJob entity.
 */
public record MaintenanceJobResponseDTO(

        @Schema(description = "Unique identifier of the maintenance job.", example = "101")
        Long id,

        @Schema(description = "ID of the property where the job was performed.", example = "15")
        Long propertyId,

        @Schema(description = "Address of the property where the job was performed.", example = "123 Main St, Apt 4B")
        String propertyAddress,

        @Schema(description = "Detailed description of the service performed.", example = "Repair leaking kitchen faucet")
        String serviceDescription,

        @Schema(description = "Date when the maintenance was requested.", example = "08-10-2025")
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate requestDate,

        @Schema(description = "Date when the maintenance was completed.", example = "10-10-2025")
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate completionDate,

        @Schema(description = "Total cost of the service.", example = "150.00")
        BigDecimal totalCost,

        @Schema(description = "Name of the company or professional who performed the service.", example = "John's Plumbing & Co.")
        String serviceProvider,

        @Schema(description = "Current status of the maintenance job.", example = "Completed")
        MaintenanceStatusEnum maintenanceStatus
) {
}