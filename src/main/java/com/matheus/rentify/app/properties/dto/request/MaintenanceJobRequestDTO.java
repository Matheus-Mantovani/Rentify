package com.matheus.rentify.app.properties.dto.request;

import com.matheus.rentify.app.properties.model.MaintenanceStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for creating or updating a maintenance job.
 */
public record MaintenanceJobRequestDTO(

        @Schema(description = "ID of the property where the job was performed.", example = "15", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Property ID cannot be null.")
        Long propertyId,

        @Schema(description = "Detailed description of the service to be performed.", example = "Repair leaking kitchen faucet", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Service description cannot be blank.")
        @Size(max = 255, message = "Service description cannot exceed 255 characters.")
        String serviceDescription,

        @Schema(description = "Date when the maintenance was requested.", example = "2025-10-08")
        LocalDate requestDate,

        @Schema(description = "Date when the maintenance was completed.", example = "2025-10-10")
        LocalDate completionDate,

        @Schema(description = "Total cost of the service. Cannot be negative.", example = "150.00")
        @PositiveOrZero(message = "Total cost must be a positive value or zero.")
        BigDecimal totalCost,

        @Schema(description = "Name of the company or professional who performed the service.", example = "John's Plumbing & Co.")
        @Size(max = 100, message = "Service provider name cannot exceed 100 characters.")
        String serviceProvider,

        @Schema(description = "Current status of the maintenance job.", example = "PENDING", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Status cannot be null.")
        MaintenanceStatusEnum status
) {
}