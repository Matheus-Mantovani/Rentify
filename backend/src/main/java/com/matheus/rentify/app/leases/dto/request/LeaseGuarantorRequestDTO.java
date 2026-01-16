package com.matheus.rentify.app.leases.dto.request;

import com.matheus.rentify.app.leases.model.GuaranteeTypeEnum;
import com.matheus.rentify.app.leases.model.LeaseGuarantorStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for creating or updating the link between a lease and a guarantor.
 */
public record LeaseGuarantorRequestDTO(

        @Schema(description = "ID of the lease contract to link.", example = "15", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Lease ID cannot be null.")
        Long leaseId,

        @Schema(description = "ID of the guarantor to link.", example = "101", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Guarantor ID cannot be null.")
        Long guarantorId,

        @Schema(description = "The date the guarantor officially signed the contract. Cannot be in the future.", example = "2025-10-08")
        @PastOrPresent(message = "Signature date cannot be in the future.")
        LocalDate signatureDate,

        @Schema(description = "Lifecycle status of this guarantee.", example = "ACTIVE", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Status cannot be null.")
        LeaseGuarantorStatusEnum leaseGuarantorStatus,

        @Schema(description = "Monetary value, used for types like 'Security Deposit'.", example = "5000.00")
        @PositiveOrZero(message = "Guarantee value must be a positive value or zero.")
        BigDecimal guaranteeValue,

        @Schema(description = "Property registration number (matrícula), used for 'Guarantor with Property'.", example = "matrícula 98765")
        @Size(max = 50, message = "Property registration number cannot exceed 50 characters.")
        String guarantorPropertyRegistration,

        @Schema(description = "Any relevant observations about this specific guarantee.")
        String notes
) {
}