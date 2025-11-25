package com.matheus.rentify.app.leases.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.matheus.rentify.app.leases.model.PaymentMethodEnum;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for responding with payment details.
 * Provides a safe and flattened view of the Payment entity.
 */
public record PaymentResponseDTO(

        @Schema(description = "Unique identifier of the payment record.", example = "451")
        Long id,

        @Schema(description = "ID of the lease this payment belongs to.", example = "15")
        Long leaseId,

        @Schema(description = "The actual amount paid.", example = "1550.00")
        BigDecimal amountPaid,

        @Schema(description = "The date the payment was received.", example = "12-10-2025")
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate paymentDate,

        @Schema(description = "The month the rent payment is for (1-12).", example = "10")
        Integer referenceMonth,

        @Schema(description = "The year the rent payment is for.", example = "2025")
        Integer referenceYear,

        @Schema(description = "Any additional fees paid for late payment.", example = "50.00")
        BigDecimal lateFees,

        @Schema(description = "Method used for payment.", example = "PIX")
        PaymentMethodEnum paymentMethod,

        @Schema(description = "Any relevant observations about this payment.")
        String notes
) {
}