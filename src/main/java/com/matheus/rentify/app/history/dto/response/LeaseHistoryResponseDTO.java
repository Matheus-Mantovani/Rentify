package com.matheus.rentify.app.history.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.matheus.rentify.app.history.model.MoveOutConditionEnum;
import com.matheus.rentify.app.people.dto.response.TenantResponseDTO;
import com.matheus.rentify.app.properties.dto.response.PropertyResponseDTO;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for responding with archived lease details.
 */
public record LeaseHistoryResponseDTO(

        @Schema(description = "Unique identifier of the history record.", example = "501")
        Long id,

        @Schema(description = "Details of the property that was leased.")
        PropertyResponseDTO property,

        @Schema(description = "Summary of the tenant who was on the lease.")
        TenantResponseDTO tenant,

        @Schema(description = "Name of the property owner/landlord at the time of the lease.", example = "Carlos Souza")
        String landlordName,

        @Schema(description = "Day of the month the payment was due.", example = "10")
        Integer paymentDueDay,

        @Schema(description = "The date the lease agreement began.", example = "01-11-2023")
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate startDate,

        @Schema(description = "The date the lease agreement ended.", example = "31-10-2024")
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate endDate,

        @Schema(description = "Base monthly rent value.", example = "2200.50")
        BigDecimal baseRentValue,

        // --- Termination Details ---
        @Schema(description = "Date the tenant moved out.", example = "31-10-2024")
        @JsonFormat(pattern = "dd-MM-yyyy")
        LocalDate moveOutDate,

        @Schema(description = "Condition of the property upon move-out.", example = "GOOD")
        MoveOutConditionEnum moveOutCondition,

        @Schema(description = "Reason for the tenant moving out.", example = "End of contract")
        String moveOutReason,

        @Schema(description = "Timestamp when this lease was archived.", example = "01-11-2024 10:30:00")
        @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
        LocalDateTime archivedAt
) {
}