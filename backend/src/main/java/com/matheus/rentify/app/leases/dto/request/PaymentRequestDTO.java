package com.matheus.rentify.app.leases.dto.request;

import com.matheus.rentify.app.leases.model.PaymentMethodEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for registering a new payment against a lease.
 */
public record PaymentRequestDTO(

        @Schema(description = "ID of the lease this payment is for.", example = "15", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Lease ID cannot be null.")
        Long leaseId,

        @Schema(description = "The actual amount paid. Must be a positive value.", example = "1500.00", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Amount paid cannot be null.")
        @Positive(message = "Amount paid must be positive.")
        BigDecimal amountPaid,

        @Schema(description = "The date the payment was received. Cannot be in the future.", example = "09-10-2025", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Payment date cannot be null.")
        @PastOrPresent(message = "Payment date cannot be in the future.")
        LocalDate paymentDate,

        @Schema(description = "The month the rent payment is for (1-12).", example = "10", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Reference month cannot be null.")
        @Min(value = 1, message = "Month must be between 1 and 12.")
        @Max(value = 12, message = "Month must be between 1 and 12.")
        Integer referenceMonth,

        @Schema(description = "The year the rent payment is for.", example = "2025", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Reference year cannot be null.")
        Integer referenceYear,

        @Schema(description = "Any additional fees for late payment. Cannot be negative.", example = "50.00")
        @PositiveOrZero(message = "Late fees must be a positive value or zero.")
        BigDecimal lateFees,

        @Schema(description = "Method used for payment.", example = "PIX", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Payment method cannot be null.")
        PaymentMethodEnum paymentMethod,

        @Schema(description = "Any relevant observations about this payment.")
        String notes
) {
}