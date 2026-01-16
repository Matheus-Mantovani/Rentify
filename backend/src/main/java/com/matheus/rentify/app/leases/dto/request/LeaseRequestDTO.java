package com.matheus.rentify.app.leases.dto.request;

import com.matheus.rentify.app.leases.model.GuaranteeTypeEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for creating a new lease.
 */
public record LeaseRequestDTO(

        @Schema(description = "ID of the property to be leased.", example = "42", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Property ID cannot be null.")
        Long propertyId,

        @Schema(description = "ID of the tenant who will be on the lease.", example = "77", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Tenant ID cannot be null.")
        Long tenantId,

        @Schema(description = "ID of the landlord profile signing the lease.", example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Landlord Profile ID cannot be null.")
        Long landlordProfileId,

        @Schema(description = "ID of the guarantor (optional, used only if guaranteeType is GUARANTOR).", example = "101")
        Long guarantorId,

        @Schema(description = "Type of guarantee provided for this contract.", example = "GUARANTOR")
        @NotNull(message = "Guarantee Type cannot be null.")
        GuaranteeTypeEnum guaranteeType,

        @Schema(description = "Day of the month the payment is due (1-31).", example = "10", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Payment due day cannot be null.")
        @Min(value = 1, message = "Day must be at least 1.")
        @Max(value = 31, message = "Day must be at most 31.")
        Integer paymentDueDay,

        @Schema(description = "The date the lease agreement begins. Cannot be in the past.", example = "2025-11-01", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Start date cannot be null.")
        @FutureOrPresent(message = "Start date cannot be in the past.")
        LocalDate startDate,

        @Schema(description = "The date the lease agreement ends.", example = "2026-10-31", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "End date cannot be null.")
        LocalDate endDate,

        @Schema(description = "Base monthly rent value. Must be a positive value.", example = "2200.50", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Base rent value cannot be null.")
        @Positive(message = "Base rent value must be positive.")
        BigDecimal baseRentValue,

        @Schema(description = "Value of the security deposit, if any. Cannot be negative.", example = "4401.00")
        @PositiveOrZero(message = "Security deposit must be a positive value or zero.")
        BigDecimal securityDepositValue,

        @Schema(description = "Value of the painting fee, if any. Cannot be negative.", example = "1000.00")
        @PositiveOrZero(message = "Painting fee must be a positive value or zero.")
        BigDecimal paintingFeeValue

) {
}