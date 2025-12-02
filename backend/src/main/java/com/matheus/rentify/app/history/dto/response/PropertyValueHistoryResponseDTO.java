package com.matheus.rentify.app.history.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Data Transfer Object for responding with a historical record of a property's market value.
 */
public record PropertyValueHistoryResponseDTO(

        @Schema(description = "Unique identifier of the history record.", example = "401")
        Long id,

        @Schema(description = "ID of the property that was valued.", example = "42")
        Long propertyId,

        @Schema(description = "Address of the property for context.", example = "123 Main St, Apt 4B")
        String propertyAddress,

        @Schema(description = "The market value of the property on the record date.", example = "450000.00")
        BigDecimal propertyValue,

        @Schema(description = "The date of this valuation.", example = "2025-10-08")
        LocalDate recordDate
) {
}