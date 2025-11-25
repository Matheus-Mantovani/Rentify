package com.matheus.rentify.app.leases.dto.request;

import com.matheus.rentify.app.history.model.MoveOutConditionEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Data Transfer Object for providing the necessary details to terminate a lease.
 */
public record LeaseTerminationRequestDTO(

        @Schema(description = "Date the tenant moved out. Cannot be in the future.", example = "10-10-2025", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Move-out date cannot be null.")
        @PastOrPresent(message = "Move-out date cannot be in the past or present.")
        LocalDate moveOutDate,

        @Schema(description = "Condition of the property upon move-out.", example = "GOOD", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Move-out condition cannot be null.")
        MoveOutConditionEnum moveOutCondition,

        @Schema(description = "Reason for the tenant moving out.", example = "End of contract")
        @NotBlank(message = "Move-out reason cannot be blank.")
        @Size(max = 100)
        String moveOutReason
) {
}